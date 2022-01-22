define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data',
], function ($, Component, customerData) {
    'use strict';

    return Component.extend({
        initialize: function (config) {

            /* For maximum synchronisation we need to invalidate and refresh customerData */
            var sections = ['cart', 'customer'];
            customerData.invalidate(sections);
            customerData.reload(sections, true);

            /* As M.2 fires Ajax on every page front, snippet fires data on ajaxStop */
            $(document).ajaxStop(function (event) {
                if (!window.wisepops) {

                    /* Set Wisepops tracking snippet */
                    var url = '//loader.wisepops.com/get-loader.js?v=1&' + config.wisepopsIdentity;
                    (function (W, i, s, e, P, o, p) {
                        W['WisePopsObject'] = P;
                        W[P] = W[P] || function () {
                            (W[P].q = W[P].q || []).push(arguments)
                        }, W[P].l = 1 * new Date();
                        o = i.createElement(s),
                          p = i.getElementsByTagName(s)[0];
                        o.async = 1;
                        o.src = e;
                        p.parentNode.insertBefore(o, p)
                    })(window, document, 'script', url, 'wisepops');

                    var customer = customerData.get('customer');
                    var cart = customerData.get('cart');

                    /* Send properties if enabled */
                    if (config.wisepopsCustomPropertiesEnable !== undefined) {
                        if (config.wisepopsCustomPropertiesEnable === 1) {
                            wisepops('properties', {
                                magentoLoggedIn: (customer().fullname !== undefined) ? 1 : 0,
                                magentoItemsInCart: cart().summary_count,
                                magentoCartValue: (cart().subtotalAmount !== null) ? cart().subtotalAmount : 0
                            });
                        }
                    }

                    /* Send GoalTracking on checkout-success-onepage */
                    if (config.fullOrderValue !== undefined && config.fullOrderValue !== 0) {
                        wisepops("goal", "magento-order", config.fullOrderValue);
                    }
                }
            });
        }
    })
});