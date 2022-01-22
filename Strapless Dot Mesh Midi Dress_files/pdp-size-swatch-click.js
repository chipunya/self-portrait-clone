define([
    'jquery',
    'mage/translate',
    'Magento_Swatches/js/swatch-renderer'
], function ($, $t) {
    'use strict';
    $.widget('selfPortrait.pdpSizeSwatchClick', {
        options: {
            preorderAndLowStock: null,
            selector: null
        },

        _create: function () {
            var self = this;
            self.sizeSwatchClick();
        },

        sizeSwatchClick: function() {
            var self = this;

            $(this.options.selector).click(function() {
                var currentSimple = self.options.preorderAndLowStock[$(this).attr('option-id')];

                self.getPreorder(currentSimple);
                self.getLowstock(currentSimple);

            });

        },

        getPreorder: function(currentSimple) {
            var $preorderContainer = $('.product-info-main .pre-order span');
            var startDate = new Date(currentSimple.available_from.replace(/-/g, '/')).getTime();
            var todayDate = new Date().getTime();

            if(currentSimple.preorder != 0 && (startDate > todayDate)) {                
                $preorderContainer.html($t('Pre-order: Estimated dispatch date ') + currentSimple.formatted_available_from);
            } else {
                $preorderContainer.html('');
            }        
        },

        getLowstock: function(currentSimple) {
            var $lowstockContainer = $('.product-info-main .low-stock span');

            if(currentSimple.low_stock != 0) {                
                $lowstockContainer.html($t('Low stock'));
            } else {
                $lowstockContainer.html('');
            } 
        }
    });

    return $.selfPortrait.pdpSizeSwatchClick;
});