/*global console*/

/**
 * Modal dialog component.
 *
 * Full viewport modal dialog, markup for this component exists in
 * /app/Views/Shared/Modals/. For back end implementation details see
 * Mark Staples (marks@campaignmonitor.com). The markup for the modal dialog
 * sits in the root of the `body` element.
 *
 * They're many different configuration options for this component, all set via
 * the `ViewBag.[...]` configuration options within the modal dialog Razor
 * view, to see them all open the ModalLayout.cshtml view which is the master
 * template file for all the modal dialog views.
 *
 * They're 4 types of modal dialogs:
 *
 * 1. User initiated (currently not supported)
 * 2. Show on page load (currently the default)
 * 3. Multi-stepped
 * 4. Non dismissible (which is most commonly used for multi-stepped modals)
 *
 * The accessibility of the modal dialog uses this technique:
 * http://accessibility.oit.ncsu.edu/training/aria/modal-window/version-3/
 *
 * N.B. a lot of cleanup needs to happen with this component, see:
 * http://campmon.com/jira/browse/CM-33956
 */


if (!window.CS) {
    window.CS = {};
}
if (!window.CS.Components) {
    window.CS.Components = {};
}


$(function() {
    (function($) {

        var name = 'modalDialog',
            // The main JS hook for this component
            hook = '.js-modal-dialog',
            // The JS hook that is used to target all the HTML underneath this
            // component
            underneath = '.js-modal-dialog-underneath',
            // State class used to show elements
            stateHookToShowElements = 'is-visible',
            // State class used to target the underneath UI when the modal
            // dialog is visible
            stateHookToTargetUIUnderneath = 'is-modal-visible',
            // State class used to apply `display: none` to the modal dialog
            // underlay once it has been dismissed
            stateHookForWhenModalIsDismissed = 'is-dismissed',
            nextID = 0;

        $[name] = function(component, options) {
            this.$component = $(component || hook);
            this.id = this.$component.attr('id') || nextID++;
            this.debug('Binding', this.$component);

            // Actions
            this.$backAction  = $('.js-modal-dialog-action-back', this.$component);
            this.$nextAction  = $('.js-modal-dialog-action-next', this.$component);
            this.$doneAction  = $('.js-modal-dialog-action-done', this.$component);

            // Close modal button
            this.$closeModal = $('.js-modal-dialog-close', this.$component);

            // Multi-stepped modals
            this.$multiStepTarget = $('.js-modal-dialog-multi-step-target', this.$component);
            this.$multiStepItem   = $('.js-modal-dialog-multi-step-item', this.$component);

            // CTA
            this.$callToAction = $('.js-modal-dialog-cta', this.$component);

            // No callback
            this.noCallBack = 'js-modal-dialog-no-callback';

            // The underlay
            this.$underlay              = this.$component.parent('.js-modal-dialog-underlay');
            this.underlayNonDismissable = 'js-modal-dialog-underlay-non-dismissable';

            // Other
            this.existingFocus    = undefined;
            this.currentStep      = undefined;
            this.tabbableElements = undefined;
            this.init(options);
        };


        /**
         * Set defaults.
         */

        $[name].defaults = {
            allowclose: false,
            callback: undefined
        };


        /**
         * Initialise.
         */

        $[name].prototype = {
            init: function(options) {

                var that = this;

                if (options === true) {
                    options = this.getOptions(this.$component);
                }

                this.setOptions(options);


                /**
                 * Event handlers.
                 */

                // Actions
                if (this.$backAction !== undefined)
                    this.$backAction.click(function(e) {
                        that.setStep(that.currentStep - 1);
                        return false;
                    });

                if (this.$nextAction !== undefined)
                    this.$nextAction.click(function(e) {
                        that.setStep(that.currentStep + 1);
                        return false;
                    });

                // Close modal dialog
                if (this.$closeModal !== undefined)
                    this.$closeModal.click(function(e) {
                        that.hide($(e.currentTarget));
                        return false;
                    });

                if (this.$doneAction !== undefined)
                    this.$doneAction.click(function(e) {
                        that.hide($(e.currentTarget));
                        return false;
                    });

                // CTA
                if (this.$callToAction !== undefined)
                    this.$callToAction.click(function(e) {
                        var element = $(e.currentTarget);
                        that.hide($(e.currentTarget));

                        if (element.attr('href') !== undefined && element.attr('href').length > 0) {
                            window.location = e.currentTarget.href;
                        }
                        return false;
                    });


                /**
                 * Key strokes.
                 */

                this.$component.keydown(function(e) {

                    // Tab key, loop through all the natively focusable elements
                    // within the modal dialog
                    if (e.which === 9) {
                        that.tabbableElements = that.$component.find(':tabbable');
                        var focused = that.tabbableElements.index(document.activeElement);
                        focused = (focused + (e.shiftKey ? -1 : 1)) % that.tabbableElements.length;
                        if (focused < 0) {
                            focused += that.tabbableElements.length;
                        }
                        that.tabbableElements[focused].focus();
                        return false;
                    }

                    // Left arrow, move to the next step if a multi-stepped
                    // modal dialog
                    else if (e.which === 37) {
                        if (that.$backAction.hasClass(stateHookToShowElements)) {
                            that.$backAction.click();
                            return false;
                        }
                    }

                    // Right arrow, move to the next step if a multi-stepped
                    // modal dialog
                    else if (e.which === 39) {
                        if (that.$nextAction.hasClass(stateHookToShowElements)) {
                            that.$nextAction.click();
                            return false;
                        }
                    }

                    // Esc, close the modal dialog
                    else if (e.which === 27) {
                        if (that.options.allowclose) {
                            that.hide($(e.currentTarget));
                        }
                        return false;
                    }

                    return true;
                });


                /**
                 * Click event on the modal dialog.
                 */

                this.$component.click(function(e) {
                    e.stopPropagation();
                    that.multiStep();
                    return true;
                });


                /**
                 * Click event on the modal dialog underlay.
                 */

                this.$underlay.click(function(e) {
                    var element = $(e.currentTarget);
                    if (element.hasClass(that.underlayNonDismissable)) {
                        that.multiStep();
                    }
                    else {
                        that.hide($(e.currentTarget));
                    }
                    return false;
                });

                // Start with the first step if multi-stepped modal dialog
                this.setStep(0);
            },


            /**
             * Get and set options from the `data-cs-<option>` attributes.
             */

            getOptions: function($component) {
                var options = {};
                $.each($component.get(0).attributes, function(index, attr) {
                    if (attr.name.match(/^data-cs-/)) {
                        options[attr.name.replace(/^data-cs-/, '')] = attr.value;
                    }
                });

                if (options.allowclose === "false")
                    options.allowclose = false;
                else if (options.allowclose === "true")
                    options.allowclose = true;

                return options;
            },

            setOptions: function(options) {
                this.options = $.extend(true, $[name].defaults, options);
                this.debug('Options', this.options);
            },

            setStep: function(i) {
                this.currentStep = i;
                this.multiStep();
            },


            /**
             * Multi-stepped modal dialog functionality.
             */

            multiStep: function() {
                this.debug('Current step', this.currentStep);

                // Set a data attribute with its value being the current step
                if (this.$multiStepTarget[0]) {
                    this.$multiStepTarget[0].setAttribute('data-visible-step-item', this.currentStep + 1);
                }

                var currentStep      = this.currentStep,
                    notCurrentStepID = 'not-current-step';

                // Handle the visibility of the step items
                this.$multiStepItem.each(function(index, stepItem) {
                    if (index == currentStep) {
                        $(stepItem)
                            .addClass(stateHookToShowElements)
                            .attr({
                                'aria-hidden' : 'false',
                                'aria-expanded' : 'true',
                                'id' : 'current-step'
                            });
                    } else {
                        $(stepItem)
                            .removeClass(stateHookToShowElements)
                            .attr({
                                'aria-hidden' : 'true',
                                'aria-expanded' : 'false',
                                'id' : notCurrentStepID
                            });
                    }
                });

                this.$nextAction.attr('aria-owns', notCurrentStepID);
                this.$backAction.attr('aria-owns', notCurrentStepID);

                // Handle the visibility of the action buttons
                if (this.currentStep < this.$multiStepItem.length - 1) {
                    // More steps to get to...
                    this.$doneAction.removeClass(stateHookToShowElements);
                    this.$nextAction.addClass(stateHookToShowElements).focus();
                } else {
                    // At the last step
                    this.$nextAction.removeClass(stateHookToShowElements);
                    this.$doneAction.addClass(stateHookToShowElements).focus();
                }

                if (this.currentStep > 0 && this.$multiStepItem.length > 1) {
                    this.$backAction.addClass(stateHookToShowElements);
                    if (this.$doneAction.is(':disabled')) {
                        this.$backAction.focus();
                    }
                } else {
                    this.$backAction.removeClass(stateHookToShowElements);
                }
            },


            /**
             * Show the modal.
             */

            show: function() {
                this.debug('Show dialog');
                this.existingFocus = document.activeElement;
                this.$component.addClass(stateHookToShowElements);
                this.$underlay.attr('aria-hidden', 'false');
                this.$underlay.addClass(stateHookToShowElements).removeClass(stateHookForWhenModalIsDismissed);
                $(underneath).attr('aria-hidden', 'true');
                $(underneath).addClass(stateHookToTargetUIUnderneath);
                this.multiStep();
                // Set the focus to the first focusable item
                this.$component.find(':tabbable').first().focus();
            },


            /**
             * Hide the modal.
             */

            hide: function(element) {
                this.debug('Hide dialog');
                this.$component.removeClass(stateHookToShowElements);
                this.$underlay.attr('aria-hidden', 'true');
                this.$underlay.removeClass(stateHookToShowElements).addClass(stateHookForWhenModalIsDismissed);
                $(underneath).attr('aria-hidden', 'false');
                $(underneath).removeClass(stateHookToTargetUIUnderneath);
                this.existingFocus.focus();

                if (element.hasClass(this.noCallBack)) {
                    return;
                }

                switch (typeof this.options.callback) {
                    case 'function':
                        this.debug('Callback', this.options.callback, this);
                        this.options.callback.call(window, this);
                        break;
                    case 'string':
                        this.debug('Callback', this.options.callback, this);
                        CS.executeFunctionByName(this.options.callback, window, this);
                        break;
                }
            },

            debug: function( /* arguments */) {
                if (CS.Components.debug) {
                    console.log(name, this.id, arguments);
                }
            }
        };


        /**
         * Install JQuery plugin.
         */

        $.fn[name] = function(options /*, args */) {
            var args = Array.prototype.slice.call(arguments, 1);

            return this.each(function() {
                var instance = $(this).data(name);
                if (instance) {
                    if (typeof options === 'string') {
                        instance[options].apply(instance, args);
                    } else {
                        instance.debug('Already bound');
                    }

                } else {
                    instance = new $[name](this, options || true);
                    $(this).data(name, instance);
                }
            });
        };


        /**
         * Auto-bind components with attribute `data-cs-bind`.
         */

        $[name].autoBind = function() {
            $(hook).each(function() {
                if ($(this).attr('data-cs-bind') !== undefined) {
                    $(this)[name](true);
                }
            });
        };

        $($[name].autoBind);


    })(jQuery);
});