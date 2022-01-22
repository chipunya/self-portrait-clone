define([
    'jquery',
    'Magento_Ui/js/modal/modal',
    'matchMedia'
], function ($, modal, mediaCheck) {
    $.widget('selfPortrait.slidingModal', {
        options: {
            openTrigger: null,
            title: null,
            buttons: [],
            class: '',
            removeOverlay: false,
            removeOverlayClass: 'modal-remove-overlay',
            onlyDesktop: false,
            onlyMobile: false,
            mobileBreakpoint: '(max-width: 767px)',
            bodyClass: null,
            beforeCloseCallback: function() {}
        },

        _create: function () {
            var self = this,
                body = $('body'),
                options = {
                    type: 'popup',
                    responsive: true,
                    innerScroll: true,
                    modalClass: 'sliding-modal-right ' + self.options.class,
                    title: self.options.title,
                    buttons: self.options.buttons,
                    closed: function() {
                        if (!body.hasClass('_has-modal')) {
                            if (self.options.removeOverlay) {
                                body.removeClass(self.options.removeOverlayClass);
                            }
                            body.removeClass(self.options.bodyClass);
                        }
                    },
                    beforeClose: function() {
                        self.options.beforeCloseCallback();
                    }
                };

            if (self.options.openTrigger) {
                self.modalElement = modal(options, self.element);

                if (self.options.onlyDesktop || self.options.onlyMobile) {
                    self.handleResize();
                } else {
                    self.bindClick();
                }
            }
        },

        bindClick: function () {
            var self = this,
                body = $('body');

            $(self.options.openTrigger).on('click.openModal', function() {
                if (self.options.removeOverlay) {
                    body.addClass(self.options.removeOverlayClass);
                }
                if (self.options.bodyClass) {
                    body.addClass(self.options.bodyClass);
                }

                self.modalElement.openModal();

                $(document).on('closeModals', function() {
                    self.modalElement.closeModal();
                });
            });
        },

        handleResize: function () {
            var self = this,
                modalObject = self.modalElement.modal;

            mediaCheck({
                media: self.options.mobileBreakpoint,
                entry: $.proxy(function () {
                    if (self.options.onlyDesktop && modalObject.hasClass(self.modalElement.options.modalVisibleClass)) {
                        self.modalElement.closeModal();
                        self.modalElement._destroyOverlay();
                    }

                    if (self.options.onlyDesktop) {
                        $(self.options.openTrigger).off('click.openModal');
                    } else {
                        self.bindClick();
                    }
                }),
                exit: $.proxy(function () {
                    if (self.options.onlyMobile && modalObject.hasClass(self.modalElement.options.modalVisibleClass)) {
                        self.modalElement.closeModal();
                        self.modalElement._destroyOverlay();
                    }

                    if (self.options.onlyMobile) {
                        $(self.options.openTrigger).off('click.openModal');
                    } else {
                        self.bindClick();
                    }
                })
            });
        }
    });

    return $.selfPortrait.slidingModal;
});
