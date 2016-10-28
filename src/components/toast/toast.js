;
(function (root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define([], factory);
    }
    else if (typeof exports === 'object')
    {
        module.exports = factory();
    }
    else
    {
        root.$toast = factory();
    }
}(this, function () {
var isMobile = /iphone|ipad|android|phone|mobile/.test(window.navigator.userAgent.toLocaleLowerCase());
//辅助函数 ------------------------
function isUndefined (value)
{
    return typeof value === 'undefined';
}

function isDefined (value)
{
    return typeof value !== 'undefined';
}

function isElement(value) {
    return !!value && (isNumber(value.nodeType) || value === window);
}

function isObject (value)
{
    // http://jsperf.com/isobject4
    return value !== null && typeof value === 'object';
}

function isString (value)
{
    return typeof value === 'string';
}

function isNumber (value)
{
    return typeof value === 'number';
}

function isDate (value)
{
    return toString.call(value) === '[object Date]';
}

function isArray (value)
{
    return Array.isArray(value);
}

function isArrayLike (value)
{
    return Array.isArray(value) || (isObject(value) && isNumber(value.length) && value.length > - 1);
}

function isFunction (value)
{
    return typeof value === 'function';
}

function isRegExp (value)
{
    return toString.call(value) === '[object RegExp]';
}

function isBoolean (value)
{
    return typeof value === 'boolean';
}

//辅助函数 end --------------------------------------------

function getPageOffset ()
{
    // This works for all browsers except IE versions 8 and before
    if (window.pageXOffset != null)
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    // For browsers in Standards mode
    var doc = window.document;
    if (document.compatMode === "CSS1Compat")
    {
        return {
            x: doc.documentElement.scrollLeft,
            y: doc.documentElement.scrollTop
        };
    }
    // For browsers in Quirks mode
    return {
        x: doc.body.scrollLeft,
        y: doc.body.scrollTop
    };
}

var $util = {

    trim: function (str)
    {
        if (!isString(str)) return str;
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    /**
     * 遍历
     * @param obj {object | Array}
     * @param func
     */
    each: function (obj, func)
    {
        var item;
        if (isArrayLike(obj))
        {
            var i = 0;
            var l = obj.length;
            for (i; i < l; i ++)
            {
                item = obj[i];
                if (isDefined(item)) func(item, i);
            }
        }
        else if (isObject(obj))
        {
            var key;
            for (key in obj)
            {
                if (obj.hasOwnProperty(key))
                {
                    item = obj[key];
                    func(item, key);
                }
            }
        }
    },

    some: function (obj, func)
    {
        if (isArrayLike(obj))
        {
            var i = 0;
            var l = obj.length;
            for (i; i < l; i ++)
            {
                if (isDefined(obj[i]) && func(obj[i], i)) return true;
            }
        }
        else if (isObject(obj))
        {
            var key;
            for (key in obj)
            {
                if (obj.hasOwnProperty(key) && func(obj[key], key)) return true;
            }
        }
        return false;
    },

    all: function (obj, func)
    {
        var l, results;
        if (isArrayLike(obj))
        {
            var i = 0;
            l = obj.length;
            results = 0;
            for (i; i < l; i ++)
            {
                if (isDefined(obj[i]) && func(obj[i], i)) results ++;
            }
            return (results === l);
        }
        else if (isObject(obj))
        {
            var key;
            l = 0;
            results = 0;
            for (key in obj)
            {
                l ++;
                if (obj.hasOwnProperty(key) && func(obj[key], key)) results ++;
            }
            return (results === l);
        }
        return false;
    },

    clone: function (o, d)
    {
        if (o === null || o === undefined || typeof ( o ) !== 'object')
        {
            return o;
        }

        var deep = ! ! d;

        var cloned;

        var i;

        if (o.constructor === Array)
        {
            if (deep === false)
            {
                return o;
            }

            cloned = [];

            for (i in o)
            {
                cloned.push($util.clone(o[i], deep));
            }

            return cloned;
        }

        cloned = {};

        for (i in o)
        {
            cloned[i] = deep ? $util.clone(o[i], true) : o[i];
        }

        return cloned;
    },

    extend: function (base, input)
    {
        if (! ((isObject(base) && isObject(input)) || (isArrayLike(base) && isArrayLike(input))))
        {
            return base;
        }
        var result = $util.clone(base, true);
        $util.each(input, function (item, key)
        {
            if (isUndefined(item)) return;
            result[key] = item;
        });
        return result;
    },

    bind: function (func, thisArg)
    {
        var args = Array.prototype.slice.call(arguments, 2);
        return function ()
        {
            var inputArgs = Array.prototype.slice.call(arguments, 0);
            $util.each(inputArgs, function (item, index)
            {
                args[index] = item;
            });
            return func.apply(thisArg, args);
        }
    },

    /**
     * 判断 host 是否包含 obj
     * @param host 宿主对象
     * @param obj 需要判断的对象
     */
    contain: function (host, obj)
    {
        if (! (isObject(host) && isObject(obj)))
        {
            return false;
        }
        var invalid = $util.some(obj, function (value, key)
        {
            if (value !== host[key])
            {
                return true;
            }
        });
        return ! invalid;
    },

    /**
     * 倒序遍历
     * @param array
     * @param func
     */
    reverseEach: function (array, func)
    {
        if (! isArrayLike(array)) return false;
        var i = array.length;
        var item;
        while (i --)
        {
            item = array[i];
            if (isDefined(item)) func(item, i);
        }
    },

    /**
     * 删除数组中的元素
     * @param array
     * @param reason {number | function | object}
     * number : 该元素在数组中的 index
     * function (item, index) : 自定义删除逻辑，返回 true 时删除
     * object : 和数组中的元素做对比，key和value 都匹配时删除
     */
    remove: function (array, reason)
    {
        if (isUndefined(reason) || !isArray(array)) return false;
        var index = - 1;
        if (isNumber(reason))
        {
            index = reason;
        }
        else
        {
            index = $util.indexOf(array, reason);
        }
        if (index > - 1) array.splice(index, 1);
    },

    /**
     * 删除数组中的元素，满足条件的全部删除
     * @param array
     * @param reason {function | object}
     * function (item, index) : 自定义删除逻辑，返回 true 时删除
     * object : 和数组中的元素做对比，key和value 都匹配时删除
     */
    removeAll: function (array, reason)
    {
        if (isUndefined(reason)) return false;
        var index = $util.indexOf(array, reason);
        if (index > - 1)
        {
            array.splice(index, 1);
            $util.removeAll(array, reason);
        }
        else
        {
            return true;
        }
    },

    /**
     * 查找在数组中位置
     * @param array
     * @param reason {function | object}
     * @param start 开始位置
     * function (item, index) : 自定义逻辑，返回 true 时
     * object : 和数组中的元素做对比，key和value都匹配时
     */
    indexOf: function (array, reason, start)
    {
        var i = start || 0;
        var index = - 1;
        var item;
        while (i < array.length)
        {
            item = array[i];

            if (isObject(reason))
            {
                if ($util.contain(item, reason))
                {
                    index = i;
                    break;
                }
            }
            else if (isFunction(reason))
            {
                if (reason(item, i))
                {
                    index = i;
                    break;
                }
            }
            else
            {
                if (item === reason)
                {
                    index = i;
                    break;
                }
            }
            i ++ ;
        }
        return index;
    },

    find: function (array, reason)
    {
        var index = this.indexOf(array, reason);
        if (index > -1) return array[index];
    },

    findAll: function (array, reason)
    {
        var index = -1;
        var results = [];
        do {
            index = this.indexOf(array, reason, index + 1);
            if (index > -1) results.push(array[index]);
        } while (index > -1);
        return results;
    }
};
var $ = (function ()
{
    var Dom = function (arr)
    {
        var _this = this, i, length = arr.length;
        // Create array-like object
        for (i = 0; i < length; i ++)
        {
            _this[i] = arr[i];
        }
        _this.length = arr.length;
        // Return collection with methods
        return this;
    };

    Dom.prototype = {
        addClass: function (arg)
        {
            if (!(isString(arg) || isArray(arg))) return this;
            if (isString(arg))
            {
                arg = $util.trim(arg).replace(/\s+/, ' ').split(' ');
            }
            this.each(function (el)
            {
                el.className += ' ' + arg.join(' ');
            });
            return this;
        },
        removeClass: function (arg)
        {
            if (!(isString(arg) || isArray(arg))) return this;
            if (isString(arg))
            {
                arg = $util.trim(arg).replace(/\s+/, ' ').split(' ');
            }
            this.each(function (el)
            {
                var className = ' ' + el.className + ' ';
                $util.each(arg, function (item)
                {
                    item = ' ' + item + ' ';
                    className = className.replace(item, ' ');
                });
                el.className = $util.trim(className);
            });
            return this;
        },
        toogleClass: function (arg)
        {
            if (!isString(arg)) return this;
            this.each(function (el)
            {
                if (el.className.indexOf(arg) === -1) return true;
                el.className += ' ' + arg;
            });
        },
        hasClass: function (arg)
        {
            if (!isString(arg)) return false;
            return this[0].className.indexOf(arg) > -1;
        },
        css: function (arg1, arg2)
        {
            if (arguments.length === 1)
            {
                if (isString(arg1))
                {
                    if (isFunction(getComputedStyle))
                    {
                        return getComputedStyle(this[0], null).getPropertyValue(arg1);
                    }
                    else
                    {
                        return this[0].currentStyle[arg1];
                    }
                }
                else if (isObject(arg1))
                {
                    this.each(function (el)
                    {
                        $util.each(arg1, function (value, key)
                        {
                            el.style[key] = value;
                        });
                    });
                }
            }
            else if (arguments.length === 2)
            {
                this.each(function (el)
                {
                    el.style[arg1] = arg2;
                });
                return arg2;
            }
        },
        width: function (width)
        {
            if (width) {
                this.css('width', width + 'px');
                return width;
            }
            return parseFloat(this.css('width'));
        },
        height: function (height)
        {
            if (height) {
                this.css('height', height + 'px');
                return height;
            }
            return parseFloat(this.css('height'));
        },
        offset: function ()
        {
            var el = this[0];
            if (!isElement(el)) return false;
            var box = el.getBoundingClientRect();
            if (this.css('position') === 'fixed')
            {
                return {x: box.left, y: box.top};
            }
            var body = document.body;
            var clientTop = el.clientTop || body.clientTop || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var pageOffset = getPageOffset();
            var scrollTop = pageOffset.y || el.scrollTop;
            var scrollLeft = pageOffset.x || el.scrollLeft;
            return {
                y: box.top + scrollTop - clientTop,
                x: box.left + scrollLeft - clientLeft
            };
        },
        remove: function ()
        {
            this.each(function (el)
            {
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        },
        append: function (attr)
        {
            this.each(function (el)
            {
                if (isString(attr))
                {
                    var tmp = document.createElement('div');
                    tmp.innerHTML = attr;
                    while(tmp.firstChild) el.appendChild(tmp.firstChild);
                }
                else if (isElement(attr))
                {
                    el.append(attr);
                }
                else if (attr instanceof Dom)
                {
                    attr.each(function (item)
                    {
                        el.appendChild(item);
                    });
                }
            });
        },
        html: function (html)
        {
            if (html)
            {
                this.each(function (el)
                {
                    el.innerHTML = html;
                });
            }
            return this[0] && this[0].innerHTML;
        },
        hide: function ()
        {
            this.each(function (el)
            {
                el.style.display = 'none';
            });
        },
        show: function (display)
        {
            this.each(function (el)
            {
                el.style.display = display || 'block';
            });
        },
        each: function (callback)
        {
            var i = 0;
            var l = this.length;
            for (i; i < l; i++)
            {
                callback(this[i], i);
            }
        },
        find: function (selector)
        {
            var foundElements = [];
            for (var i = 0; i < this.length; i++) {
                var found = this[i].querySelectorAll(selector);
                for (var j = 0; j < found.length; j++) {
                    foundElements.push(found[j]);
                }
            }
            return new Dom(foundElements);
        },

        transitionEnd: function (callback)
        {
            if (! isFunction(callback)) return false;
            //var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
            var event = 'webkitTransitionEnd';
            function fireCallBack (e)
            {
                callback(e);
                this.removeEventListener(event, fireCallBack, false);
            }
            this.each(function (el)
            {
                el.addEventListener(event, fireCallBack, false);
            });
        }
    };

    return function (selector)
    {
        var arr = [], i = 0;
        if (selector instanceof Dom)
        {
            return selector;
        }
        // String
        if (typeof selector === 'string')
        {
            var els, tempParent, html = selector;
            if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0)
            {
                var toCreate = 'div';
                if (html.indexOf('<li') === 0) toCreate = 'ul';
                if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                if (html.indexOf('<tbody') === 0) toCreate = 'table';
                if (html.indexOf('<option') === 0) toCreate = 'select';
                tempParent = document.createElement(toCreate);
                tempParent.innerHTML = selector;
                for (i = 0; i < tempParent.childNodes.length; i ++)
                {
                    arr.push(tempParent.childNodes[i]);
                }
            }
            else
            {
                if (selector[0] === '#' && ! selector.match(/[ .<>:~]/))
                {
                    // Pure ID selector
                    els = [document.getElementById(selector.split('#')[1])];
                }
                else
                {
                    // Other selectors
                    els = (document).querySelectorAll(selector);
                }
                for (i = 0; i < els.length; i ++)
                {
                    if (els[i]) arr.push(els[i]);
                }
            }
        }
        // Node/element
        else if (isElement(selector))
        {
            arr.push(selector);
        }
        //Array of elements or instance of Dom
        else if (selector.length > 0 && selector[0].nodeType)
        {
            for (i = 0; i < selector.length; i ++)
            {
                arr.push(selector[i]);
            }
        }
        return new Dom(arr);
    };
})();


//自定义工具类 end ----------------------------------------------------

var toastDefaultIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24"> <path d="M12.984 12.984v-6h-1.969v6h1.969zM12.984 17.016v-2.016h-1.969v2.016h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path> </svg>';

var toastDefaultOptions = {
    duration: 5000,
    position: 'bottom',
    type: 'default',
    //避免重复提示
    distinct: false,
    mobile: isMobile,
    icon: toastDefaultIcon,
    showCloseBtn: !isMobile,
    //toast gap
    gap: 5
};

var toastMixes = [];

var $body = $('body');

var bodyWidth = $body.width();

function convertToastArguments (args)
{
    var options = {};
    if (args.length === 3)
    {
        options = args[2];
        options.text = args[1];
    }
    else if (args.length === 2)
    {
        if (isObject(args[1])) options = args[1];
        else options.text = args[1];
    }
    options.title = args[0];
    return options;
}

function convertToastPosition (position)
{
    switch (position)
    {
        case 'top':
        case 'top center':
        case 'center top':
            position = 'toast-y-top toast-x-center';
            break;
        case 'top left':
        case 'left top':
            position = 'toast-y-top toast-x-left';
            break;
        case 'top right':
        case 'right top':
            position = 'toast-y-top toast-x-right';
            break;
        case 'center':
        case 'center center':
            position = 'toast-y-center toast-x-center';
            break;
        case 'left':
        case 'center left':
        case 'left center':
            position = 'toast-y-center toast-x-left';
            break;
        case 'right':
        case 'center right':
        case 'right center':
            position = 'toast-y-center toast-x-right';
            break;
        case 'bottom':
        case 'bottom center':
        case 'center bottom':
            position = 'toast-y-bottom toast-x-center';
            break;
        case 'bottom left':
        case 'left bottom':
            position = 'toast-y-bottom toast-x-left';
            break;
        case 'bottom right':
        case 'right bottom':
            position = 'toast-y-bottom toast-x-right';
            break;
        default :
            position = 'toast-y-bottom toast-x-center';
    }
    return position;
}

function distinctToast ($toast)
{
    var mixes = $util.findAll(toastMixes, function (item)
    {
        return item.$toast.html() === $toast.html();
    });
    $util.each(mixes, function (mix)
    {
        Toast.hide(mix);
    });
}

function resizeToasts ($toast, position)
{
    var toast_height = $toast.height();
    var gap = toastDefaultOptions.gap;
    var $toasts;
    if (position.indexOf('toast-y-top') !== - 1)
    {
        $toasts = $body.find('.toast-y-top');
        $toasts.each(function (dom, index)
        {
            if (index == ($toasts.length - 1)) return true;
            var $dom = $(dom);
            var top = parseFloat($dom.css('top'));
            $dom.css('top', top + toast_height + gap + 'px');
        });
    }
    else if (position.indexOf('toast-y-center') !== - 1)
    {
        $toasts = $body.find('.toast-y-center');
        $toasts.each(function (dom, index)
        {
            var $dom = $(dom);
            if (index == ($toasts.length - 1))
            {
                $dom.css('margin-top', - (toast_height / 2) + 'px');
            }
            else
            {
                var marginTop = parseFloat($dom.css('margin-top'));
                $dom.css('margin-top', marginTop + toast_height + gap + 'px');
            }
        });
    }
    else
    {
        $toasts = $body.find('.toast-y-bottom');
        $toasts.each(function (dom, index)
        {
            if (index == ($toasts.length - 1)) return true;
            var $dom = $(dom);
            var bottom = parseFloat($dom.css('bottom'));
            $dom.css('bottom', bottom + toast_height + gap + 'px');
        });
    }
}

var Toast = {

    success: function (title, text, options)
    {
        var toastOptions = convertToastArguments(arguments);
        toastOptions.type = 'success';
        return this.show(toastOptions);
    },
    error: function (title, text, options)
    {
        var toastOptions = convertToastArguments(arguments);
        toastOptions.type = 'error';
        return this.show(toastOptions);
    },
    warn: function (title, text, options)
    {
        var toastOptions = convertToastArguments(arguments);
        toastOptions.type = 'warning';
        return this.show(toastOptions);
    },
    info: function (title, text, options)
    {
        var toastOptions = convertToastArguments(arguments);
        toastOptions.type = 'info';
        return this.show(toastOptions);
    },
    text: function (title, text, options)
    {
        var toastOptions = convertToastArguments(arguments);
        toastOptions.type = 'default';
        return this.show(toastOptions);
    },
    // toast 单独处理定位，去掉 toasts
    show: function (options)
    {
        options = $util.extend(toastDefaultOptions, options);
        var $toast = $(document.createElement('div'));
        var toastClasses = ['toast'];
        //toast innerHTML
        var title = options.title ? '<div class="toast-title">' + options.title + '</div>' : '';
        var text = options.text ? '<div class="toast-text">' + options.text + '</div>' : '';
        var icon = options.icon;
        if (icon)
        {
            toastClasses.push('toast-with-icon');
            icon = '<div class="toast-icon">' + icon + '</div>';
        }
        else
        {
            icon = '';
        }
        if (options.mobile || (options.mobile !== false && toastDefaultOptions.mobile)) toastClasses.push('toast-mobile');
        var closeBtn = '';
        if (!options.mobile && options.showCloseBtn)
        {
            toastClasses.push('toast-with-close');
            closeBtn = '<div class="toast-close">x</div>'
        }

        $toast.html(icon + title + text + closeBtn);
        //toast class
        var type = 'toast-type-' + options.type;
        toastClasses.push(type);
        var position = convertToastPosition(options.position);
        toastClasses.push(position);
        if (isString(options.cls))
        {
            toastClasses.push(options.cls);
        }
        $toast.addClass(toastClasses);
        //append to body
        $body.append($toast);
        $toast.show();
        var maxWidth = bodyWidth - 30;
        var toastWidth = $toast.width();
        if (toastWidth > maxWidth) toastWidth = $toast.width(maxWidth);
        if ($toast.hasClass('toast-x-center'))
        {
            $toast.css('margin-left', (bodyWidth - toastWidth) / 2 + 'px');
        }
        //distinct others toasts
        if (options.distinct) distinctToast($toast);
        //resize others toasts
        resizeToasts($toast, position);
        var mix = {
            $toast: $toast
        };
        mix.timeout = setTimeout($util.bind(this.hide, null, mix), options.duration);
        toastMixes.push(mix);

        $toast[0].onclick = function (e)
        {
            if (e.target.className.indexOf('toast-close') > -1) {
                Toast.hide(mix);
                return false;
            }
            //on click
            if (isFunction(options.click)) options.click(e);
        };
        //show transition
        $toast.addClass('toast-in');
        return mix;
    },

    hide: function (mix)
    {
        if (!mix || mix.$toast.hasClass('toast-out')) return true;
        clearTimeout(mix.timeout);
        var $toast = mix.$toast;
        $toast.addClass('toast-out');
        $toast.transitionEnd(function ()
        {
            $toast.remove();
            $util.remove(toastMixes, mix);
            mix = null;
        });
    },

    clear: function ()
    {
        toastMixes.each(this.hide);
    },

    config: function (options)
    {
        toastDefaultOptions = $util.extend(toastDefaultOptions, options);
    }
};

    return Toast;
}));