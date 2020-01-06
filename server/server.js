const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const chromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse/lighthouse-core');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const apiKey = process.env.API_KEY;
const desktopConfig = require('./desktop-config.js');
const a11yAuditConf = require('./a11y-audits.js');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

app.post('/api/test_one', async function (req, res) {
    const testUrl = req.body.testUrl;

    console.log('Test one');
    let options = { chromeFlags: ['--headless', '--no-sandbox'] };
    const chrome = await chromeLauncher.launch({ chromeFlags: options.chromeFlags });
    options.port = chrome.port;
    console.log('Chrome launched');

    try {
        const results = await lighthouse(testUrl, options);
        const jsonReport = ReportGenerator.generateReport(results.lhr, 'json');
        const parsedReport = JSON.parse(jsonReport);

        res.send(parsedReport);
    } catch (error) {
        console.log('ERROR');
        throw new Error(error);
    } finally {
        await chrome.kill();
    }
});

app.post('/api/test_many', async function (req, res) {
    const testTimestamp = Math.floor(new Date() / 1000);
    const testArr = req.body.testExps;
    const device = req.body.device;
    const testCount = testArr.length;
    let resultSeries = [];
    const a11yIds = a11yAuditConf.ids_weights.map(auditDict => {
        return auditDict['id']
    });

    console.log('Running many experience test');
    console.log(`device: ${device}`);
    console.log(`Received ${testCount} test experiences`);
    let options = { chromeFlags: ['--headless', '--no-sandbox'] };
    const chrome = await chromeLauncher.launch({ chromeFlags: options.chromeFlags });
    options.port = chrome.port;
    console.log('Chrome launched');

    const testIters = async () => {
        await asyncForEach(testArr, async (expDict) => {
            const results = await lighthouse(expDict.testUrl, options, device === 'desktop' && desktopConfig);
            const jsonReport = ReportGenerator.generateReport(results.lhr, 'json');
            const parsedReport = JSON.parse(jsonReport);
            const firstContentfulPaint = parsedReport.audits['first-contentful-paint'].numericValue;
            const firstMeaningfulPaint = parsedReport.audits['first-meaningful-paint'].numericValue;
            const loadFastEnoughForPwa = parsedReport.audits['load-fast-enough-for-pwa'].score;
            const speedIndex = parsedReport.audits['speed-index'].numericValue;
            const totalBlockingTime = parsedReport.audits['total-blocking-time'].numericValue;
            const errorsInConsole = parsedReport.audits['errors-in-console'].numericValue;
            const timeToFirstByte = parsedReport.audits['time-to-first-byte'].numericValue;
            const firstCpuIdle = parsedReport.audits['first-cpu-idle'].numericValue;
            const interactive = parsedReport.audits['interactive'].numericValue;
            const totalByteWeight = parsedReport.audits['total-byte-weight'].numericValue;
            const performanceScore = parsedReport.categories['performance'].score;
            const accessibilityScore = parsedReport.categories['accessibility'].score;
            const bestPracticesScore = parsedReport.categories['best-practices'].score;
            const seoScore = parsedReport.categories['seo'].score;
            const pwaScore = parsedReport.categories['pwa'].score;
            const maxPotentialFid = parsedReport.audits['max-potential-fid'].numericValue;

            const allAudits = parsedReport.audits;
            const binaryAudits = Object.keys(allAudits).map(auditName => {
                const auditDict = allAudits[auditName];
                if (auditDict['scoreDisplayMode'] === 'binary') {
                    return auditDict
                }
            }).filter(audit => {
                return audit !== undefined
            });
            const failedBinaryAudits = binaryAudits.filter(auditDict => {
                return auditDict['score'] === 0
            });
            const failedBinaryAuditCount = failedBinaryAudits.length;

            const a11yAudits = Object.keys(allAudits).map(auditName => {
                const auditDict = allAudits[auditName];
                if (a11yIds.includes(auditDict['id'])) {
                    return auditDict
                }
            }).filter(audit => {
                return audit !== undefined
            });
            const failedA11yAudits = a11yAudits.filter(auditDict => {
                return auditDict['score'] === 0
            });

            const ACCOUNT = expDict.envTag === 'prod' ? 'creator_prod' : 'creator_stage';
            const ZENVIRONMENT = expDict.envTag;
            const ZSUBSYSTEM = 'performance_testing';
            const A11YSUBSYSTEM = 'accessibility';
            const tags = [
                `zenvironment:${ZENVIRONMENT}`,
                `zsubsystem:${ZSUBSYSTEM}`,
                `account:${ACCOUNT}`,
                'zsystem:creator',
                `expurl:${expDict.testUrl}`,
                `expid:${expDict.expId}`,
                `companyname:${expDict.companyName}`,
                `testdevice:${device}`,
                `service:lighthouse`
            ];
            const a11yTags = [
                `zenvironment:${ZENVIRONMENT}`,
                `zsubsystem:${A11YSUBSYSTEM}`,
                `account:${ACCOUNT}`,
                'zsystem:creator',
                `expurl:${expDict.testUrl}`,
                `expid:${expDict.expId}`,
                `companyname:${expDict.companyName}`,
                `testdevice:${device}`,
                `service:lighthouse`
            ];

            const auditLogs = failedBinaryAudits.map(auditDict => {
                const urlRegex = new RegExp(/(?=http).*(?=\))/);
                const urlMatch = urlRegex.exec(auditDict.description);
                const url = urlMatch ? urlMatch[0] : null;
                const message = [
                    {
                        "issue_type": auditDict.id,
                        "title": auditDict.title,
                        "message": auditDict.description,
                        "explanation": auditDict.explanation,
                        "url": url
                    }
                ];
                return {
                    "ddsource":"lighthouse",
                    "ddtags":tags.join(),
                    "message": JSON.stringify(message)
                }
            });

            const a11yLogs = failedA11yAudits.map(auditDict => {
                const urlRegex = new RegExp(/(?=http).*(?=\))/);
                const urlMatch = urlRegex.exec(auditDict.description);
                const url = urlMatch ? urlMatch[0] : null;
                const a11yMessage = [
                    {
                        "issue_type": auditDict.id,
                        "title": auditDict.title,
                        "message": auditDict.description,
                        "explanation": auditDict.explanation,
                        "url": url
                    }
                ];
                return {
                    "ddsource":"lighthouse",
                    "ddtags":a11yTags.join(),
                    "message": JSON.stringify(a11yMessage)
                }
            });

            resultSeries.push({
                "metric":"performance.first_contentful_paint",
                "points":[[testTimestamp, firstContentfulPaint]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.first_meaningful_paint",
                "points":[[testTimestamp, firstMeaningfulPaint]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.load_fast_enough_for_pwa",
                "points":[[testTimestamp, loadFastEnoughForPwa]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.speed_index",
                "points":[[testTimestamp, speedIndex]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.total_blocking_time",
                "points":[[testTimestamp, totalBlockingTime]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.errors_in_console",
                "points":[[testTimestamp, errorsInConsole]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.time_to_first_byte",
                "points":[[testTimestamp, timeToFirstByte]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.first_cpu_idle",
                "points":[[testTimestamp, firstCpuIdle]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.interactive",
                "points":[[testTimestamp, interactive]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.total_byte_weight",
                "points":[[testTimestamp, totalByteWeight]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.performance_score",
                "points":[[testTimestamp, performanceScore]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.accessibility_score",
                "points":[[testTimestamp, accessibilityScore]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.best_practices_score",
                "points":[[testTimestamp, bestPracticesScore]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.seo_score",
                "points":[[testTimestamp, seoScore]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.pwa_score",
                "points":[[testTimestamp, pwaScore]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric":"performance.max_potential_fid",
                "points":[[testTimestamp, maxPotentialFid]],
                "type":"gauge",
                "tags":tags
            });
            resultSeries.push({
                "metric": "performance.failed_binary_audits",
                "points":[[testTimestamp, failedBinaryAuditCount]],
                "type":"gauge",
                "tags":tags
            });

            if (resultSeries.length === (17 * testCount)) {

                request.post(
                    `https://http-intake.logs.datadoghq.com/v1/input/${apiKey}`,
                    { json: a11yLogs },
                    function (a11yError, a11yResponse, a11yBody) {
                        console.log(`a11y response: `);
                        console.log(a11yBody);

                        request.post(
                            `https://http-intake.logs.datadoghq.com/v1/input/${apiKey}`,
                            { json: auditLogs },
                            function (logError, logResponse, logBody) {
                                console.log(`log response: `);
                                console.log(logBody);

                                request.post(
                                    `https://api.datadoghq.com/api/v1/series?api_key=${apiKey}`,
                                    { json: { "series": resultSeries } },
                                    function (error, response, body) {
                                        console.log(`performance response:`);
                                        console.log(body);
                                        res.send({
                                            "dataDogSeriesResponse": response,
                                            "dataDogLogResponse": logResponse,
                                            "dataDogA11yResponse": a11yResponse,
                                            "payload": { "series": resultSeries },
                                            "logs": auditLogs
                                        });
                                    }
                                );
                            }
                        );
                    }
                );

                await chrome.kill();
            }
        });
        console.log('Done');
    };
    testIters();
});

app.listen(8081); //listens on port 3000 -> http://localhost:3000/
