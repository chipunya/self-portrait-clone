define([
    'jquery'
], function ($) {
    $.widget('selfPortrait.klevuCustom', {
        options: {
            mediaBreakpoint: '(max-width: 768px)'
        },
        _create: function () {
            /**
             * Change page size
             * @type {number}
             */
            if (typeof klevu_userOptions !== "undefined") {
                klevu_userOptions.recordsPerPage = 24;
            }

            /**
             * Move KLEVU elements to the search popup
             */
            $(".label.search-klevu").on('click.openModal', function () {
                const items = $('.klevu-fluid, .klevu-min-ltr').not('.moved');
                if (items.length) {
                    items.addClass('moved');
                    $('.moved-result-place').append(items);
                }
            });
        }
    });

    return $.selfPortrait.klevuCustom;
});
