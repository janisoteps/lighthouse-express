#LightHouse as Node server
* Uses Lighthouse:
https://github.com/GoogleChrome/lighthouse
* and Expressjs:
https://github.com/expressjs/express
* Lighthouse is imported as a node module:
https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically

#Endpoints
###/api/test_one
Request: POST

```json
{
    "testUrl": "https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831",
    "envTag": "stage"
}
```

Response:

```json
{
    "series": [
        {
            "metric": "performance.speed_index",
            "points": [
                [
                    1566804115,
                    6152.653798063001
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:stage",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831"
            ]
        },
        {
            "metric": "performance.time_to_paint",
            "points": [
                [
                    1566804115,
                    6280.259
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:stage",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831"
            ]
        }
    ]
}
```

###/api/test_many

Request: POST

```json
{
    "testExps": [
        {
            "testUrl": "https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831",
            "envTag": "stage"
        },
        {
            "testUrl": "https://cnc-api.zmags.com/view/lite/5b853f4d9c5add10ea2ea058",
            "envTag": "prod"
        }
    ]
}
```

Response:

```json
{
    "series": [
        {
            "metric": "performance.speed_index",
            "points": [
                [
                    1566808265,
                    6137.074700172254
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:stage",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831"
            ]
        },
        {
            "metric": "performance.time_to_paint",
            "points": [
                [
                    1566808265,
                    6584.592999999999
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:stage",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api-dev.zmags.com/view/lite/5bbca0026b7ecf3c87b27831"
            ]
        },
        {
            "metric": "performance.speed_index",
            "points": [
                [
                    1566808265,
                    5431.085521029715
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:prod",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api.zmags.com/view/lite/5b853f4d9c5add10ea2ea058"
            ]
        },
        {
            "metric": "performance.time_to_paint",
            "points": [
                [
                    1566808265,
                    3848.283
                ]
            ],
            "type": "gauge",
            "tags": [
                "zenvironment:prod",
                "zsubsystem:performance_testing",
                "account:creator_prod",
                "zsystem:creator",
                "expurl:https://cnc-api.zmags.com/view/lite/5b853f4d9c5add10ea2ea058"
            ]
        }
    ]
}
```
