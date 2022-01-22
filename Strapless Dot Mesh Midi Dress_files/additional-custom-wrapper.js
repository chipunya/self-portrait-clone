define(['jquery'], function ($) {
    $('.additional-custom-wrapper.shipping .toggle').click(function () {
        $('.additional-custom-wrapper.shipping > div').toggle();
    });

    return function (config) {
        var enabled = config.enabledFor;

        $(document).ready(function () {
            var $klarnaSections = $('.klarna-wrapper'),
                $klarnaMobile = $('.klarna-description'),
                $shortDescr = $klarnaMobile.find('.short-description span'),
                $shortText = $shortDescr.data('text'),
                $finalPrice = $('.product-info-price [data-price-type="finalPrice"]'),
                priceText = $finalPrice.find('.price').text(),
                priceInt = priceText.replace(/[^\d.-]/g, ''),
                currency = priceText.replace(priceInt, '');

            var string = $shortText.replace('{{price}}', currency + (+priceInt / 3).toFixed(2));

            $shortDescr.text(string);

            $klarnaSections.find('.toggle').click(function (event) {
                event.stopImmediatePropagation();
                event.preventDefault();

                var $clicked = $(this),
                    $toggler = $('.klarna-wrapper .toggle'),
                    togglerText = $clicked.text(),
                    closedText = $toggler.data('text-close'),
                    openedText = $toggler.data('text-open');

                $klarnaSections.find('.klarna-description div.short-description').each(function() {
                    var $this = $(this);
                    var $description = $this.next('.description');

                    if( $this.is(":visible") ) {
                        $this.fadeOut('fast', function() {
                            $description.fadeIn("fast");
                        });
                    } else {
                        $description.fadeOut('fast', function() {
                            $this.fadeIn("fast");
                        });
                    }
                });

                if (togglerText === openedText) {
                    $clicked.text(closedText);
                    $toggler.text(closedText);
                } else {
                    $clicked.text(openedText);
                    $toggler.text(openedText);
                }
            });

            var interval = setInterval(function () {
                var selectedCountry = $('.selector-inner .value .country-name').first().text();

                // Enabled for all storeview
                if(enabled === '') {
                    $klarnaSections.fadeIn();
                    clearInterval(interval);
                } else {
                    if(typeof enabled === 'string') {
                        enabled = enabled.split(',');
                    }

                    $.each(enabled,function (index, value) {
                        if ($("[data-country='"+value.toUpperCase()+"'] .country-name").first().text() === selectedCountry) {
                            $klarnaSections.fadeIn();
                            clearInterval(interval);
                            return false;
                        } else if (selectedCountry !== '') {
                            clearInterval(interval);
                        }
                    });
                }
            });
        });
    };
});