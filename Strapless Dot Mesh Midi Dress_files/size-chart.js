define([
    'jquery',
    'Magento_Ui/js/modal/modal'
], function ($, modal) {
    $.widget('selfPortrait.sizeChart', {
        _create: function () {
            options = {
                type: 'slide',
                responsive: true,
                innerScroll: true,
                modalClass: 'size-guide',
                buttons: [],
            };

            var slide = modal(options, $('.size-chart-block'));

            $('.find-my-size').on('click',function() {
                $('.size-chart-block').modal('openModal');
                return false;
            });
        }
    });

    return $.selfPortrait.sizeChart;
});
