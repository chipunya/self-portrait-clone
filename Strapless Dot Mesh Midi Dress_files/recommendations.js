define([
    'jquery',
    'matchMedia',
    'slick'
], function ($, mediaCheck) {
    'use strict';

    return function (config, sliderElement) {
        var $slider = $(sliderElement);

        mediaCheck({
            media: '(max-width: 900px)',
            entry: function() {
                if (!$slider.hasClass('slick-initialized')) {
                    $slider.slick(config);
                }
            },
            exit: function() {
                if ($slider.hasClass('slick-initialized')) {
                    $slider.slick('unslick');
                }
            }
        });
    };
});