define([
    'jquery',
    'matchMedia'
], function($, mediaCheck) {
    'use strict';

    return function(target) {
        return target.extend({
            initialize: function (config, element) {
                this._super();

                this.initScroll();
                this.initCustomEvents();
            },

            /**
             * Gallery fullscreen settings.
             */
            initFullscreenSettings: function () {
                var settings = this.settings,
                    self = this;

                settings.$gallery = this.settings.$element.find('[data-gallery-role="gallery"]');
                settings.$fullscreenIcon = this.settings.$element.find('[data-gallery-role="fotorama__fullscreen-icon"]');
                settings.focusableStart = this.settings.$element.find('[data-gallery-role="fotorama__focusable-start"]');
                settings.focusableEnd = this.settings.$element.find('[data-gallery-role="fotorama__focusable-end"]');
                settings.closeIcon = this.settings.$element.find('[data-gallery-role="fotorama__fullscreen-icon"]');
                settings.fullscreenConfig.swipe = true;

                settings.$gallery.on('fotorama:fullscreenenter', function () {
                    settings.closeIcon.show();
                    settings.focusableStart.attr('tabindex', '0');
                    settings.focusableEnd.attr('tabindex', '0');
                    settings.focusableStart.bind('focusin', self._focusSwitcher);
                    settings.focusableEnd.bind('focusin', self._focusSwitcher);
                    settings.api.updateOptions(settings.defaultConfig.options, true);
                    settings.api.updateOptions(settings.fullscreenConfig, true);

                    if (!_.isEqual(settings.activeBreakpoint, {}) && settings.breakpoints) {
                        settings.api.updateOptions(settings.activeBreakpoint.options, true);
                    }
                    settings.isFullscreen = true;
                });

                settings.$gallery.on('fotorama:fullscreenexit', function () {
                    settings.closeIcon.hide();
                    settings.focusableStart.attr('tabindex', '-1');
                    settings.focusableEnd.attr('tabindex', '-1');
                    settings.api.updateOptions(settings.defaultConfig.options, true);
                    settings.focusableStart.unbind('focusin', this._focusSwitcher);
                    settings.focusableEnd.unbind('focusin', this._focusSwitcher);
                    settings.closeIcon.hide();

                    if (!_.isEqual(settings.activeBreakpoint, {}) && settings.breakpoints) {
                        settings.api.updateOptions(settings.activeBreakpoint.options, true);
                    }
                    settings.isFullscreen = false;
                    settings.$element.data('gallery').updateOptions({
                        swipe: self.isMobile()
                    });
                });
            },

            initCustomEvents: function () {
                var self = this,
                    $element = $('.fotorama-item'),
                    relatedProducts = '.catalog-product-view.big-image-container .block.related',
                    footer = '.catalog-product-view.big-image-container .page-footer';

                this.settings.$element.on('initScroll', function() {
                    self.initScroll();
                });

                $element.on('fotorama:fullscreenenter', function() {
                    $(document).off('scroll.fotoramaCustom');
                });

                $element.on('fotorama:fullscreenexit', function() {
                    if (!self.isMobile()) {
                        self.resetPosition();
                    }
                });

                $element.on('fotorama:ready', function() {
                    $(relatedProducts).css('visibility', 'visible');
                    $(footer).css('visibility', 'visible');

                    if (!$('.product-info-sticky .magnifier-preview').length) {
                        $('.magnifier-preview').appendTo('.product-info-sticky');
                    }
                    self.removeHeight100();
                });

                mediaCheck({
                    media: '(min-width: 900px)',
                    entry: function () {
                        self.resetPosition();
                        self.settings.$element.data('gallery').updateOptions({
                            swipe: false,
                            loop: false
                        });
                    },
                    exit: function () {
                        self.settings.$element.data('gallery').updateOptions({
                            swipe: true,
                            loop: true
                        });
                    }
                });
            },

            removeHeight100: function() {
                var $body = $('body');
                if( $body.hasClass('height-auto') ) {
                    $body.removeClass('height-auto');
                }
            },

            initScroll: function () {
                var settings = this.settings,
                    timer,
                    self = this;

                $(document).on('scroll.fotoramaCustom', function () {
                    if (!self.isMobile()) {
                        var difference,
                            imageIndex;

                        if (timer) clearTimeout(timer);

                        timer = setTimeout(function() {
                            $('.fotorama__stage__frame').each(function() {
                                var image = $(this),
                                    scrollPosition = $(window).scrollTop();

                                if (difference === undefined) {
                                    difference = Math.abs(image.offset().top - scrollPosition);
                                    imageIndex = self.getImageIndex(image);
                                } else if (Math.abs(image.offset().top - scrollPosition) < difference) {
                                    difference = Math.abs(image.offset().top - scrollPosition);
                                    imageIndex = self.getImageIndex(image);
                                }
                            });

                            if (settings.fotoramaApi.activeIndex !== imageIndex) {
                                settings.fotoramaApi.show({
                                    index: imageIndex,
                                    time: 0
                                });
                            }
                        }, 100);
                    }
                });
            },

            getImageIndex: function (image) {
                var i,
                    settings = this.settings,
                    activeImage = image.attr('href'),
                    imageIndex;

                for (i = 0; i < settings.fotoramaApi.data.length; i++ ) {
                    if (settings.fotoramaApi.data[i].img === activeImage ||
                        settings.fotoramaApi.data[i].full === activeImage) {
                        imageIndex = settings.fotoramaApi.data[i].i - 1;
                        break;
                    }
                }

                return imageIndex;
            },

            isMobile: function() {
                return window.innerWidth <= 900;
            },

            resetPosition: function() {
                this.settings.$element.trigger('initScroll');
                this.settings.fotoramaApi.show('<<');
                this.settings.fotoramaApi.sort(function (a, b) {
                    return a.position - b.position;
                });
            }
        });
    }
});
