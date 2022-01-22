define([
    'jquery',
    'mage/url',
    'matchMedia',
    'jquery/jquery.cookie'
], function ($, urlBuilder, mediaCheck) {
    $.widget('mage.countrySelector', {
        options: {
            activeSelectorClass: 'opened'
        },

        _create: function () {
            var self = this;

            this.mobileWidth = 768;
            this.mobileMaxWidth = 767;
            this.toggleButton = this.element.find('.toggle');
            var _fan = this.options.fullActionName;
            var _rId = this.options.requestId;

            this.toggleButton.on('click', function () {
                this.toggleSelector();
            }.bind(this));

            /**
             * Close country selector if user click outside of it
             */
            $('body').on('click', function (event) {
                if (!$(event.srcElement).hasClass(this.options.wrapperClass) && $(event.srcElement).closest(this.options.wrapperClass).length === 0) {
                    this.element.removeClass(this.options.activeSelectorClass);
                }
            }.bind(this));

            $(window).on('resize', function () {
                this.alignCountrySelector();
            }.bind(this));

            $('#store-switcher-cart-popup').on('click', 'a.continue', function () {
                localStorage.setItem('country', $(this).attr('data-country'));
                $.cookie('country', $(this).attr('data-country'));
                localStorage.setItem('country_id', $(this).attr('data-country_id'));
                $.cookie('country_id', $(this).attr('data-country_id'));
                localStorage.setItem('currency', $(this).attr('data-currency'));
                $.cookie('currency', $(this).attr('data-currency'));
                self.setCountry();
                self.toggleSelector();
                window.location.href = $(this).attr('data-href');
            });

            this.element.find('a').on('click', function (event) {
                event.preventDefault();
                var _country = $.trim($(this).find('.country-name').text());
                var _currency = $.trim($(this).find('.currency-symbol').text());
                var _countryId = $(this).attr('data-country');
                var _show = !$(this).closest('.modal-country-selector').length;
                var _url = BASE_URL + "alpencore/store/switcher?target=" + _countryId + "&fan=" + _fan + "&rid=" + _rId + "&show=" + _show;
                $.ajax({
                    url: _url,
                    success: function (data) {
                        if (data.show) {
                            var $popup = $('#store-switcher-cart-popup');
                            $popup.find('.content .actions a.continue').attr('data-href', data.redirect);
                            $popup.find('.content .actions a.continue').attr('data-country', _country);
                            $popup.find('.content .actions a.continue').attr('data-country_id', _countryId);
                            $popup.find('.content .actions a.continue').attr('data-currency', _currency);
                            $popup.show();
                        } else {
                            localStorage.setItem('country', _country);
                            $.cookie('country', _country);
                            localStorage.setItem('currency', _currency);
                            $.cookie('currency', _currency);
                            localStorage.setItem('country_id', _countryId);
                            $.cookie('country_id', _countryId);
                            window.location.href = data.redirect;
                            localStorage.setItem('has-shipping', 1);
                            $.cookie('has-shipping', 1);
                        }
                    }
                });
            });

            this.setCountry();
            this.initSession();
        },

        /**
         * Toggle country selector
         */
        toggleSelector: function () {
            if (this.element.hasClass(this.options.activeSelectorClass)) {
                this.element.removeClass(this.options.activeSelectorClass);
            } else {
                this.element.addClass(this.options.activeSelectorClass);
                this.alignCountrySelector();
                this.setCountrySelectorHright();
                this.adjustMobileMenuCountrySelectorHeight();
            }
        },

        /**
         * Align countries dropdown
         */
        alignCountrySelector: function () {
            var buttonOffset = this.toggleButton.offset();
            $('.countries-list .inner').css('padding-left', buttonOffset.left);
        },

        /**
         * Set countries dropdown height on mobile
         */
         setCountrySelectorHright: function () {
            var _self = this;
            var $button = this.toggleButton;
            var $countryList = $button.closest('.selector-inner').prev('.countries-list');
            var buttonOffset = this.toggleButton.offset();
            var isModal = $button.closest('.add-to-cart-country-selector').length;

            if (isModal) {
                mediaCheck({
                    media: '(min-width:' + _self.mobileWidth  + 'px)',
                    entry: function () {
                        $countryList.css('height', 'auto');
                    },
                    exit: function () {
                        $countryList.css('height', buttonOffset.top);
                    }
                });
            }
        },

        /**
         * Set countries dropdown height on mobile menu
         */
        adjustMobileMenuCountrySelectorHeight: function () {
            var _self = this;
            var $button = this.toggleButton;
            var $selectorInner = $button.closest('.selector-inner');

            var $headerContent = $(".header.content");
            var height = parseInt($selectorInner.closest(".shipping-country-selector").offset().top) - 30;
            height -= ($headerContent.offset().top + $headerContent.height() + 5);

            var $target = $selectorInner.prev(".countries-list").find(".inner");

            mediaCheck({
                media: '(max-width:' + _self.mobileMaxWidth  + 'px)',
                entry: function () {
                    if($target.parents(".mobile-menu-bottom-links").length) {
                        $target.css('height', height + "px");
                    }
                }
            });
        },



        /**
         * Set country from LocalStorage or the defaultCountry
         */
        setCountry: function () {
            var country = localStorage.getItem('country') ?
                    localStorage.getItem('country') : this.options.defaultCountry;
            var country_id = localStorage.getItem('country_id') ?
                    localStorage.getItem('country_id') : this.options.defaultCountryId;
            var currency = localStorage.getItem('currency') ?
                    localStorage.getItem('currency') : this.options.defaultCurrency;
            this.toggleButton.html('<span class="country-id">' + country_id + '</span><span class="country-name">' + country + '</span> / <span class="currency-symbol">' + currency + '</span>');
        },
        
        /**
         * init localStorage and cookies
         */
        initSession: function () {
            if (localStorage.getItem('country_id') == null || $.cookie('country_id') == null) {
                var country_id = this.options.defaultCountryId;
                $.cookie('country_id', country_id);
                localStorage.setItem('country_id', country_id);
            }
            
            if (localStorage.getItem('country') == null || $.cookie('country') == null) {
                var country = this.options.defaultCountry;
                $.cookie('country', country);
                localStorage.setItem('country', country);
            }
            
            if (localStorage.getItem('currency') == null || $.cookie('currency') == null) {
                var currency = this.options.defaultCurrency;
                $.cookie('currency', currency);
                localStorage.setItem('currency', currency);
            }
        }
    });

    return $.mage.countrySelector;
});