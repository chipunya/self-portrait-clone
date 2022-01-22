define([
    'jquery',
    'matchMedia',
    'mage/translate',
    'jquery/ui',
    'mage/menu'
], function ($, mediaCheck) {
    $.widget('mage.menu', $.mage.menu, {
        /**
         * @private
         */
        _toggleDesktopMode: function () {
            var categoryParent, html;

            $(this.element).off('click mousedown mouseenter mouseleave');
            this._on({

                /**
                 * Prevent focus from sticking to links inside menu after clicking
                 * them (focus should always stay on UL during navigation).
                 */
                'mousedown .ui-menu-item > a': function (event) {
                    event.preventDefault();
                },

                /**
                 * Prevent focus from sticking to links inside menu after clicking
                 * them (focus should always stay on UL during navigation).
                 */
                'click .ui-state-disabled > a': function (event) {
                    event.preventDefault();
                },

                /**
                 * @param {jQuer.Event} event
                 */
                'click .ui-menu-item:has(a)': function (event) {
                    var target = $(event.target).closest('.ui-menu-item');

                    if (!this.mouseHandled && target.not('.ui-state-disabled').length) {
                        this.select(event);

                        // Only set the mouseHandled flag if the event will bubble, see #9469.
                        if (!event.isPropagationStopped()) {
                            this.mouseHandled = true;
                        }

                        // Open submenu on click
                        if (target.has('.ui-menu').length) {
                            this.expand(event);
                        } else if (!this.element.is(':focus') &&
                            $(this.document[0].activeElement).closest('.ui-menu').length
                        ) {
                            // Redirect focus to the menu
                            this.element.trigger('focus', [true]);

                            // If the active item is on the top level, let it stay active.
                            // Otherwise, blur the active item since it is no longer visible.
                            if (this.active && this.active.parents('.ui-menu').length === 1) { //eslint-disable-line
                                clearTimeout(this.timer);
                            }
                        }
                    }
                },
                /**
                 * @param {jQuery.Event} event
                 */
                'mouseenter .ui-menu-item': function (event) {
                    var target = $(event.currentTarget),
                        submenu = this.options.menus,
                        ulElement,
                        ulElementWidth,
                        width,
                        targetPageX,
                        rightBound;

                    if (target.has(submenu)) {
                        ulElement = target.find(submenu);
                        ulElementWidth = ulElement.outerWidth(true);
                        width = target.outerWidth() * 2;
                        targetPageX = target.offset().left;
                        rightBound = $(window).width();

                        $(ulElement, this).css('padding-left', targetPageX).stop().slideDown(200);

                        if (ulElementWidth + width + targetPageX > rightBound) {
                            ulElement.addClass('submenu-reverse');
                        }

                        if (targetPageX - ulElementWidth < 0) {
                            ulElement.removeClass('submenu-reverse');
                        }

                        if (ulElement.length > 0) {
                            // Close all opened mage.dropdownDialog elements
                            $('body').trigger('click.outsideDropdown');
                        }
                    }

                    // Remove ui-state-active class from siblings of the newly focused menu item
                    // to avoid a jump caused by adjacent elements both having a class with a border
                    target.siblings().children('.ui-state-active').removeClass('ui-state-active');
                    this.focus(event, target);
                },

                /**
                 * @param {jQuery.Event} event
                 */
                'mouseleave': function (event) {
                    var target = $(event.currentTarget),
                        submenu = this.options.menus,
                        ulElement = target.find(submenu),
                        pageHeader = $('.page-header');

                    pageHeader.addClass('animating');
                    $(ulElement, this).stop().slideUp(200);
                    setTimeout(function () {
                        pageHeader.removeClass('animating');
                    }, 200);

                    this.collapseAll(event, true);
                },

                /**
                 * Mouse leave.
                 */
                'mouseleave .ui-menu': 'collapseAll'
            });

            categoryParent = this.element.find('.all-category');
            html = $('html');

            categoryParent.remove();

            if (html.hasClass('nav-open')) {
                html.removeClass('nav-open');
                setTimeout(function () {
                    html.removeClass('nav-before-open');
                }, this.options.hideDelay);
            }
        },

        /**
         * @private
         */
        _toggleMobileMode: function () {
            var self = this,
                subMenus;

            $(this.element).off('mouseenter mouseleave');
            this._on({

                /**
                 * @param {jQuery.Event} event
                 */
                'click .ui-menu-item:has(a)': function (event) {
                    var target,
                        sublist,
                        targetPageX,
                        currentSublist,
                        submenu = this.options.menus;

                    event.preventDefault();
                    target = ($(event.target).closest('.level1').length) ? $(event.target).closest('.level1') : $(event.target).closest('.ui-menu-item');

                    if (!target.hasClass('all-category') && (!target.hasClass('level-top') || !target.has('.ui-menu').length)) {
                        window.location.href = target.find('> a').attr('href');
                    } else {
                        $('.menu-sections-inner').get(0).scrollIntoView();
                    }

                    sublist = self.active.find('> .sub-menu-wrapper');
                    if (self.active.hasClass('parent') && sublist.length > 0 && sublist.is(':visible')) {
                        $('.page-header').addClass('hide-first-level-menu');
                    }

                    currentSublist = target.find('> .submenu');
                    mediaCheck({
                        media: '(orientation: portrait)',
                        entry: $.proxy(function () {
                            if(self.checkOverflow(currentSublist)) {
                                var currentSublistItems = currentSublist.find('> li.level1');
                                currentSublistItems.css({'line-height': 1.05, 'font-size' : ''}); //reset font-size
                                
                                var currentFontsize = parseInt(currentSublistItems.css('font-size'));
                                var counter = 0;

                                while(self.checkOverflow(currentSublist) && counter <= 20) {
                                    currentFontsize = currentFontsize - 0.5;
                                    currentSublistItems.css('font-size', currentFontsize + 'px');
                                    counter++;
                                }
                            }
                        }, this),
                        exit: $.proxy(function () {
                            currentSublist.find('> li.level1').removeAttr('style');
                        }, this)
                    });
                },

                /**
                 * @param {jQuery.Event} event
                 */
                'click .ui-menu-item:has(.ui-state-active)': function (event) {
                    this.collapseAll(event, true);
                }
            });

            subMenus = this.element.find('.level-top');
            $.each(subMenus, $.proxy(function (index, item) {
                var category = $(item).find('> a span').not('.ui-menu-icon').text(),
                    menu = $(item).find('> .ui-menu');

                this.categoryLink = $('<span>')
                    .text(category);

                this.categoryParent = $('<div>')
                    .addClass('ui-menu-item all-category')
                    .html(this.categoryLink);

                if (menu.find('.all-category').length === 0) {
                    menu.prepend(this.categoryParent);
                }

            }, this));
        },

        checkOverflow: function(el){
            var curOverflow = el[0].style.overflow;
            
            if ( !curOverflow || curOverflow === "visible" ) {
                el[0].style.overflow = "hidden";
            }
                
            var isOverflowing = el[0].clientHeight < el[0].scrollHeight;
            el[0].style.overflow = curOverflow;

            return isOverflowing;
        },

        closeSecondLevelMenu: function () {
            $('.page-header').removeClass('hide-first-level-menu');
            $('.menu-sections-inner').height('')
        },

        /**
         * @param {jQuery.Event} event
         */
        expand: function (event) {
            var newItem = this.active &&
                this.active
                    .children('.ui-menu ')
                    .children('.ui-menu-item')
                    .first();

            $('.shipping-country-selector').removeClass('opened');

            if (newItem && newItem.length) {
                var baseURI = newItem.parent()[0].baseURI;

                if (baseURI.length &&
                    baseURI.indexOf('shoes-accessories') !== -1) {
                    return;
                }

                this._open(newItem.parent());

                // Delay so Firefox will not hide activedescendant change in expanding submenu from AT
                this._delay(function () {
                    this.focus(event, newItem);
                });
            }
        },

        /**
         * @param {jQuery.Event} event
         */
        collapse: function (event) {
            this.closeSecondLevelMenu();

            var newItem = this.active &&
                this.active.parent().closest('.ui-menu-item', this.element);

            if (newItem && newItem.length) {
                this._close();
                this.focus(event, newItem);
            }
        },

        /**
         * @param {jQuery.Event} event
         * @param {*} all
         */
        collapseAll: function (event, all) {
            this.closeSecondLevelMenu();

            if ($(event.target).closest('.shipping-country-selector .selector-inner').length > 0) {
                return;
            }

            clearTimeout(this.timer);

            // If we were passed an event, look for the submenu that contains the event
            var currentMenu = all ? this.element :
                $(event && event.target).closest(this.element.find('.ui-menu'));

            currentMenu.addClass('before-hide');

            this.timer = this._delay(function () {
                // If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
                if (!currentMenu.length) {
                    currentMenu = this.element;
                }

                this._close(currentMenu);

                this.blur(event);
                this.activeMenu = currentMenu;
                currentMenu.removeClass('before-hide');
            }, this.options.hideDelay);
        }
    });

    return $.mage.menu;
});
