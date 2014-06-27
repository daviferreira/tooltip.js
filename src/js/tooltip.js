function Tooltip(elements, options) {
    'use strict';
    return this.init(elements, options);
}

(function (window, document, undefined) {
    'use strict';

    // http://ctrlq.org/code/19616-detect-touch-screen-javascript
    function isTouchDevice() {
        return (
            ('ontouchstart' in window) ||
            (navigator.MaxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0)
        );
    }

    function extend(obj, defaults) {
        var prop;
        if (obj === undefined) {
            return defaults;
        }
        for (prop in defaults) {
            if (defaults.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
                obj[prop] = defaults[prop];
            }
        }
        return obj;
    }

    Tooltip.prototype = {
        defaults: {
            delayHide: 0,
            delayShow: 0,
            diffTop: 0,
            diffLeft: 0,
            extraClass: '',
            position: 'top',
            trigger: 'mouseenter'
        },

        init: function init(elements, options) {
            this.elements = document.querySelectorAll(elements);
            if (this.elements.length === 0) {
                return false;
            }
            this.options = extend(options, this.defaults);
            this.setTrigger()
                .bind();
        },

        setTrigger: function setTrigger() {
            this.trigger = isTouchDevice() ?
                           'touchstart' :
                           this.options.trigger;
            this.isClickable = (this.trigger === 'touchstart' ||
                                    this.trigger === 'click');
            return this;
        },

        // TODO: break method
        bind: function bind() {
            var i,
                self = this,
                timer = '',
                showHandler = function (e) {
                    var el = e.currentTarget;
                    clearTimeout(timer);
                    e.preventDefault();
                    if (self.isClickable) {
                        e.stopPropagation();
                    }
                    timer = setTimeout(function () {
                        if (self.isClickable) {
                            self.toggle(el);
                        } else {
                            self.show(el);
                        }
                    }, self.options.delayShow);
                },
                hideHandler = function (e) {
                    var el = e.currentTarget;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.hide(el);
                    }, self.options.delayHide);
                };
            for (i = 0; i < this.elements.length; i += 1) {
                this.elements[i].addEventListener(this.trigger, showHandler);
                if (this.trigger === 'mouseenter') {
                    this.elements[i].addEventListener('mouseleave',
                                                      hideHandler);
                }
            }
        },

        // TODO: break method
        toggle: function toggle(el) {
            var self = this;
            if (el.getAttribute('data-tooltip-visible') === 'yes') {
                this.hide(el);
                // TODO
                // bean.off(this.tooltipEl, this.trigger + '.tooltip');
                // bean.off(document, this.trigger + '.tooltip');
            } else {
                this.show(el);
                this.tooltipEl.addEventListener(this.trigger, function (e) {
                    e.stopPropagation();
                });
                document.addEventListener(this.trigger, function () {
                    self.hide(el);
                });
            }
        },

        // TODO: break method
        show: function show(el) {
            var self = this,
                timer;
            if (this.tooltipEl === undefined) {
                this.createEl();
            }
            this.updatePositionAttribute(el);
            this.tooltipContent.innerHTML = this.getContent(el);
            el.setAttribute('data-tooltip-visible', 'yes');
            this.tooltipEl.classList.add('tooltip-visible');
            this.setPosition(el);
            window.addEventListener('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.setPosition(el);
                }, 100);
            });
        },

        updatePositionAttribute: function updatePositionAttribute(el) {
            this.position = el.getAttribute('data-tooltip-position') ||
                            this.options.position;
            this.tooltipEl.setAttribute('data-position', this.position);
            this.position = this.position.split('-');
        },

        getContent: function getContent(el) {
            var contentEl = document.querySelector(
                el.getAttribute('data-tooltip-el')
            );
            if (contentEl) {
                return contentEl.innerHTML;
            }
            return el.getAttribute('data-tooltip-content') ||
                   el.getAttribute('title');
        },

        setPosition: function setPosition(el) {
            var offset = el.getBoundingClientRect();
            this.tooltipEl.style.top = this.getTop(el.clientHeight, offset) +
                                       'px';
            this.tooltipEl.style.left = this.getLeft(el.clientWidth, offset) +
                                        'px';
        },

        // TODO: break method
        getTop: function getTop(height, offset) {
            var scrollY = this.getScrollY(),
                topPosition = offset.top + scrollY + this.options.diffTop;
            switch (this.position[0]) {
                case 'top':
                    return topPosition - (this.tooltipEl.clientHeight + 14);
                case 'bottom':
                    return topPosition + (height + 14);
            }
            switch (this.position[1]) {
                case 'bottom':
                    return topPosition +
                           (height - this.tooltipEl.clientHeight);
                case 'top':
                    return topPosition;
            }
            return topPosition + (height/2) - (this.tooltipEl.clientHeight/2);
        },

        getScrollY: function getScrollY() {
            if (window.pageYOffset !== undefined) {
                return window.pageYOffset;
            }
            return (document.documentElement ||
                    document.body.parentNode ||
                    document.body).scrollTop;
        },

        getLeft: function getLeft(width, offset) {
            var leftPosition = offset.left + this.options.diffLeft;
            switch (this.position[0]) {
                case 'left':
                    return  leftPosition - (this.tooltipEl.clientWidth + 14);
                case 'right':
                    return leftPosition + (width + 14);
            }
            return leftPosition +
                   (width / 2) -
                   (this.tooltipEl.clientWidth / 2);
        },

        createEl: function createEl() {
            this.tooltipEl  = document.createElement('div');
            this.tooltipEl.className = 'tooltip tooltip-base tooltip-fade ' +
                                       'tooltip-default';
            this.tooltipEl.innerHTML = '<div class="tooltip-content"></div>';
            if (this.options.extraClass) {
                this.tooltipEl.className += ' ' + this.options.extraClass;
            }
            document.body.appendChild(this.tooltipEl);
            this.tooltipContent = this.tooltipEl.querySelector(
                '.tooltip-content'
            );
        },

        hide: function hide(el) {
            this.tooltipEl.classList.remove('tooltip-visible');
            el.setAttribute('data-tooltip-visible', 'no');
            // TODO
            // bean.off(window, 'resize.tooltip');
            // bean.off(window, 'scroll.tooltip');
        }
    };
}(window, document));
