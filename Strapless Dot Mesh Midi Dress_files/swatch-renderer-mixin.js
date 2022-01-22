define([
    'jquery'
], function ($) {
    'use strict';
    return function (SwatchRenderer) {
        $.widget('mage.SwatchRenderer', $['mage']['SwatchRenderer'], {
            _init: function () {
                this._super();

                this.$selectSizeButton = $('#product-select-size-button');
                this.$selectAddToCartButton = $('#product-addtocart-button');
                this.$attributeSizeSwatch = $('.swatch-attribute.dress_size,.swatch-attribute.footwear_size,.swatch-attribute.eyewear_size');
                this.customBindings();
            },

            /**
             * Event for swatch options
             *
             * @param {Object} $this
             * @param {Object} $widget
             * @private
             */
            _OnClick: function ($this, $widget) {
                if (!$this.hasClass('selected')) {
                    this._super($this, $widget);
                }
//                if ($this.parent().find('.swatch-option.selected').length === 0) {
//                    var $preorderContainer = $('.product-info-main .pre-order span');
//                    if ($preorderContainer.length > 0) {
//                        $preorderContainer.each(function () {
//                            $(this).html($(this).attr('data-default-label'));
//                        });
//                    }
//                }
                this.validateAttributeSelected();
            },

            /**
             * Validate size attribute selected
             */
            validateAttributeSelected: function() {
                var optionSelected = false;

                if (!this.$attributeSizeSwatch) {
                    return;
                }

                this.$attributeSizeSwatch.each(function(item, element) {
                    if (typeof $(element).attr('option-selected') !== 'undefined') {
                        optionSelected = true;
                    }
                });
                if (optionSelected) {
                    this.$selectSizeButton.hide();
                    this.$selectAddToCartButton.show();
                } else {
                    this.$selectSizeButton.show();
                    this.$selectAddToCartButton.hide();
                }
            },

            /**
             * Skip loading Media on swatch changes
             *
             * @private
             */
            _loadMedia: function () {
                return;
            },

            /**
             * Render controls
             *
             * @private
             */
            _RenderControls: function () {
                var $widget = this,
                    container = this.element,
                    classes = this.options.classes,
                    chooseText = this.options.jsonConfig.chooseText;

                $widget.optionsMap = {};

                $.each(this.options.jsonConfig.attributes, function () {
                    var item = this,
                        chooseText = item.code === 'color' ? 'Color' : chooseText,
                        controlLabelId = 'option-label-' + item.code + '-' + item.id,
                        options = $widget._RenderSwatchOptions(item, controlLabelId),
                        select = $widget._RenderSwatchSelect(item, chooseText),
                        input = $widget._RenderFormInput(item),
                        listLabel = '',
                        label = '';

                    // Show only swatch controls
                    if ($widget.options.onlySwatches && !$widget.options.jsonSwatchConfig.hasOwnProperty(item.id)) {
                        return;
                    }

                    if ($widget.options.enableControlLabel) {
                        label +=
                            '<span id="' + controlLabelId + '" class="' + classes.attributeLabelClass + '">' +
                            $('<i></i>').text(item.label).html() +
                            '</span>' +
                            '<span class="' + classes.attributeSelectedOptionLabelClass + '"></span>';
                    }

                    if ($widget.inProductList) {
                        $widget.productForm.append(input);
                        input = '';
                        listLabel = 'aria-label="' + $('<i></i>').text(item.label).html() + '"';
                    } else {
                        listLabel = 'aria-labelledby="' + controlLabelId + '"';
                    }

                    // Create new control
                    container.append(
                        '<div class="' + classes.attributeClass + ' ' + item.code + '" ' +
                        'attribute-code="' + item.code + '" ' +
                        'attribute-id="' + item.id + '">' +
                        label +
                        '<div aria-activedescendant="" ' +
                        'tabindex="0" ' +
                        'aria-invalid="false" ' +
                        'aria-required="true" ' +
                        'role="listbox" ' + listLabel +
                        'class="' + classes.attributeOptionsWrapper + ' clearfix">' +
                        options + select +
                        '</div>' + input +
                        '</div>'
                    );

                    $widget.optionsMap[item.id] = {};

                    // Aggregate options array to hash (key => value)
                    $.each(item.options, function () {
                        if (this.products.length > 0) {
                            $widget.optionsMap[item.id][this.id] = {
                                price: parseInt(
                                    $widget.options.jsonConfig.optionPrices[this.products[0]].finalPrice.amount,
                                    10
                                ),
                                products: this.products
                            };
                        }
                    });
                });

                // Connect Tooltip
                container
                    .find('[option-type="1"], [option-type="2"], [option-type="0"], [option-type="3"]')
                    .SwatchRendererTooltip();

                // Hide all elements below more button
                $('.' + classes.moreButton).nextAll().hide();

                // Handle events like click or change
                $widget._EventListener();

                // Rewind options
                $widget._Rewind(container);

                //Emulate click on all swatches from Request
                if (!$widget.inProductList) {
                    $widget._preSelectOnlyOption(this.options.jsonConfig.attributes);
                }

                $widget._EmulateSelected($.parseQuery());
                $widget._EmulateSelected($widget._getSelectedAttributes());
            },

            /**
             * Pre-select attribute if it have only one option
             * @private
             */
            _preSelectOnlyOption: function (productOptions) {
                var $widget = this;

                $.each(productOptions, function () {
                    if (this.options.length === 1 && this.options[0].id !== undefined) {
                        var element = $widget.element.find('[attribute-id="' + this.id + '"]'),
                            optionId = this.options[0].id;

                        if (element.find('select').length > 0) {
                            element.find('select').val(optionId).trigger('change');
                        } else {
                            element.find('[option-id="' + optionId + '"]').trigger('click');
                        }
                    }
                });
            },

            customBindings: function () {
                $('.swatch-attribute.dress_colour').clone().appendTo(this.options.mobileContainer);
            },
            
            /**
            * Render swatch options by part of config
            *
            * @param {Object} config
            * @param {String} controlId
            * @returns {String}
            * @private
            */
            _RenderSwatchOptions: function (config, controlId) {
               var optionConfig = this.options.jsonSwatchConfig[config.id],
                   optionClass = this.options.classes.optionClass,
                   sizeConfig = this.options.jsonSwatchImageSizeConfig,
                   moreLimit = parseInt(this.options.numberToShow, 10),
                   moreClass = this.options.classes.moreButton,
                   moreText = this.options.moreButtonText,
                   countAttributes = 0,
                   html = '';

               if (!this.options.jsonSwatchConfig.hasOwnProperty(config.id)) {
                   return '';
               }

               $.each(config.options, function (index) {
                   var id,
                       type,
                       value,
                       thumb,
                       label,
                       width,
                       height,
                       attr,
                       swatchImageWidth,
                       swatchImageHeight;

                   if (!optionConfig.hasOwnProperty(this.id)) {
                       return '';
                   }

                   // Add more button
                   if (moreLimit === countAttributes++) {
                       html += '<a href="#" class="' + moreClass + '"><span>' + moreText + '</span></a>';
                   }

                   id = this.id;
                   type = parseInt(optionConfig[id].type, 10);
                   value = optionConfig[id].hasOwnProperty('value') ?
                       $('<i></i>').text(optionConfig[id].value).html() : '';
                   thumb = optionConfig[id].hasOwnProperty('thumb') ? optionConfig[id].thumb : '';
                   width = _.has(sizeConfig, 'swatchThumb') ? sizeConfig.swatchThumb.width : 110;
                   height = _.has(sizeConfig, 'swatchThumb') ? sizeConfig.swatchThumb.height : 90;
                   label = this.label ? $('<i></i>').text(this.label).html() : '';
                   attr =
                       ' id="' + controlId + '-item-' + id + '"' +
                       ' index="' + index + '"' +
                       ' aria-checked="false"' +
                       ' aria-describedby="' + controlId + '"' +
                       ' tabindex="0"' +
                       ' option-type="' + type + '"' +
                       ' option-id="' + id + '"' +
                       ' option-label="' + label + '"' +
                       ' aria-label="' + label + '"' +
                       ' option-tooltip-thumb="' + thumb + '"' +
                       ' option-tooltip-value="' + value + '"' +
                       ' role="option"' +
                       ' thumb-width="' + width + '"' +
                       ' thumb-height="' + height + '"';

                   swatchImageWidth = _.has(sizeConfig, 'swatchImage') ? sizeConfig.swatchImage.width : 30;
                   swatchImageHeight = _.has(sizeConfig, 'swatchImage') ? sizeConfig.swatchImage.height : 20;

                   if (!this.hasOwnProperty('products') || this.products.length <= 0) {
                       attr += ' option-empty="true"';
                   }

                   if (type === 0) {
                       // Text
                       html += '<div class="' + optionClass + ' text" ' + attr + '>' + label + '</div>';
                   } else if (type === 1) {
                       // Color
                       html += '<div class="' + optionClass + ' color" ' + attr +
                           ' style="background: ' + value +
                           ' no-repeat center; background-size: initial;">' + '' +
                           '</div>';
                   } else if (type === 2) {
                       // Image
                       html += '<div class="' + optionClass + ' image" ' + attr +
                           ' style="background: url(' + value + ') no-repeat center; background-size: initial;width:' +
                           swatchImageWidth + 'px; height:' + swatchImageHeight + 'px">' + '' +
                           '</div>';
                   } else if (type === 3) {
                       // Clear
                       html += '<div class="' + optionClass + '" ' + attr + '></div>';
                   } else {
                       // Default
                       html += '<div class="' + optionClass + '" ' + attr + '>' + label + '</div>';
                   }
               });

               return html;
           },

            /**
             * Update total price.
             * Override to fix old price not showing on page load when all options not yet selected.
             *
             * @private
             */
            _UpdatePrice: function () {
                var $widget = this,
                    $product = $widget.element.parents($widget.options.selectorProduct),
                    $productPrice = $product.find(this.options.selectorProductPrice),
                    options = _.object(_.keys($widget.optionsMap), {}),
                    result,
                    tierPriceHtml,
                    isShow;

                $widget.element.find('.' + $widget.options.classes.attributeClass + '[option-selected]').each(function () {
                    var attributeId = $(this).attr('attribute-id');

                    options[attributeId] = $(this).attr('option-selected');
                });

                result = $widget.options.jsonConfig.optionPrices[_.findKey($widget.options.jsonConfig.index, options)];

                $productPrice.trigger(
                    'updatePrice',
                    {
                        'prices': $widget._getPrices(result, $productPrice.priceBox('option').prices)
                    }
                );

                // Fix for hidden old price when options not selected
                isShow = typeof result == 'undefined' || result.oldPrice.amount !== result.finalPrice.amount;

                $product.find(this.options.slyOldPriceSelector)[isShow ? 'show' : 'hide']();

                if (typeof result != 'undefined' && result.tierPrices.length) {
                    if (this.options.tierPriceTemplate) {
                        tierPriceHtml = mageTemplate(
                            this.options.tierPriceTemplate,
                            {
                                'tierPrices': result.tierPrices,
                                '$t': $t,
                                'currencyFormat': this.options.jsonConfig.currencyFormat,
                                'priceUtils': priceUtils
                            }
                        );
                        $(this.options.tierPriceBlockSelector).html(tierPriceHtml).show();
                    }
                } else {
                    $(this.options.tierPriceBlockSelector).hide();
                }

                $(this.options.normalPriceLabelSelector).hide();

                _.each($('.' + this.options.classes.attributeOptionsWrapper), function (attribute) {
                    if ($(attribute).find('.' + this.options.classes.optionClass + '.selected').length === 0) {
                        if ($(attribute).find('.' + this.options.classes.selectClass).length > 0) {
                            _.each($(attribute).find('.' + this.options.classes.selectClass), function (dropdown) {
                                if ($(dropdown).val() === '0') {
                                    $(this.options.normalPriceLabelSelector).show();
                                }
                            }.bind(this));
                        } else {
                            $(this.options.normalPriceLabelSelector).show();
                        }
                    }
                }.bind(this));
            }
        });

        return $['mage']['SwatchRenderer'];
    };
});
