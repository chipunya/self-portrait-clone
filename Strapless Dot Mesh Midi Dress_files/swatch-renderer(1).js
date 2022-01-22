/**
 * Scandiweb_Outfit
 *
 * @category    Scandiweb
 * @package     Scandiweb_Outfit
 * @author      Viesturs Lujans <info@scandiweb.com>
 * @copyright   Copyright (c) 2016 Scandiweb, Ltd (http://scandiweb.com)
 */

define([
    'jquery'
], function ($) {
    'use strict';

    return function (widget) {

        $.widget('mage.SwatchRenderer', widget, {
            /**
             * Emulate mouse click on all swatches that should be selected
             * Extended to work with selects
             * @param {Object} [selectedAttributes]
             * @private
             */
            _EmulateSelected: function (selectedAttributes) {
                $.each(selectedAttributes, $.proxy(function (attributeCode, optionId) {
                    var element = this.element.find('.' + this.options.classes.attributeClass +
                        '[attribute-code="' + attributeCode + '"]');

                    if (element.find('select').length > 0) {
                        element.find('select').val(optionId).trigger('change');
                    } else {
                        element.find('[option-id="' + optionId + '"]').trigger('click');
                    }
                }, this));
            }
        });

        return $.mage.SwatchRenderer;
    }
});
