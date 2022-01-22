define([
    'jquery',
    'uiComponent',
    'Magento_Ui/js/modal/confirm',
    'Magento_Customer/js/customer-data'
], function($, Component, confirm, customerData) {
    'use strict';

    return function(target) {
        return $.widget('mage.sidebar', $.mage.sidebar, {
            _initContent: function () {
                var self = this,
                    events = {};

                this.element.decorate('list', this.options.isRecursive);

                /**
                 * @param {jQuery.Event} event
                 */
                events['click ' + this.options.button.close] = function (event) {
                    event.stopPropagation();
                    $(self.options.targetElement).dropdownDialog('close');
                };
                events['click ' + this.options.button.checkout] = $.proxy(function () {
                    var cart = customerData.get('cart'),
                        customer = customerData.get('customer'),
                        element = $(this.options.button.checkout);

                    if (!customer().firstname && cart().isGuestCheckoutAllowed === false) {
                        // set URL for redirect on successful login/registration. It's postprocessed on backend.
                        $.cookie('login_redirect', this.options.url.checkout);

                        if (this.options.url.isRedirectRequired) {
                            element.prop('disabled', true);
                            location.href = this.options.url.loginUrl;
                        } else {
                            authenticationPopup.showModal();
                        }

                        return false;
                    }
                    element.prop('disabled', true);
                    location.href = this.options.url.checkout;
                }, this);

                /**
                 * @param {jQuery.Event} event
                 */
                events['click ' + this.options.button.remove] =  function (event) {
                    event.stopPropagation();
                    confirm({
                        content: $.mage.__('Are you sure you want to remove this item?'),
                        actions: {
                            /** @inheritdoc */
                            confirm: function () {
                                self._removeItem($(event.currentTarget));
                            },

                            /** @inheritdoc */
                            always: function (e) {
                                e.stopImmediatePropagation();
                            }
                        },
                        buttons: [{
                            text: $.mage.__('Yes'),
                            class: 'action-primary action-accept',
                            click: function (event) {
                                this.closeModal(event, true);
                            }
                        }, {
                            text: $.mage.__('No'),
                            class: 'action-secondary action-dismiss',
                            click: function (event) {
                                this.closeModal(event);
                            }
                        }]
                    });
                };

                /**
                 * @param {jQuery.Event} event
                 */
                events['keyup ' + this.options.item.qty] = function (event) {
                    self._showItemButton($(event.target));
                };

                /**
                 * @param {jQuery.Event} event
                 */
                events['change ' + this.options.item.qty] = function (event) {
                    self._showItemButton($(event.target));
                };

                /**
                 * @param {jQuery.Event} event
                 */
                events['click ' + this.options.item.button] = function (event) {
                    event.stopPropagation();
                    self._updateItemQty($(event.currentTarget));
                };

                /**
                 * @param {jQuery.Event} event
                 */
                events['focusout ' + this.options.item.qty] = function (event) {
                    self._validateQty($(event.currentTarget));
                };

                this._on(this.element, events);
                this._calcHeight();
                this._isOverflowed();
            },

            /**
             * Update content after item remove
             *
             * @param {Object} elem
             * @private
             */
            _removeItemAfter: function (elem) {
                var productData = this._getProductById(Number(elem.data('cart-item'))),
                    cartElement;

                if (!_.isUndefined(productData)) {

                    cartElement = elem.closest('li');
                    cartElement.height(cartElement.height());
                    cartElement.addClass('remove-opacity');

                    setTimeout(function () {
                        cartElement.addClass('remove-height');
                    }, 1000);

                    $(document).trigger('ajax:removeFromCart', {
                        productIds: [productData['product_id']]
                    });
                }
            }
        });
    }
});
