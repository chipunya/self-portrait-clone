define([
    'jquery',
    'matchMedia'
], function ($, mediaCheck) {
    $.widget('selfPortrait.toggleContent', {
        _create: function () {
            var self = this;

            this.productContainer = $(this.options.productContainer);
            this.productContainer.addClass('hide-product-elements');
            this.productContainer.addClass('big-image-container');
            this.hideProductElementsClass = 'hide-product-elements';
            this.hideProductNamePriceClass = 'hide-product-name-price';
            this.bigImageContainerClass = 'big-image-container';
            this.smallImageContainerClass = 'small-image-container';
            this.mobileWidth = 900;
            $(this.element).on('click', function () {
                this.showContent();
            }.bind(this));
            this.customScroll();
            this.selectUkSizeButton = $('.select-your-uk-size');
            this.slickSelector = '.slick-initialized';

            mediaCheck({
                media: '(min-width:' + self.mobileWidth  + 'px)',
                entry: function () {
                    if (self.productContainer.hasClass(self.smallImageContainerClass)) {
                        self.hideContent();
                    }
                },
                exit: function () {
                    if (self.selectUkSizeButton.is(':hidden')) {
                        self.selectUkSizeButton.show();
                    }
                }
            });
        },

        showContent: function() {
            this.productContainer.removeClass(this.hideProductElementsClass).addClass(this.hideProductNamePriceClass);
            this.productContainer.removeClass(this.bigImageContainerClass).addClass(this.smallImageContainerClass);
            if ($(this.slickSelector).length) {
                $(this.slickSelector).slick('setPosition');
            }
        },

        hideContent: function() {
            this.productContainer.addClass(this.hideProductElementsClass).removeClass(this.hideProductNamePriceClass);
            this.productContainer.addClass(this.bigImageContainerClass).removeClass(this.smallImageContainerClass);
        },

        customScroll: function () {
            var self = this;

            $(document).on('scroll.customPdp', function() {
                if (window.innerWidth < self.mobileWidth) {
                    if ($(document).scrollTop() !== 0) {
                        self.showContent();
                    } else {
                        self.hideContent();
                    }
                }
            });
        },
    });

    return $.selfPortrait.toggleContent;
});
