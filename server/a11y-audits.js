'use strict';

const a11y = {
    ids: [
        'accesskeys',
        'aria-allowed-attr',
        'aria-required-attr',
        'aria-required-children',
        'aria-required-parent',
        'aria-roles',
        'aria-valid-attr-value',
        'aria-valid-attr',
        'audio-caption',
        'button-name',
        'bypass',
        'color-contrast',
        'definition-list',
        'dlitem',
        'document-title',
        'duplicate-id',
        'frame-title',
        'html-has-lang',
        'html-lang-valid',
        'image-alt',
        'input-image-alt',
        'label',
        'layout-table',
        'link-name',
        'list',
        'listitem',
        'meta-refresh',
        'meta-viewport',
        'object-alt',
        'tabindex',
        'valid-lang',
        'video-caption',
        'video-description',
        'custom-controls-labels',
        'logical-tab-order',
        'focusable-controls',
        'interactive-element-affordance',
        'managed-focus',
        'focus-traps',
        'custom-controls-labels',
        'custom-controls-roles',
        'visual-order-follows-dom',
        'offscreen-content-hidden',
        'heading-levels',
        'use-landmarks'
    ],
    ids_weights: [
        {
            "id": "accesskeys",
            "weight": 0,
            "group": "a11y-navigation"
        },
        {
            "id": "aria-allowed-attr",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-required-attr",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-required-children",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-required-parent",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-roles",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-valid-attr-value",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "aria-valid-attr",
            "weight": 0,
            "group": "a11y-aria"
        },
        {
            "id": "audio-caption",
            "weight": 0,
            "group": "a11y-audio-video"
        },
        {
            "id": "button-name",
            "weight": 10,
            "group": "a11y-names-labels"
        },
        {
            "id": "bypass",
            "weight": 0,
            "group": "a11y-navigation"
        },
        {
            "id": "color-contrast",
            "weight": 3,
            "group": "a11y-color-contrast"
        },
        {
            "id": "definition-list",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "dlitem",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "document-title",
            "weight": 3,
            "group": "a11y-names-labels"
        },
        {
            "id": "duplicate-id",
            "weight": 0,
            "group": "a11y-best-practices"
        },
        {
            "id": "frame-title",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "html-has-lang",
            "weight": 3,
            "group": "a11y-language"
        },
        {
            "id": "html-lang-valid",
            "weight": 0,
            "group": "a11y-language"
        },
        {
            "id": "image-alt",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "input-image-alt",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "label",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "layout-table",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "link-name",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "list",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "listitem",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "meta-refresh",
            "weight": 0,
            "group": "a11y-best-practices"
        },
        {
            "id": "meta-viewport",
            "weight": 10,
            "group": "a11y-best-practices"
        },
        {
            "id": "object-alt",
            "weight": 0,
            "group": "a11y-names-labels"
        },
        {
            "id": "tabindex",
            "weight": 3,
            "group": "a11y-navigation"
        },
        {
            "id": "td-headers-attr",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "th-has-data-cells",
            "weight": 0,
            "group": "a11y-tables-lists"
        },
        {
            "id": "valid-lang",
            "weight": 0,
            "group": "a11y-language"
        },
        {
            "id": "video-caption",
            "weight": 0,
            "group": "a11y-audio-video"
        },
        {
            "id": "video-description",
            "weight": 0,
            "group": "a11y-audio-video"
        },
        {
            "id": "logical-tab-order",
            "weight": 0
        },
        {
            "id": "focusable-controls",
            "weight": 0
        },
        {
            "id": "interactive-element-affordance",
            "weight": 0
        },
        {
            "id": "managed-focus",
            "weight": 0
        },
        {
            "id": "focus-traps",
            "weight": 0
        },
        {
            "id": "custom-controls-labels",
            "weight": 0
        },
        {
            "id": "custom-controls-roles",
            "weight": 0
        },
        {
            "id": "visual-order-follows-dom",
            "weight": 0
        },
        {
            "id": "offscreen-content-hidden",
            "weight": 0
        },
        {
            "id": "heading-levels",
            "weight": 0
        },
        {
            "id": "use-landmarks",
            "weight": 0
        }
    ]
};

module.exports = a11y;
