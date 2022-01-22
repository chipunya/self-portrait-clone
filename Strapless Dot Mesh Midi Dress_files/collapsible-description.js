define([
    'jquery'
], function ($) {
    $.widget('selfPortrait.collapsibleDescription', {
        _create: function () {
            $(this.options.detailsButton).on('click', function() {
                this.collapse();
            }.bind(this));
        },

        collapse: function() {
            $(this.element).slideToggle();
        }
    });

    return $.selfPortrait.collapsibleDescription;
});
