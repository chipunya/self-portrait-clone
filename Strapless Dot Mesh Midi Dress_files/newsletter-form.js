define([
    'jquery',
    'mage/translate'
], function ($) {
    $.widget('selfPortrait.newsletterForm', {
        options: {
            inputSuccessClass: 'success'
        },

        _create: function () {
            var form = $(this.element),
                options = this.options,
                emailInput = $(options.newsletterInput),
                errorMessage = $.mage.__('Something went wrong with the subscription');

            form.submit(function(e) {
                form.removeClass(options.inputSuccessClass);

                if (form.validation('isValid')){
                    e.preventDefault();

                    var email = emailInput.val(),
                        url = form.attr('action');

                    try {
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            type: 'POST',
                            data: { email: email },
                            success: function (data) {
                                emailInput.val('');
                                emailInput.attr('placeholder', data.message);

                                if (data.success) {
                                    console.log(data.success);
                                    form.addClass(options.inputSuccessClass);
                                }
                            },
                            error: function() {
                                emailInput.attr('placeholder', errorMessage);
                            }
                        });
                    } catch (e){
                        emailInput.attr('placeholder', errorMessage);
                    }
                }
            });
        }
    });

    return $.selfPortrait.newsletterForm;
});
