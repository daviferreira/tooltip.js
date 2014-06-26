function Tooltip(elements, options) {
    'use strict';
    return this.init(elements, options);
}

(function (window, document) {
    'use strict';

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
            delayHide: 300,
            delayShow: 100,
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
            this.trigger = window.Modernizr && window.Modernizr.touch ?
                           'touchstart' :
                           this.options.trigger;
            this.isClickable = (this.trigger === 'touchstart' ||
                                    this.trigger === 'click');
            return this;
        },

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
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.hide(e.currentTarget);
                    }, self.options.delayHide);
                };
            for (i = 0; i < this.elements.length; i += 1) {
                this.elements[i].addEventListener(this.trigger, showHandler);
                // associa mouseleave caso tooltip seja ativada no hover
                if (this.trigger === 'mouseenter') {
                    this.elements[i].addEventListener('mouseleave', hideHandler);
                }
            }
        },

        toggle: function toggle(el) {
            var isVisible = el.getAttribute('data-tooltip-visible'),
                self = this;
            if (isVisible === 'yes') {
                this.hide(el);
                // TODO
                // bean.off(this.tooltipEl, this.trigger + '.tooltip');
                // bean.off(document, this.trigger + '.tooltip');
                isVisible = 'no';
            } else {
                this.show(el);
                this.tooltipEl.addEventListener(this.trigger, function (e) {
                    e.stopPropagation();
                });
                document.addEventListener(this.trigger, function () {
                    self.toggle(el);
                });
                isVisible = 'yes';
            }
            el.setAttribute('data-tooltip-visible', isVisible);
        },

        show: function show(el) {
            var self = this,
                timer;
            if (this.tooltipEl === undefined) {
                this.createEl();
            }
            this.position = el.getAttribute('data-tooltip-position') || this.options.position;
            this.tooltipEl.setAttribute('data-position', this.position);
            this.tooltipContent.innerHTML = this.getContent(el);
            setTimeout(function () {
                self.tooltipEl.classList.add('tooltip-fade-show');
            }, 100);
            this.setPosition(el);
            window.addEventListener('resize', function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.setPosition(el);
                }, 100);
            });
        },

        getContent: function getContent(el) {
            var contentEl = document.querySelector(el.getAttribute('data-tooltip-el'));
            if (contentEl) {
                return contentEl.innerHTML;
            }
            return el.getAttribute('data-tooltip-content') || el.getAttribute('title');
        },

        setPosition: function setPosition(el) {
            var offset = el.getBoundingClientRect();
            this.tooltipEl.style.top = this.getTop(el.clientHeight, offset) + 'px';
            this.tooltipEl.style.left = this.getLeft(el.clientWidth, offset) + 'px';
        },

        getTop: function getTop(height, offset) {
            var scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
                topPosition = offset.top + scrollY + this.options.diffTop;
            if (this.position === 'top' || this.position.indexOf('top-') !== -1) {
                topPosition -= (this.tooltipEl.clientHeight + 14);
            } else if (this.position === 'bottom' || this.position.indexOf('bottom-') !== -1) {
                topPosition += (height + 14);
            } else if (this.position.indexOf('-bottom') !== -1) {
                topPosition += (height - this.tooltipEl.clientHeight);
            } else if (this.position.indexOf('-top') !== -1) {
                topPosition += 0;
            } else {
                topPosition += (height/2) - (this.tooltipEl.clientHeight/2);
            }
            return topPosition;
        },

        getLeft: function getLeft(width, offset) {
            var leftPosition = offset.left + this.options.diffLeft;
            if (this.position === 'left' || this.position.indexOf('left-') !== -1) {
                leftPosition -= this.tooltipEl.clientWidth + 14;
            } else if (this.position === 'right' || this.position.indexOf('right-') !== -1) {
                leftPosition += (width + 14);
            } else {
                leftPosition += (width / 2) - (this.tooltipEl.clientWidth / 2);
            }
            return leftPosition;
        },

        createEl: function createEl() {
            this.tooltipEl  = document.createElement('div');
            this.tooltipEl.className = 'tooltip tooltip-base tooltip-fade tooltip-default';
            this.tooltipEl.innerHTML = '<div class="tooltip-content"></div>';
            if (this.options.extraClass) {
                this.tooltipEl.className += ' ' + this.options.extraClass;
            }
            document.body.appendChild(this.tooltipEl);
            this.tooltipContent = this.tooltipEl.querySelector('.tooltip-content');
        },

        hide: function hide() {
            this.tooltipEl.classList.remove('tooltip-fade-show');
            // TODO
            // bean.off(window, 'resize.tooltip');
            // bean.off(window, 'scroll.tooltip');
        }

    };

}(window, document));
