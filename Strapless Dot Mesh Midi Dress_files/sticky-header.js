define([
    'jquery'
], function ($) {
    $.widget('selfPortrait.stickyHeader', {
        _create: function () {
            $(window).on('scroll', function() {
                this.detectOffset();
            }.bind(this));

            this.detectOffset();
        },

        /**
         * Check if page is scrolled
         */
        detectOffset: function() {
            if (window.pageYOffset > 0) {
                this.element.addClass('scrolled');
            } else {
                this.element.removeClass('scrolled');
            }
        }
    });

    return $.selfPortrait.stickyHeader;
});
