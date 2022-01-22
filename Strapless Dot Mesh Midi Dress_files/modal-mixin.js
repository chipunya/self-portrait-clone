define([
    'jquery',
    'underscore'
], function($, _) {
    'use strict';

    return function (targetWidget) {
        $.widget('mage.modal', targetWidget, {
            closeModal: function () {
                var that = this;

                var beforeClose = _.bind(this._trigger, this, 'beforeClose', this.modal);
                beforeClose();

                this._removeKeyListener();
                this.options.isOpen = false;
                this.modal.one(this.options.transitionEvent, function () {
                    that._close();
                });
                this.modal.removeClass(this.options.modalVisibleClass);

                if (!this.options.transitionEvent) {
                    that._close();
                }

                return this.element;
            },

            /**
             * Creates overlay, append it to wrapper, set previous click event on overlay.
             */
            _createOverlay: function () {
                var events,
                    outerClickHandler = this.options.outerClickHandler || this.closeModal;

                this.overlay = $('.' + this.options.overlayClass);

                if (!this.overlay.length) {
                    $(this.options.appendTo).addClass(this.options.parentModalClass);
                    this.overlay = $('<div></div>')
                        .addClass(this.options.overlayClass)
                        .appendTo(this.modalWrapper);

                    setTimeout(function() {
                        this.overlay.addClass('visible');
                    }.bind(this), 1);
                }
                events = $._data(this.overlay.get(0), 'events');
                events ? this.prevOverlayHandler = events.click[0].handler : false;
                this.options.clickableOverlay ? this.overlay.unbind().on('click', outerClickHandler) : false;
            },

            /**
             * Destroy overlay.
             */
            _destroyOverlay: function () {
                if (this._getVisibleCount()) {
                    this.overlay.unbind().on('click', this.prevOverlayHandler);
                } else {
                    this.overlay.removeClass('visible');
                    setTimeout(function() {
                        $(this.options.appendTo).removeClass(this.options.parentModalClass);
                        if (this.overlay) {
                            this.overlay.remove();
                            this.overlay = null;
                        }
                    }.bind(this), 600);
                }
            }
        });

        return $.mage.modal;
    };
});
