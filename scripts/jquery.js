!function(window, undefined) {
    function createFlags(flags) {
        var object = flagsCache[flags] = {}, i, length;
        for (flags = flags.split(/\s+/), i = 0, length = flags.length; length > i; i++)
            object[flags[i]] = !0;
        return object
    }
    function dataAttr(elem, key, data) {
        if (data === undefined && 1 === elem.nodeType) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            if (data = elem.getAttribute(name), "string" == typeof data) {
                try {
                    data = "true" === data ? !0 : "false" === data ? !1 : "null" === data ? null : jQuery.isNumeric(data) ? parseFloat(data) : rbrace.test(data) ? jQuery.parseJSON(data) : data
                } catch (e) {
                }
                jQuery.data(elem, key, data)
            } else
                data = undefined
        }
        return data
    }
    function isEmptyDataObject(obj) {
        for (var name in obj)
            if ("data" !== name || !jQuery.isEmptyObject(obj[name])) {
                if ("toJSON" !== name)
                    return !1
            } else
                ;
        return !0
    }
    function handleQueueMarkDefer(elem, type, src) {
        var deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", defer = jQuery._data(elem, deferDataKey);
        if (!(!defer || "queue" !== src && jQuery._data(elem, queueDataKey) || "mark" !== src && jQuery._data(elem, markDataKey)))
            setTimeout(function() {
                if (!jQuery._data(elem, queueDataKey) && !jQuery._data(elem, markDataKey))
                    jQuery.removeData(elem, deferDataKey, !0), defer.fire()
            }, 0)
    }
    function returnFalse() {
        return !1
    }
    function returnTrue() {
        return !0
    }
    function isDisconnected(node) {
        return !node || !node.parentNode || 11 === node.parentNode.nodeType
    }
    function winnow(elements, qualifier, keep) {
        if (qualifier = qualifier || 0, jQuery.isFunction(qualifier))
            return jQuery.grep(elements, function(elem, i) {
                var retVal = !!qualifier.call(elem, i, elem);
                return retVal === keep
            });
        else if (qualifier.nodeType)
            return jQuery.grep(elements, function(elem, i) {
                return elem === qualifier === keep
            });
        else if ("string" == typeof qualifier) {
            var filtered = jQuery.grep(elements, function(elem) {
                return 1 === elem.nodeType
            });
            if (isSimple.test(qualifier))
                return jQuery.filter(qualifier, filtered, !keep);
            else
                qualifier = jQuery.filter(qualifier, filtered)
        }
        return jQuery.grep(elements, function(elem, i) {
            return jQuery.inArray(elem, qualifier) >= 0 === keep
        })
    }
    function createSafeFragment(document) {
        var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement)
            for (; list.length; )
                safeFrag.createElement(list.pop());
        return safeFrag
    }
    function root(elem, cur) {
        return jQuery.nodeName(elem, "table") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem
    }
    function cloneCopyEvent(src, dest) {
        if (1 === dest.nodeType && jQuery.hasData(src)) {
            var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
            if (events) {
                delete curData.handle, curData.events = {};
                for (type in events)
                    for (i = 0, l = events[type].length; l > i; i++)
                        jQuery.event.add(dest, type + (events[type][i].namespace ? "." : "") + events[type][i].namespace, events[type][i], events[type][i].data)
            }
            if (curData.data)
                curData.data = jQuery.extend({}, curData.data)
        }
    }
    function cloneFixAttributes(src, dest) {
        var nodeName;
        if (1 === dest.nodeType) {
            if (dest.clearAttributes)
                dest.clearAttributes();
            if (dest.mergeAttributes)
                dest.mergeAttributes(src);
            if (nodeName = dest.nodeName.toLowerCase(), "object" === nodeName)
                dest.outerHTML = src.outerHTML;
            else if ("input" === nodeName && ("checkbox" === src.type || "radio" === src.type)) {
                if (src.checked)
                    dest.defaultChecked = dest.checked = src.checked;
                if (dest.value !== src.value)
                    dest.value = src.value
            } else if ("option" === nodeName)
                dest.selected = src.defaultSelected;
            else if ("input" === nodeName || "textarea" === nodeName)
                dest.defaultValue = src.defaultValue;
            dest.removeAttribute(jQuery.expando)
        }
    }
    function getAll(elem) {
        if ("undefined" != typeof elem.getElementsByTagName)
            return elem.getElementsByTagName("*");
        else if ("undefined" != typeof elem.querySelectorAll)
            return elem.querySelectorAll("*");
        else
            return []
    }
    function fixDefaultChecked(elem) {
        if ("checkbox" === elem.type || "radio" === elem.type)
            elem.defaultChecked = elem.checked
    }
    function findInputs(elem) {
        var nodeName = (elem.nodeName || "").toLowerCase();
        if ("input" === nodeName)
            fixDefaultChecked(elem);
        else if ("script" !== nodeName && "undefined" != typeof elem.getElementsByTagName)
            jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked)
    }
    function shimCloneNode(elem) {
        var div = document.createElement("div");
        return safeFragment.appendChild(div), div.innerHTML = elem.outerHTML, div.firstChild
    }
    function evalScript(i, elem) {
        if (elem.src)
            jQuery.ajax({url: elem.src,async: !1,dataType: "script"});
        else
            jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "").replace(rcleanScript, "/*$0*/"));
        if (elem.parentNode)
            elem.parentNode.removeChild(elem)
    }
    function getWH(elem, name, extra) {
        var val = "width" === name ? elem.offsetWidth : elem.offsetHeight, which = "width" === name ? cssWidth : cssHeight, i = 0, len = which.length;
        if (val > 0) {
            if ("border" !== extra)
                for (; len > i; i++) {
                    if (!extra)
                        val -= parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
                    if ("margin" === extra)
                        val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
                    else
                        val -= parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0
                }
            return val + "px"
        }
        if (val = curCSS(elem, name, name), 0 > val || null == val)
            val = elem.style[name] || 0;
        if (val = parseFloat(val) || 0, extra)
            for (; len > i; i++) {
                if (val += parseFloat(jQuery.css(elem, "padding" + which[i])) || 0, "padding" !== extra)
                    val += parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
                if ("margin" === extra)
                    val += parseFloat(jQuery.css(elem, extra + which[i])) || 0
            }
        return val + "px"
    }
    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            if ("string" != typeof dataTypeExpression)
                func = dataTypeExpression, dataTypeExpression = "*";
            if (jQuery.isFunction(func))
                for (var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax), i = 0, length = dataTypes.length, dataType, list, placeBefore; length > i; i++) {
                    if (dataType = dataTypes[i], placeBefore = /^\+/.test(dataType))
                        dataType = dataType.substr(1) || "*";
                    list = structure[dataType] = structure[dataType] || [], list[placeBefore ? "unshift" : "push"](func)
                }
        }
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType, inspected) {
        dataType = dataType || options.dataTypes[0], inspected = inspected || {}, inspected[dataType] = !0;
        for (var list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = structure === prefilters, selection; length > i && (executeOnly || !selection); i++)
            if (selection = list[i](options, originalOptions, jqXHR), "string" == typeof selection)
                if (!executeOnly || inspected[selection])
                    selection = undefined;
                else
                    options.dataTypes.unshift(selection), selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
        if ((executeOnly || !selection) && !inspected["*"])
            selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected);
        return selection
    }
    function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src)
            if (src[key] !== undefined)
                (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
        if (deep)
            jQuery.extend(!0, target, deep)
    }
    function buildParams(prefix, obj, traditional, add) {
        if (jQuery.isArray(obj))
            jQuery.each(obj, function(i, v) {
                if (traditional || rbracket.test(prefix))
                    add(prefix, v);
                else
                    buildParams(prefix + "[" + ("object" == typeof v || jQuery.isArray(v) ? i : "") + "]", v, traditional, add)
            });
        else if (!traditional && null != obj && "object" == typeof obj)
            for (var name in obj)
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        else
            add(prefix, obj)
    }
    function ajaxHandleResponses(s, jqXHR, responses) {
        var contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields, ct, type, finalDataType, firstDataType;
        for (type in responseFields)
            if (type in responses)
                jqXHR[responseFields[type]] = responses[type];
        for (; "*" === dataTypes[0]; )
            if (dataTypes.shift(), ct === undefined)
                ct = s.mimeType || jqXHR.getResponseHeader("content-type");
        if (ct)
            for (type in contents)
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break
                }
        if (dataTypes[0] in responses)
            finalDataType = dataTypes[0];
        else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break
                }
                if (!firstDataType)
                    firstDataType = type
            }
            finalDataType = finalDataType || firstDataType
        }
        if (finalDataType) {
            if (finalDataType !== dataTypes[0])
                dataTypes.unshift(finalDataType);
            return responses[finalDataType]
        }
    }
    function ajaxConvert(s, response) {
        if (s.dataFilter)
            response = s.dataFilter(response, s.dataType);
        var dataTypes = s.dataTypes, converters = {}, i, key, length = dataTypes.length, tmp, current = dataTypes[0], prev, conversion, conv, conv1, conv2;
        for (i = 1; length > i; i++) {
            if (1 === i)
                for (key in s.converters)
                    if ("string" == typeof key)
                        converters[key.toLowerCase()] = s.converters[key];
            if (prev = current, current = dataTypes[i], "*" === current)
                current = prev;
            else if ("*" !== prev && prev !== current) {
                if (conversion = prev + " " + current, conv = converters[conversion] || converters["* " + current], !conv) {
                    conv2 = undefined;
                    for (conv1 in converters)
                        if (tmp = conv1.split(" "), tmp[0] === prev || "*" === tmp[0])
                            if (conv2 = converters[tmp[1] + " " + current]) {
                                if (conv1 = converters[conv1], conv1 === !0)
                                    conv = conv2;
                                else if (conv2 === !0)
                                    conv = conv1;
                                break
                            }
                }
                if (!conv && !conv2)
                    jQuery.error("No conversion from " + conversion.replace(" ", " to "));
                if (conv !== !0)
                    response = conv ? conv(response) : conv2(conv1(response))
            }
        }
        return response
    }
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest
        } catch (e) {
        }
    }
    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {
        }
    }
    function createFxNow() {
        return setTimeout(clearFxNow, 0), fxNow = jQuery.now()
    }
    function clearFxNow() {
        fxNow = undefined
    }
    function genFx(type, num) {
        var obj = {};
        return jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function() {
            obj[this] = type
        }), obj
    }
    function defaultDisplay(nodeName) {
        if (!elemdisplay[nodeName]) {
            var body = document.body, elem = jQuery("<" + nodeName + ">").appendTo(body), display = elem.css("display");
            if (elem.remove(), "none" === display || "" === display) {
                if (!iframe)
                    iframe = document.createElement("iframe"), iframe.frameBorder = iframe.width = iframe.height = 0;
                if (body.appendChild(iframe), !iframeDoc || !iframe.createElement)
                    iframeDoc = (iframe.contentWindow || iframe.contentDocument).document, iframeDoc.write(("CSS1Compat" === document.compatMode ? "<!doctype html>" : "") + "<html><body>"), iframeDoc.close();
                elem = iframeDoc.createElement(nodeName), iframeDoc.body.appendChild(elem), display = jQuery.css(elem, "display"), body.removeChild(iframe)
            }
            elemdisplay[nodeName] = display
        }
        return elemdisplay[nodeName]
    }
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : 9 === elem.nodeType ? elem.defaultView || elem.parentWindow : !1
    }
    var document = window.document, navigator = window.navigator, location = window.location, jQuery = function() {
        function doScrollCheck() {
            if (!jQuery.isReady) {
                try {
                    document.documentElement.doScroll("left")
                } catch (e) {
                    return setTimeout(doScrollCheck, 1), void 0
                }
                jQuery.ready()
            }
        }
        var jQuery = function(selector, context) {
            return new jQuery.fn.init(selector, context, rootjQuery)
        }, _jQuery = window.jQuery, _$ = window.$, rootjQuery, quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, rnotwhite = /\S/, trimLeft = /^\s+/, trimRight = /\s+$/, rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, rvalidchars = /^[\],:{}\s]*$/, rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rwebkit = /(webkit)[ \/]([\w.]+)/, ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/, rmsie = /(msie) ([\w.]+)/, rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/, rdashAlpha = /-([a-z]|[0-9])/gi, rmsPrefix = /^-ms-/, fcamelCase = function(all, letter) {
            return (letter + "").toUpperCase()
        }, userAgent = navigator.userAgent, browserMatch, readyList, DOMContentLoaded, toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf, class2type = {};
        if (jQuery.fn = jQuery.prototype = {constructor: jQuery,init: function(selector, context, rootjQuery) {
                var match, elem, ret, doc;
                if (!selector)
                    return this;
                if (selector.nodeType)
                    return this.context = this[0] = selector, this.length = 1, this;
                if ("body" === selector && !context && document.body)
                    return this.context = document, this[0] = document.body, this.selector = selector, this.length = 1, this;
                if ("string" == typeof selector) {
                    if ("<" === selector.charAt(0) && ">" === selector.charAt(selector.length - 1) && selector.length >= 3)
                        match = [null, selector, null];
                    else
                        match = quickExpr.exec(selector);
                    if (match && (match[1] || !context))
                        if (match[1]) {
                            if (context = context instanceof jQuery ? context[0] : context, doc = context ? context.ownerDocument || context : document, ret = rsingleTag.exec(selector))
                                if (jQuery.isPlainObject(context))
                                    selector = [document.createElement(ret[1])], jQuery.fn.attr.call(selector, context, !0);
                                else
                                    selector = [doc.createElement(ret[1])];
                            else
                                ret = jQuery.buildFragment([match[1]], [doc]), selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                            return jQuery.merge(this, selector)
                        } else {
                            if (elem = document.getElementById(match[2]), elem && elem.parentNode) {
                                if (elem.id !== match[2])
                                    return rootjQuery.find(selector);
                                this.length = 1, this[0] = elem
                            }
                            return this.context = document, this.selector = selector, this
                        }
                    else if (!context || context.jquery)
                        return (context || rootjQuery).find(selector);
                    else
                        return this.constructor(context).find(selector)
                } else if (jQuery.isFunction(selector))
                    return rootjQuery.ready(selector);
                if (selector.selector !== undefined)
                    this.selector = selector.selector, this.context = selector.context;
                return jQuery.makeArray(selector, this)
            },selector: "",jquery: "1.7.1",length: 0,size: function() {
                return this.length
            },toArray: function() {
                return slice.call(this, 0)
            },get: function(num) {
                return null == num ? this.toArray() : 0 > num ? this[this.length + num] : this[num]
            },pushStack: function(elems, name, selector) {
                var ret = this.constructor();
                if (jQuery.isArray(elems))
                    push.apply(ret, elems);
                else
                    jQuery.merge(ret, elems);
                if (ret.prevObject = this, ret.context = this.context, "find" === name)
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                else if (name)
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                return ret
            },each: function(callback, args) {
                return jQuery.each(this, callback, args)
            },ready: function(fn) {
                return jQuery.bindReady(), readyList.add(fn), this
            },eq: function(i) {
                return i = +i, -1 === i ? this.slice(i) : this.slice(i, i + 1)
            },first: function() {
                return this.eq(0)
            },last: function() {
                return this.eq(-1)
            },slice: function() {
                return this.pushStack(slice.apply(this, arguments), "slice", slice.call(arguments).join(","))
            },map: function(callback) {
                return this.pushStack(jQuery.map(this, function(elem, i) {
                    return callback.call(elem, i, elem)
                }))
            },end: function() {
                return this.prevObject || this.constructor(null)
            },push: push,sort: [].sort,splice: [].splice}, jQuery.fn.init.prototype = jQuery.fn, jQuery.extend = jQuery.fn.extend = function() {
            var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = !1;
            if ("boolean" == typeof target)
                deep = target, target = arguments[1] || {}, i = 2;
            if ("object" != typeof target && !jQuery.isFunction(target))
                target = {};
            if (length === i)
                target = this, --i;
            for (; length > i; i++)
                if (null != (options = arguments[i]))
                    for (name in options)
                        if (src = target[name], copy = options[name], target !== copy) {
                            if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                                if (copyIsArray)
                                    copyIsArray = !1, clone = src && jQuery.isArray(src) ? src : [];
                                else
                                    clone = src && jQuery.isPlainObject(src) ? src : {};
                                target[name] = jQuery.extend(deep, clone, copy)
                            } else if (copy !== undefined)
                                target[name] = copy
                        } else
                            ;
            return target
        }, jQuery.extend({noConflict: function(deep) {
                if (window.$ === jQuery)
                    window.$ = _$;
                if (deep && window.jQuery === jQuery)
                    window.jQuery = _jQuery;
                return jQuery
            },isReady: !1,readyWait: 1,holdReady: function(hold) {
                if (hold)
                    jQuery.readyWait++;
                else
                    jQuery.ready(!0)
            },ready: function(wait) {
                if (wait === !0 && !--jQuery.readyWait || wait !== !0 && !jQuery.isReady) {
                    if (!document.body)
                        return setTimeout(jQuery.ready, 1);
                    if (jQuery.isReady = !0, wait !== !0 && --jQuery.readyWait > 0)
                        return;
                    if (readyList.fireWith(document, [jQuery]), jQuery.fn.trigger)
                        jQuery(document).trigger("ready").off("ready")
                }
            },bindReady: function() {
                if (!readyList) {
                    if (readyList = jQuery.Callbacks("once memory"), "complete" === document.readyState)
                        return setTimeout(jQuery.ready, 1);
                    if (document.addEventListener)
                        document.addEventListener("DOMContentLoaded", DOMContentLoaded, !1), window.addEventListener("load", jQuery.ready, !1);
                    else if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", DOMContentLoaded), window.attachEvent("onload", jQuery.ready);
                        var toplevel = !1;
                        try {
                            toplevel = null == window.frameElement
                        } catch (e) {
                        }
                        if (document.documentElement.doScroll && toplevel)
                            doScrollCheck()
                    }
                }
            },isFunction: function(obj) {
                return "function" === jQuery.type(obj)
            },isArray: Array.isArray || function(obj) {
                return "array" === jQuery.type(obj)
            },isWindow: function(obj) {
                return obj && "object" == typeof obj && "setInterval" in obj
            },isNumeric: function(obj) {
                return !isNaN(parseFloat(obj)) && isFinite(obj)
            },type: function(obj) {
                return null == obj ? String(obj) : class2type[toString.call(obj)] || "object"
            },isPlainObject: function(obj) {
                if (!obj || "object" !== jQuery.type(obj) || obj.nodeType || jQuery.isWindow(obj))
                    return !1;
                try {
                    if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"))
                        return !1
                } catch (e) {
                    return !1
                }
                var key;
                for (key in obj)
                    ;
                return key === undefined || hasOwn.call(obj, key)
            },isEmptyObject: function(obj) {
                for (var name in obj)
                    return !1;
                return !0
            },error: function(msg) {
                throw new Error(msg)
            },parseJSON: function(data) {
                if ("string" != typeof data || !data)
                    return null;
                if (data = jQuery.trim(data), window.JSON && window.JSON.parse)
                    return window.JSON.parse(data);
                if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, "")))
                    return new Function("return " + data)();
                else
                    return jQuery.error("Invalid JSON: " + data), void 0
            },parseXML: function(data) {
                var xml, tmp;
                try {
                    if (window.DOMParser)
                        tmp = new DOMParser, xml = tmp.parseFromString(data, "text/xml");
                    else
                        xml = new ActiveXObject("Microsoft.XMLDOM"), xml.async = "false", xml.loadXML(data)
                } catch (e) {
                    xml = undefined
                }
                if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length)
                    jQuery.error("Invalid XML: " + data);
                return xml
            },noop: function() {
            },globalEval: function(data) {
                if (data && rnotwhite.test(data))
                    (window.execScript || function(data) {
                        window.eval.call(window, data)
                    })(data)
            },camelCase: function(string) {
                return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase)
            },nodeName: function(elem, name) {
                return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase()
            },each: function(object, callback, args) {
                var name, i = 0, length = object.length, isObj = length === undefined || jQuery.isFunction(object);
                if (args)
                    if (isObj) {
                        for (name in object)
                            if (callback.apply(object[name], args) === !1)
                                break
                    } else
                        for (; length > i && callback.apply(object[i++], args) !== !1; )
                            ;
                else if (isObj) {
                    for (name in object)
                        if (callback.call(object[name], name, object[name]) === !1)
                            break
                } else
                    for (; length > i && callback.call(object[i], i, object[i++]) !== !1; )
                        ;
                return object
            },trim: trim ? function(text) {
                return null == text ? "" : trim.call(text)
            } : function(text) {
                return null == text ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "")
            },makeArray: function(array, results) {
                var ret = results || [];
                if (null != array) {
                    var type = jQuery.type(array);
                    if (null == array.length || "string" === type || "function" === type || "regexp" === type || jQuery.isWindow(array))
                        push.call(ret, array);
                    else
                        jQuery.merge(ret, array)
                }
                return ret
            },inArray: function(elem, array, i) {
                var len;
                if (array) {
                    if (indexOf)
                        return indexOf.call(array, elem, i);
                    for (len = array.length, i = i ? 0 > i ? Math.max(0, len + i) : i : 0; len > i; i++)
                        if (i in array && array[i] === elem)
                            return i
                }
                return -1
            },merge: function(first, second) {
                var i = first.length, j = 0;
                if ("number" == typeof second.length)
                    for (var l = second.length; l > j; j++)
                        first[i++] = second[j];
                else
                    for (; second[j] !== undefined; )
                        first[i++] = second[j++];
                return first.length = i, first
            },grep: function(elems, callback, inv) {
                var ret = [], retVal;
                inv = !!inv;
                for (var i = 0, length = elems.length; length > i; i++)
                    if (retVal = !!callback(elems[i], i), inv !== retVal)
                        ret.push(elems[i]);
                return ret
            },map: function(elems, callback, arg) {
                var value, key, ret = [], i = 0, length = elems.length, isArray = elems instanceof jQuery || length !== undefined && "number" == typeof length && (length > 0 && elems[0] && elems[length - 1] || 0 === length || jQuery.isArray(elems));
                if (isArray) {
                    for (; length > i; i++)
                        if (value = callback(elems[i], i, arg), null != value)
                            ret[ret.length] = value
                } else
                    for (key in elems)
                        if (value = callback(elems[key], key, arg), null != value)
                            ret[ret.length] = value;
                return ret.concat.apply([], ret)
            },guid: 1,proxy: function(fn, context) {
                if ("string" == typeof context) {
                    var tmp = fn[context];
                    context = fn, fn = tmp
                }
                if (!jQuery.isFunction(fn))
                    return undefined;
                var args = slice.call(arguments, 2), proxy = function() {
                    return fn.apply(context, args.concat(slice.call(arguments)))
                };
                return proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++, proxy
            },access: function(elems, key, value, exec, fn, pass) {
                var length = elems.length;
                if ("object" == typeof key) {
                    for (var k in key)
                        jQuery.access(elems, k, key[k], exec, fn, value);
                    return elems
                }
                if (value !== undefined) {
                    exec = !pass && exec && jQuery.isFunction(value);
                    for (var i = 0; length > i; i++)
                        fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
                    return elems
                }
                return length ? fn(elems[0], key) : undefined
            },now: function() {
                return (new Date).getTime()
            },uaMatch: function(ua) {
                ua = ua.toLowerCase();
                var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];
                return {browser: match[1] || "",version: match[2] || "0"}
            },sub: function() {
                function jQuerySub(selector, context) {
                    return new jQuerySub.fn.init(selector, context)
                }
                jQuery.extend(!0, jQuerySub, this), jQuerySub.superclass = this, jQuerySub.fn = jQuerySub.prototype = this(), jQuerySub.fn.constructor = jQuerySub, jQuerySub.sub = this.sub, jQuerySub.fn.init = function init(selector, context) {
                    if (context && context instanceof jQuery && !(context instanceof jQuerySub))
                        context = jQuerySub(context);
                    return jQuery.fn.init.call(this, selector, context, rootjQuerySub)
                }, jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub
            },browser: {}}), jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        }), browserMatch = jQuery.uaMatch(userAgent), browserMatch.browser)
            jQuery.browser[browserMatch.browser] = !0, jQuery.browser.version = browserMatch.version;
        if (jQuery.browser.webkit)
            jQuery.browser.safari = !0;
        if (rnotwhite.test(" "))
            trimLeft = /^[\s\xA0]+/, trimRight = /[\s\xA0]+$/;
        if (rootjQuery = jQuery(document), document.addEventListener)
            DOMContentLoaded = function() {
                document.removeEventListener("DOMContentLoaded", DOMContentLoaded, !1), jQuery.ready()
            };
        else if (document.attachEvent)
            DOMContentLoaded = function() {
                if ("complete" === document.readyState)
                    document.detachEvent("onreadystatechange", DOMContentLoaded), jQuery.ready()
            };
        return jQuery
    }(), flagsCache = {};
    jQuery.Callbacks = function(flags) {
        flags = flags ? flagsCache[flags] || createFlags(flags) : {};
        var list = [], stack = [], memory, firing, firingStart, firingLength, firingIndex, add = function(args) {
            var i, length, elem, type, actual;
            for (i = 0, length = args.length; length > i; i++)
                if (elem = args[i], type = jQuery.type(elem), "array" === type)
                    add(elem);
                else if ("function" === type)
                    if (!flags.unique || !self.has(elem))
                        list.push(elem)
        }, fire = function(context, args) {
            for (args = args || [], memory = !flags.memory || [context, args], firing = !0, firingIndex = firingStart || 0, firingStart = 0, firingLength = list.length; list && firingLength > firingIndex; firingIndex++)
                if (list[firingIndex].apply(context, args) === !1 && flags.stopOnFalse) {
                    memory = !0;
                    break
                }
            if (firing = !1, list)
                if (!flags.once) {
                    if (stack && stack.length)
                        memory = stack.shift(), self.fireWith(memory[0], memory[1])
                } else if (memory === !0)
                    self.disable();
                else
                    list = []
        }, self = {add: function() {
                if (list) {
                    var length = list.length;
                    if (add(arguments), firing)
                        firingLength = list.length;
                    else if (memory && memory !== !0)
                        firingStart = length, fire(memory[0], memory[1])
                }
                return this
            },remove: function() {
                if (list)
                    for (var args = arguments, argIndex = 0, argLength = args.length; argLength > argIndex; argIndex++)
                        for (var i = 0; i < list.length; i++)
                            if (args[argIndex] === list[i]) {
                                if (firing)
                                    if (firingLength >= i)
                                        if (firingLength--, firingIndex >= i)
                                            firingIndex--;
                                if (list.splice(i--, 1), flags.unique)
                                    break
                            }
                return this
            },has: function(fn) {
                if (list)
                    for (var i = 0, length = list.length; length > i; i++)
                        if (fn === list[i])
                            return !0;
                return !1
            },empty: function() {
                return list = [], this
            },disable: function() {
                return list = stack = memory = undefined, this
            },disabled: function() {
                return !list
            },lock: function() {
                if (stack = undefined, !memory || memory === !0)
                    self.disable();
                return this
            },locked: function() {
                return !stack
            },fireWith: function(context, args) {
                if (stack)
                    if (firing) {
                        if (!flags.once)
                            stack.push([context, args])
                    } else if (!flags.once || !memory)
                        fire(context, args);
                return this
            },fire: function() {
                return self.fireWith(this, arguments), this
            },fired: function() {
                return !!memory
            }};
        return self
    };
    var sliceDeferred = [].slice;
    jQuery.extend({Deferred: function(func) {
            var doneList = jQuery.Callbacks("once memory"), failList = jQuery.Callbacks("once memory"), progressList = jQuery.Callbacks("memory"), state = "pending", lists = {resolve: doneList,reject: failList,notify: progressList}, promise = {done: doneList.add,fail: failList.add,progress: progressList.add,state: function() {
                    return state
                },isResolved: doneList.fired,isRejected: failList.fired,then: function(doneCallbacks, failCallbacks, progressCallbacks) {
                    return deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks), this
                },always: function() {
                    return deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments), this
                },pipe: function(fnDone, fnFail, fnProgress) {
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each({done: [fnDone, "resolve"],fail: [fnFail, "reject"],progress: [fnProgress, "notify"]}, function(handler, data) {
                            var fn = data[0], action = data[1], returned;
                            if (jQuery.isFunction(fn))
                                deferred[handler](function() {
                                    if (returned = fn.apply(this, arguments), returned && jQuery.isFunction(returned.promise))
                                        returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
                                    else
                                        newDefer[action + "With"](this === deferred ? newDefer : this, [returned])
                                });
                            else
                                deferred[handler](newDefer[action])
                        })
                    }).promise()
                },promise: function(obj) {
                    if (null == obj)
                        obj = promise;
                    else
                        for (var key in promise)
                            obj[key] = promise[key];
                    return obj
                }}, deferred = promise.promise({}), key;
            for (key in lists)
                deferred[key] = lists[key].fire, deferred[key + "With"] = lists[key].fireWith;
            if (deferred.done(function() {
                state = "resolved"
            }, failList.disable, progressList.lock).fail(function() {
                state = "rejected"
            }, doneList.disable, progressList.lock), func)
                func.call(deferred, deferred);
            return deferred
        },when: function(firstParam) {
            function resolveFunc(i) {
                return function(value) {
                    if (args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value, !--count)
                        deferred.resolveWith(deferred, args)
                }
            }
            function progressFunc(i) {
                return function(value) {
                    pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value, deferred.notifyWith(promise, pValues)
                }
            }
            var args = sliceDeferred.call(arguments, 0), i = 0, length = args.length, pValues = new Array(length), count = length, pCount = length, deferred = 1 >= length && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred(), promise = deferred.promise();
            if (length > 1) {
                for (; length > i; i++)
                    if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise))
                        args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
                    else
                        --count;
                if (!count)
                    deferred.resolveWith(deferred, args)
            } else if (deferred !== firstParam)
                deferred.resolveWith(deferred, length ? [firstParam] : []);
            return promise
        }}), jQuery.support = function() {
        var support, all, a, select, opt, input, marginDiv, fragment, tds, events, eventName, i, isSupported, div = document.createElement("div"), documentElement = document.documentElement;
        if (div.setAttribute("className", "t"), div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", all = div.getElementsByTagName("*"), a = div.getElementsByTagName("a")[0], !all || !all.length || !a)
            return {};
        select = document.createElement("select"), opt = select.appendChild(document.createElement("option")), input = div.getElementsByTagName("input")[0], support = {leadingWhitespace: 3 === div.firstChild.nodeType,tbody: !div.getElementsByTagName("tbody").length,htmlSerialize: !!div.getElementsByTagName("link").length,style: /top/.test(a.getAttribute("style")),hrefNormalized: "/a" === a.getAttribute("href"),opacity: /^0.55/.test(a.style.opacity),cssFloat: !!a.style.cssFloat,checkOn: "on" === input.value,optSelected: opt.selected,getSetAttribute: "t" !== div.className,enctype: !!document.createElement("form").enctype,html5Clone: "<:nav></:nav>" !== document.createElement("nav").cloneNode(!0).outerHTML,submitBubbles: !0,changeBubbles: !0,focusinBubbles: !1,deleteExpando: !0,noCloneEvent: !0,inlineBlockNeedsLayout: !1,shrinkWrapBlocks: !1,reliableMarginRight: !0}, input.checked = !0, support.noCloneChecked = input.cloneNode(!0).checked, select.disabled = !0, support.optDisabled = !opt.disabled;
        try {
            delete div.test
        } catch (e) {
            support.deleteExpando = !1
        }
        if (!div.addEventListener && div.attachEvent && div.fireEvent)
            div.attachEvent("onclick", function() {
                support.noCloneEvent = !1
            }), div.cloneNode(!0).fireEvent("onclick");
        if (input = document.createElement("input"), input.value = "t", input.setAttribute("type", "radio"), support.radioValue = "t" === input.value, input.setAttribute("checked", "checked"), div.appendChild(input), fragment = document.createDocumentFragment(), fragment.appendChild(div.lastChild), support.checkClone = fragment.cloneNode(!0).cloneNode(!0).lastChild.checked, support.appendChecked = input.checked, fragment.removeChild(input), fragment.appendChild(div), div.innerHTML = "", window.getComputedStyle)
            marginDiv = document.createElement("div"), marginDiv.style.width = "0", marginDiv.style.marginRight = "0", div.style.width = "2px", div.appendChild(marginDiv), support.reliableMarginRight = 0 === (parseInt((window.getComputedStyle(marginDiv, null) || {marginRight: 0}).marginRight, 10) || 0);
        if (div.attachEvent)
            for (i in {submit: 1,change: 1,focusin: 1}) {
                if (eventName = "on" + i, isSupported = eventName in div, !isSupported)
                    div.setAttribute(eventName, "return;"), isSupported = "function" == typeof div[eventName];
                support[i + "Bubbles"] = isSupported
            }
        return fragment.removeChild(div), fragment = select = opt = marginDiv = div = input = null, jQuery(function() {
            var container, outer, inner, table, td, offsetSupport, conMarginTop, ptlm, vb, style, html, body = document.getElementsByTagName("body")[0];
            if (body) {
                if (conMarginTop = 1, ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;", vb = "visibility:hidden;border:0;", style = "style='" + ptlm + "border:5px solid #000;padding:0;'", html = "<div " + style + "><div></div></div>" + "<table " + style + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", container = document.createElement("div"), container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px", body.insertBefore(container, body.firstChild), div = document.createElement("div"), container.appendChild(div), div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>", tds = div.getElementsByTagName("td"), isSupported = 0 === tds[0].offsetHeight, tds[0].style.display = "", tds[1].style.display = "none", support.reliableHiddenOffsets = isSupported && 0 === tds[0].offsetHeight, div.innerHTML = "", div.style.width = div.style.paddingLeft = "1px", jQuery.boxModel = support.boxModel = 2 === div.offsetWidth, "undefined" != typeof div.style.zoom)
                    div.style.display = "inline", div.style.zoom = 1, support.inlineBlockNeedsLayout = 2 === div.offsetWidth, div.style.display = "", div.innerHTML = "<div style='width:4px;'></div>", support.shrinkWrapBlocks = 2 !== div.offsetWidth;
                div.style.cssText = ptlm + vb, div.innerHTML = html, outer = div.firstChild, inner = outer.firstChild, td = outer.nextSibling.firstChild.firstChild, offsetSupport = {doesNotAddBorder: 5 !== inner.offsetTop,doesAddBorderForTableAndCells: 5 === td.offsetTop}, inner.style.position = "fixed", inner.style.top = "20px", offsetSupport.fixedPosition = 20 === inner.offsetTop || 15 === inner.offsetTop, inner.style.position = inner.style.top = "", outer.style.overflow = "hidden", outer.style.position = "relative", offsetSupport.subtractsBorderForOverflowNotVisible = -5 === inner.offsetTop, offsetSupport.doesNotIncludeMarginInBodyOffset = body.offsetTop !== conMarginTop, body.removeChild(container), div = container = null, jQuery.extend(support, offsetSupport)
            }
        }), support
    }();
    var rbrace = /^(?:\{.*\}|\[.*\])$/, rmultiDash = /([A-Z])/g;
    jQuery.extend({cache: {},uuid: 0,expando: "jQuery" + (jQuery.fn.jquery + Math.random()).replace(/\D/g, ""),noData: {embed: !0,object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet: !0},hasData: function(elem) {
            return elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando], !!elem && !isEmptyDataObject(elem)
        },data: function(elem, name, data, pvt) {
            if (jQuery.acceptData(elem)) {
                var privateCache, thisCache, ret, internalKey = jQuery.expando, getByName = "string" == typeof name, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey, isEvents = "events" === name;
                if (id && cache[id] && (isEvents || pvt || cache[id].data) || !getByName || data !== undefined) {
                    if (!id)
                        if (isNode)
                            elem[internalKey] = id = ++jQuery.uuid;
                        else
                            id = internalKey;
                    if (!cache[id])
                        if (cache[id] = {}, !isNode)
                            cache[id].toJSON = jQuery.noop;
                    if ("object" == typeof name || "function" == typeof name)
                        if (pvt)
                            cache[id] = jQuery.extend(cache[id], name);
                        else
                            cache[id].data = jQuery.extend(cache[id].data, name);
                    if (privateCache = thisCache = cache[id], !pvt) {
                        if (!thisCache.data)
                            thisCache.data = {};
                        thisCache = thisCache.data
                    }
                    if (data !== undefined)
                        thisCache[jQuery.camelCase(name)] = data;
                    if (isEvents && !thisCache[name])
                        return privateCache.events;
                    if (getByName) {
                        if (ret = thisCache[name], null == ret)
                            ret = thisCache[jQuery.camelCase(name)]
                    } else
                        ret = thisCache;
                    return ret
                }
            }
        },removeData: function(elem, name, pvt) {
            if (jQuery.acceptData(elem)) {
                var thisCache, i, l, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : internalKey;
                if (cache[id]) {
                    if (name)
                        if (thisCache = pvt ? cache[id] : cache[id].data) {
                            if (!jQuery.isArray(name))
                                if (name in thisCache)
                                    name = [name];
                                else if (name = jQuery.camelCase(name), name in thisCache)
                                    name = [name];
                                else
                                    name = name.split(" ");
                            for (i = 0, l = name.length; l > i; i++)
                                delete thisCache[name[i]];
                            if (!(pvt ? isEmptyDataObject : jQuery.isEmptyObject)(thisCache))
                                return
                        }
                    if (!pvt)
                        if (delete cache[id].data, !isEmptyDataObject(cache[id]))
                            return;
                    if (jQuery.support.deleteExpando || !cache.setInterval)
                        delete cache[id];
                    else
                        cache[id] = null;
                    if (isNode)
                        if (jQuery.support.deleteExpando)
                            delete elem[internalKey];
                        else if (elem.removeAttribute)
                            elem.removeAttribute(internalKey);
                        else
                            elem[internalKey] = null
                }
            }
        },_data: function(elem, name, data) {
            return jQuery.data(elem, name, data, !0)
        },acceptData: function(elem) {
            if (elem.nodeName) {
                var match = jQuery.noData[elem.nodeName.toLowerCase()];
                if (match)
                    return !(match === !0 || elem.getAttribute("classid") !== match)
            }
            return !0
        }}), jQuery.fn.extend({data: function(key, value) {
            var parts, attr, name, data = null;
            if ("undefined" == typeof key) {
                if (this.length)
                    if (data = jQuery.data(this[0]), 1 === this[0].nodeType && !jQuery._data(this[0], "parsedAttrs")) {
                        attr = this[0].attributes;
                        for (var i = 0, l = attr.length; l > i; i++)
                            if (name = attr[i].name, 0 === name.indexOf("data-"))
                                name = jQuery.camelCase(name.substring(5)), dataAttr(this[0], name, data[name]);
                        jQuery._data(this[0], "parsedAttrs", !0)
                    }
                return data
            } else if ("object" == typeof key)
                return this.each(function() {
                    jQuery.data(this, key)
                });
            if (parts = key.split("."), parts[1] = parts[1] ? "." + parts[1] : "", value === undefined) {
                if (data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]), data === undefined && this.length)
                    data = jQuery.data(this[0], key), data = dataAttr(this[0], key, data);
                return data === undefined && parts[1] ? this.data(parts[0]) : data
            } else
                return this.each(function() {
                    var self = jQuery(this), args = [parts[0], value];
                    self.triggerHandler("setData" + parts[1] + "!", args), jQuery.data(this, key, value), self.triggerHandler("changeData" + parts[1] + "!", args)
                })
        },removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key)
            })
        }}), jQuery.extend({_mark: function(elem, type) {
            if (elem)
                type = (type || "fx") + "mark", jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1)
        },_unmark: function(force, elem, type) {
            if (force !== !0)
                type = elem, elem = force, force = !1;
            if (elem) {
                type = type || "fx";
                var key = type + "mark", count = force ? 0 : (jQuery._data(elem, key) || 1) - 1;
                if (count)
                    jQuery._data(elem, key, count);
                else
                    jQuery.removeData(elem, key, !0), handleQueueMarkDefer(elem, type, "mark")
            }
        },queue: function(elem, type, data) {
            var q;
            if (elem) {
                if (type = (type || "fx") + "queue", q = jQuery._data(elem, type), data)
                    if (!q || jQuery.isArray(data))
                        q = jQuery._data(elem, type, jQuery.makeArray(data));
                    else
                        q.push(data);
                return q || []
            }
        },dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), fn = queue.shift(), hooks = {};
            if ("inprogress" === fn)
                fn = queue.shift();
            if (fn) {
                if ("fx" === type)
                    queue.unshift("inprogress");
                jQuery._data(elem, type + ".run", hooks), fn.call(elem, function() {
                    jQuery.dequeue(elem, type)
                }, hooks)
            }
            if (!queue.length)
                jQuery.removeData(elem, type + "queue " + type + ".run", !0), handleQueueMarkDefer(elem, type, "queue")
        }}), jQuery.fn.extend({queue: function(type, data) {
            if ("string" != typeof type)
                data = type, type = "fx";
            if (data === undefined)
                return jQuery.queue(this[0], type);
            else
                return this.each(function() {
                    var queue = jQuery.queue(this, type, data);
                    if ("fx" === type && "inprogress" !== queue[0])
                        jQuery.dequeue(this, type)
                })
        },dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type)
            })
        },delay: function(time, type) {
            return time = jQuery.fx ? jQuery.fx.speeds[time] || time : time, type = type || "fx", this.queue(type, function(next, hooks) {
                var timeout = setTimeout(next, time);
                hooks.stop = function() {
                    clearTimeout(timeout)
                }
            })
        },clearQueue: function(type) {
            return this.queue(type || "fx", [])
        },promise: function(type, object) {
            function resolve() {
                if (!--count)
                    defer.resolveWith(elements, [elements])
            }
            if ("string" != typeof type)
                object = type, type = undefined;
            type = type || "fx";
            for (var defer = jQuery.Deferred(), elements = this, i = elements.length, count = 1, deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", tmp; i--; )
                if (tmp = jQuery.data(elements[i], deferDataKey, undefined, !0) || (jQuery.data(elements[i], queueDataKey, undefined, !0) || jQuery.data(elements[i], markDataKey, undefined, !0)) && jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), !0))
                    count++, tmp.add(resolve);
            return resolve(), defer.promise()
        }});
    var rclass = /[\n\t\r]/g, rspace = /\s+/, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea)?$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute, nodeHook, boolHook, fixSpecified;
    if (jQuery.fn.extend({attr: function(name, value) {
            return jQuery.access(this, name, value, !0, jQuery.attr)
        },removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name)
            })
        },prop: function(name, value) {
            return jQuery.access(this, name, value, !0, jQuery.prop)
        },removeProp: function(name) {
            return name = jQuery.propFix[name] || name, this.each(function() {
                try {
                    this[name] = undefined, delete this[name]
                } catch (e) {
                }
            })
        },addClass: function(value) {
            var classNames, i, l, elem, setClass, c, cl;
            if (jQuery.isFunction(value))
                return this.each(function(j) {
                    jQuery(this).addClass(value.call(this, j, this.className))
                });
            if (value && "string" == typeof value)
                for (classNames = value.split(rspace), i = 0, l = this.length; l > i; i++)
                    if (elem = this[i], 1 === elem.nodeType)
                        if (!elem.className && 1 === classNames.length)
                            elem.className = value;
                        else {
                            for (setClass = " " + elem.className + " ", c = 0, cl = classNames.length; cl > c; c++)
                                if (!~setClass.indexOf(" " + classNames[c] + " "))
                                    setClass += classNames[c] + " ";
                            elem.className = jQuery.trim(setClass)
                        }
            return this
        },removeClass: function(value) {
            var classNames, i, l, elem, className, c, cl;
            if (jQuery.isFunction(value))
                return this.each(function(j) {
                    jQuery(this).removeClass(value.call(this, j, this.className))
                });
            if (value && "string" == typeof value || value === undefined)
                for (classNames = (value || "").split(rspace), i = 0, l = this.length; l > i; i++)
                    if (elem = this[i], 1 === elem.nodeType && elem.className)
                        if (value) {
                            for (className = (" " + elem.className + " ").replace(rclass, " "), c = 0, cl = classNames.length; cl > c; c++)
                                className = className.replace(" " + classNames[c] + " ", " ");
                            elem.className = jQuery.trim(className)
                        } else
                            elem.className = "";
            return this
        },toggleClass: function(value, stateVal) {
            var type = typeof value, isBool = "boolean" == typeof stateVal;
            if (jQuery.isFunction(value))
                return this.each(function(i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal)
                });
            else
                return this.each(function() {
                    if ("string" === type)
                        for (var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(rspace); className = classNames[i++]; )
                            state = isBool ? state : !self.hasClass(className), self[state ? "addClass" : "removeClass"](className);
                    else if ("undefined" === type || "boolean" === type) {
                        if (this.className)
                            jQuery._data(this, "__className__", this.className);
                        this.className = this.className || value === !1 ? "" : jQuery._data(this, "__className__") || ""
                    }
                })
        },hasClass: function(selector) {
            for (var className = " " + selector + " ", i = 0, l = this.length; l > i; i++)
                if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1)
                    return !0;
            return !1
        },val: function(value) {
            var hooks, ret, isFunction, elem = this[0];
            if (arguments.length)
                return isFunction = jQuery.isFunction(value), this.each(function(i) {
                    var self = jQuery(this), val;
                    if (1 === this.nodeType) {
                        if (isFunction)
                            val = value.call(this, i, self.val());
                        else
                            val = value;
                        if (null == val)
                            val = "";
                        else if ("number" == typeof val)
                            val += "";
                        else if (jQuery.isArray(val))
                            val = jQuery.map(val, function(value) {
                                return null == value ? "" : value + ""
                            });
                        if (hooks = jQuery.valHooks[this.nodeName.toLowerCase()] || jQuery.valHooks[this.type], !(hooks && "set" in hooks && hooks.set(this, val, "value") !== undefined))
                            this.value = val
                    }
                });
            else if (elem)
                if (hooks = jQuery.valHooks[elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type], hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined)
                    return ret;
                else
                    return ret = elem.value, "string" == typeof ret ? ret.replace(rreturn, "") : null == ret ? "" : ret
        }}), jQuery.extend({valHooks: {option: {get: function(elem) {
                    var val = elem.attributes.value;
                    return !val || val.specified ? elem.value : elem.text
                }},select: {get: function(elem) {
                    var value, i, max, option, index = elem.selectedIndex, values = [], options = elem.options, one = "select-one" === elem.type;
                    if (0 > index)
                        return null;
                    for (i = one ? index : 0, max = one ? index + 1 : options.length; max > i; i++)
                        if (option = options[i], !(!option.selected || (jQuery.support.optDisabled ? option.disabled : null !== option.getAttribute("disabled")) || option.parentNode.disabled && jQuery.nodeName(option.parentNode, "optgroup"))) {
                            if (value = jQuery(option).val(), one)
                                return value;
                            values.push(value)
                        }
                    if (one && !values.length && options.length)
                        return jQuery(options[index]).val();
                    else
                        return values
                },set: function(elem, value) {
                    var values = jQuery.makeArray(value);
                    if (jQuery(elem).find("option").each(function() {
                        this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0
                    }), !values.length)
                        elem.selectedIndex = -1;
                    return values
                }}},attrFn: {val: !0,css: !0,html: !0,text: !0,data: !0,width: !0,height: !0,offset: !0},attr: function(elem, name, value, pass) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) {
                if (pass && name in jQuery.attrFn)
                    return jQuery(elem)[name](value);
                if ("undefined" == typeof elem.getAttribute)
                    return jQuery.prop(elem, name, value);
                if (notxml = 1 !== nType || !jQuery.isXMLDoc(elem))
                    name = name.toLowerCase(), hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook);
                if (value !== undefined)
                    if (null === value)
                        return jQuery.removeAttr(elem, name), void 0;
                    else if (hooks && "set" in hooks && notxml && (ret = hooks.set(elem, value, name)) !== undefined)
                        return ret;
                    else
                        return elem.setAttribute(name, "" + value), value;
                else if (hooks && "get" in hooks && notxml && null !== (ret = hooks.get(elem, name)))
                    return ret;
                else
                    return ret = elem.getAttribute(name), null === ret ? undefined : ret
            }
        },removeAttr: function(elem, value) {
            var propName, attrNames, name, l, i = 0;
            if (value && 1 === elem.nodeType)
                for (attrNames = value.toLowerCase().split(rspace), l = attrNames.length; l > i; i++)
                    if (name = attrNames[i])
                        if (propName = jQuery.propFix[name] || name, jQuery.attr(elem, name, ""), elem.removeAttribute(getSetAttribute ? name : propName), rboolean.test(name) && propName in elem)
                            elem[propName] = !1
        },attrHooks: {type: {set: function(elem, value) {
                    if (rtype.test(elem.nodeName) && elem.parentNode)
                        jQuery.error("type property can't be changed");
                    else if (!jQuery.support.radioValue && "radio" === value && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        if (elem.setAttribute("type", value), val)
                            elem.value = val;
                        return value
                    }
                }},value: {get: function(elem, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button"))
                        return nodeHook.get(elem, name);
                    else
                        return name in elem ? elem.value : null
                },set: function(elem, value, name) {
                    if (nodeHook && jQuery.nodeName(elem, "button"))
                        return nodeHook.set(elem, value, name);
                    else
                        return elem.value = value, void 0
                }}},propFix: {tabindex: "tabIndex",readonly: "readOnly","for": "htmlFor","class": "className",maxlength: "maxLength",cellspacing: "cellSpacing",cellpadding: "cellPadding",rowspan: "rowSpan",colspan: "colSpan",usemap: "useMap",frameborder: "frameBorder",contenteditable: "contentEditable"},prop: function(elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (elem && 3 !== nType && 8 !== nType && 2 !== nType) {
                if (notxml = 1 !== nType || !jQuery.isXMLDoc(elem))
                    name = jQuery.propFix[name] || name, hooks = jQuery.propHooks[name];
                if (value !== undefined)
                    if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined)
                        return ret;
                    else
                        return elem[name] = value;
                else if (hooks && "get" in hooks && null !== (ret = hooks.get(elem, name)))
                    return ret;
                else
                    return elem[name]
            }
        },propHooks: {tabIndex: {get: function(elem) {
                    var attributeNode = elem.getAttributeNode("tabindex");
                    return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined
                }}}}), jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex, boolHook = {get: function(elem, name) {
            var attrNode, property = jQuery.prop(elem, name);
            return property === !0 || "boolean" != typeof property && (attrNode = elem.getAttributeNode(name)) && attrNode.nodeValue !== !1 ? name.toLowerCase() : undefined
        },set: function(elem, value, name) {
            var propName;
            if (value === !1)
                jQuery.removeAttr(elem, name);
            else {
                if (propName = jQuery.propFix[name] || name, propName in elem)
                    elem[propName] = !0;
                elem.setAttribute(name, name.toLowerCase())
            }
            return name
        }}, !getSetAttribute)
        fixSpecified = {name: !0,id: !0}, nodeHook = jQuery.valHooks.button = {get: function(elem, name) {
                var ret;
                return ret = elem.getAttributeNode(name), ret && (fixSpecified[name] ? "" !== ret.nodeValue : ret.specified) ? ret.nodeValue : undefined
            },set: function(elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret)
                    ret = document.createAttribute(name), elem.setAttributeNode(ret);
                return ret.nodeValue = value + ""
            }}, jQuery.attrHooks.tabindex.set = nodeHook.set, jQuery.each(["width", "height"], function(i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {set: function(elem, value) {
                    if ("" === value)
                        return elem.setAttribute(name, "auto"), value;
                    else
                        return void 0
                }})
        }), jQuery.attrHooks.contenteditable = {get: nodeHook.get,set: function(elem, value, name) {
                if ("" === value)
                    value = "false";
                nodeHook.set(elem, value, name)
            }};
    if (!jQuery.support.hrefNormalized)
        jQuery.each(["href", "src", "width", "height"], function(i, name) {
            jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {get: function(elem) {
                    var ret = elem.getAttribute(name, 2);
                    return null === ret ? undefined : ret
                }})
        });
    if (!jQuery.support.style)
        jQuery.attrHooks.style = {get: function(elem) {
                return elem.style.cssText.toLowerCase() || undefined
            },set: function(elem, value) {
                return elem.style.cssText = "" + value
            }};
    if (!jQuery.support.optSelected)
        jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {get: function(elem) {
                var parent = elem.parentNode;
                if (parent)
                    if (parent.selectedIndex, parent.parentNode)
                        parent.parentNode.selectedIndex;
                return null
            }});
    if (!jQuery.support.enctype)
        jQuery.propFix.enctype = "encoding";
    if (!jQuery.support.checkOn)
        jQuery.each(["radio", "checkbox"], function() {
            jQuery.valHooks[this] = {get: function(elem) {
                    return null === elem.getAttribute("value") ? "on" : elem.value
                }}
        });
    jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {set: function(elem, value) {
                if (jQuery.isArray(value))
                    return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
                else
                    return void 0
            }})
    });
    var rformElems = /^(?:textarea|input|select)$/i, rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/, rhoverHack = /\bhover(\.\S+)?\b/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, quickParse = function(selector) {
        var quick = rquickIs.exec(selector);
        if (quick)
            quick[1] = (quick[1] || "").toLowerCase(), quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
        return quick
    }, quickIs = function(elem, m) {
        var attrs = elem.attributes || {};
        return !(m[1] && elem.nodeName.toLowerCase() !== m[1] || m[2] && (attrs.id || {}).value !== m[2] || m[3] && !m[3].test((attrs["class"] || {}).value))
    }, hoverHack = function(events) {
        return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1")
    };
    if (jQuery.event = {add: function(elem, types, handler, data, selector) {
            var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, quick, handlers, special;
            if (3 !== elem.nodeType && 8 !== elem.nodeType && types && handler && (elemData = jQuery._data(elem))) {
                if (handler.handler)
                    handleObjIn = handler, handler = handleObjIn.handler;
                if (!handler.guid)
                    handler.guid = jQuery.guid++;
                if (events = elemData.events, !events)
                    elemData.events = events = {};
                if (eventHandle = elemData.handle, !eventHandle)
                    elemData.handle = eventHandle = function(e) {
                        return "undefined" != typeof jQuery && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined
                    }, eventHandle.elem = elem;
                for (types = jQuery.trim(hoverHack(types)).split(" "), t = 0; t < types.length; t++) {
                    if (tns = rtypenamespace.exec(types[t]) || [], type = tns[1], namespaces = (tns[2] || "").split(".").sort(), special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, special = jQuery.event.special[type] || {}, handleObj = jQuery.extend({type: type,origType: tns[1],data: data,handler: handler,guid: handler.guid,selector: selector,quick: quickParse(selector),namespace: namespaces.join(".")}, handleObjIn), handlers = events[type], !handlers)
                        if (handlers = events[type] = [], handlers.delegateCount = 0, !special.setup || special.setup.call(elem, data, namespaces, eventHandle) === !1)
                            if (elem.addEventListener)
                                elem.addEventListener(type, eventHandle, !1);
                            else if (elem.attachEvent)
                                elem.attachEvent("on" + type, eventHandle);
                    if (special.add)
                        if (special.add.call(elem, handleObj), !handleObj.handler.guid)
                            handleObj.handler.guid = handler.guid;
                    if (selector)
                        handlers.splice(handlers.delegateCount++, 0, handleObj);
                    else
                        handlers.push(handleObj);
                    jQuery.event.global[type] = !0
                }
                elem = null
            }
        },global: {},remove: function(elem, types, handler, selector, mappedTypes) {
            var elemData = jQuery.hasData(elem) && jQuery._data(elem), t, tns, type, origType, namespaces, origCount, j, events, special, handle, eventType, handleObj;
            if (elemData && (events = elemData.events)) {
                for (types = jQuery.trim(hoverHack(types || "")).split(" "), t = 0; t < types.length; t++)
                    if (tns = rtypenamespace.exec(types[t]) || [], type = origType = tns[1], namespaces = tns[2], type) {
                        for (special = jQuery.event.special[type] || {}, type = (selector ? special.delegateType : special.bindType) || type, eventType = events[type] || [], origCount = eventType.length, namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null, j = 0; j < eventType.length; j++)
                            if (handleObj = eventType[j], !(!mappedTypes && origType !== handleObj.origType || handler && handler.guid !== handleObj.guid || namespaces && !namespaces.test(handleObj.namespace) || selector && selector !== handleObj.selector && ("**" !== selector || !handleObj.selector))) {
                                if (eventType.splice(j--, 1), handleObj.selector)
                                    eventType.delegateCount--;
                                if (special.remove)
                                    special.remove.call(elem, handleObj)
                            }
                        if (0 === eventType.length && origCount !== eventType.length) {
                            if (!special.teardown || special.teardown.call(elem, namespaces) === !1)
                                jQuery.removeEvent(elem, type, elemData.handle);
                            delete events[type]
                        }
                    } else
                        for (type in events)
                            jQuery.event.remove(elem, type + types[t], handler, selector, !0);
                if (jQuery.isEmptyObject(events)) {
                    if (handle = elemData.handle)
                        handle.elem = null;
                    jQuery.removeData(elem, ["events", "handle"], !0)
                }
            }
        },customEvent: {getData: !0,setData: !0,changeData: !0},trigger: function(event, data, elem, onlyHandlers) {
            if (!elem || 3 !== elem.nodeType && 8 !== elem.nodeType) {
                var type = event.type || event, namespaces = [], cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;
                if (!rfocusMorph.test(type + jQuery.event.triggered)) {
                    if (type.indexOf("!") >= 0)
                        type = type.slice(0, -1), exclusive = !0;
                    if (type.indexOf(".") >= 0)
                        namespaces = type.split("."), type = namespaces.shift(), namespaces.sort();
                    if (elem && !jQuery.event.customEvent[type] || jQuery.event.global[type])
                        if (event = "object" == typeof event ? event[jQuery.expando] ? event : new jQuery.Event(type, event) : new jQuery.Event(type), event.type = type, event.isTrigger = !0, event.exclusive = exclusive, event.namespace = namespaces.join("."), event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, ontype = type.indexOf(":") < 0 ? "on" + type : "", elem) {
                            if (event.result = undefined, !event.target)
                                event.target = elem;
                            if (data = null != data ? jQuery.makeArray(data) : [], data.unshift(event), special = jQuery.event.special[type] || {}, !special.trigger || special.trigger.apply(elem, data) !== !1) {
                                if (eventPath = [[elem, special.bindType || type]], !onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                                    for (bubbleType = special.delegateType || type, cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode, old = null; cur; cur = cur.parentNode)
                                        eventPath.push([cur, bubbleType]), old = cur;
                                    if (old && old === elem.ownerDocument)
                                        eventPath.push([old.defaultView || old.parentWindow || window, bubbleType])
                                }
                                for (i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {
                                    if (cur = eventPath[i][0], event.type = eventPath[i][1], handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle"))
                                        handle.apply(cur, data);
                                    if (handle = ontype && cur[ontype], handle && jQuery.acceptData(cur) && handle.apply(cur, data) === !1)
                                        event.preventDefault()
                                }
                                if (event.type = type, !onlyHandlers && !event.isDefaultPrevented())
                                    if (!(special._default && special._default.apply(elem.ownerDocument, data) !== !1 || "click" === type && jQuery.nodeName(elem, "a") || !jQuery.acceptData(elem)))
                                        if (ontype && elem[type] && ("focus" !== type && "blur" !== type || 0 !== event.target.offsetWidth) && !jQuery.isWindow(elem)) {
                                            if (old = elem[ontype])
                                                elem[ontype] = null;
                                            if (jQuery.event.triggered = type, elem[type](), jQuery.event.triggered = undefined, old)
                                                elem[ontype] = old
                                        }
                                return event.result
                            }
                        } else {
                            cache = jQuery.cache;
                            for (i in cache)
                                if (cache[i].events && cache[i].events[type])
                                    jQuery.event.trigger(event, data, cache[i].handle.elem, !0)
                        }
                }
            }
        },dispatch: function(event) {
            event = jQuery.event.fix(event || window.event);
            var handlers = (jQuery._data(this, "events") || {})[event.type] || [], delegateCount = handlers.delegateCount, args = [].slice.call(arguments, 0), run_all = !event.exclusive && !event.namespace, handlerQueue = [], i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;
            if (args[0] = event, event.delegateTarget = this, delegateCount && !event.target.disabled && (!event.button || "click" !== event.type))
                for (jqcur = jQuery(this), jqcur.context = this.ownerDocument || this, cur = event.target; cur != this; cur = cur.parentNode || this) {
                    for (selMatch = {}, matches = [], jqcur[0] = cur, i = 0; delegateCount > i; i++) {
                        if (handleObj = handlers[i], sel = handleObj.selector, selMatch[sel] === undefined)
                            selMatch[sel] = handleObj.quick ? quickIs(cur, handleObj.quick) : jqcur.is(sel);
                        if (selMatch[sel])
                            matches.push(handleObj)
                    }
                    if (matches.length)
                        handlerQueue.push({elem: cur,matches: matches})
                }
            if (handlers.length > delegateCount)
                handlerQueue.push({elem: this,matches: handlers.slice(delegateCount)});
            for (i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++)
                for (matched = handlerQueue[i], event.currentTarget = matched.elem, j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++)
                    if (handleObj = matched.matches[j], run_all || !event.namespace && !handleObj.namespace || event.namespace_re && event.namespace_re.test(handleObj.namespace))
                        if (event.data = handleObj.data, event.handleObj = handleObj, ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args), ret !== undefined)
                            if (event.result = ret, ret === !1)
                                event.preventDefault(), event.stopPropagation();
            return event.result
        },props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks: {},keyHooks: {props: "char charCode key keyCode".split(" "),filter: function(event, original) {
                if (null == event.which)
                    event.which = null != original.charCode ? original.charCode : original.keyCode;
                return event
            }},mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter: function(event, original) {
                var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;
                if (null == event.pageX && null != original.clientX)
                    eventDoc = event.target.ownerDocument || document, doc = eventDoc.documentElement, body = eventDoc.body, event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0), event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                if (!event.relatedTarget && fromElement)
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                if (!event.which && button !== undefined)
                    event.which = 1 & button ? 1 : 2 & button ? 3 : 4 & button ? 2 : 0;
                return event
            }},fix: function(event) {
            if (event[jQuery.expando])
                return event;
            var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            for (event = jQuery.Event(originalEvent), i = copy.length; i; )
                prop = copy[--i], event[prop] = originalEvent[prop];
            if (!event.target)
                event.target = originalEvent.srcElement || document;
            if (3 === event.target.nodeType)
                event.target = event.target.parentNode;
            if (event.metaKey === undefined)
                event.metaKey = event.ctrlKey;
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event
        },special: {ready: {setup: jQuery.bindReady},load: {noBubble: !0},focus: {delegateType: "focusin"},blur: {delegateType: "focusout"},beforeunload: {setup: function(data, namespaces, eventHandle) {
                    if (jQuery.isWindow(this))
                        this.onbeforeunload = eventHandle
                },teardown: function(namespaces, eventHandle) {
                    if (this.onbeforeunload === eventHandle)
                        this.onbeforeunload = null
                }}},simulate: function(type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event, event, {type: type,isSimulated: !0,originalEvent: {}});
            if (bubble)
                jQuery.event.trigger(e, null, elem);
            else
                jQuery.event.dispatch.call(elem, e);
            if (e.isDefaultPrevented())
                event.preventDefault()
        }}, jQuery.event.handle = jQuery.event.dispatch, jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
        if (elem.removeEventListener)
            elem.removeEventListener(type, handle, !1)
    } : function(elem, type, handle) {
        if (elem.detachEvent)
            elem.detachEvent("on" + type, handle)
    }, jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event))
            return new jQuery.Event(src, props);
        if (src && src.type)
            this.originalEvent = src, this.type = src.type, this.isDefaultPrevented = src.defaultPrevented || src.returnValue === !1 || src.getPreventDefault && src.getPreventDefault() ? returnTrue : returnFalse;
        else
            this.type = src;
        if (props)
            jQuery.extend(this, props);
        this.timeStamp = src && src.timeStamp || jQuery.now(), this[jQuery.expando] = !0
    }, jQuery.Event.prototype = {preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
            var e = this.originalEvent;
            if (e)
                if (e.preventDefault)
                    e.preventDefault();
                else
                    e.returnValue = !1
        },stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
            var e = this.originalEvent;
            if (e) {
                if (e.stopPropagation)
                    e.stopPropagation();
                e.cancelBubble = !0
            }
        },stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue, this.stopPropagation()
        },isDefaultPrevented: returnFalse,isPropagationStopped: returnFalse,isImmediatePropagationStopped: returnFalse}, jQuery.each({mouseenter: "mouseover",mouseleave: "mouseout"}, function(orig, fix) {
        jQuery.event.special[orig] = {delegateType: fix,bindType: fix,handle: function(event) {
                var target = this, related = event.relatedTarget, handleObj = event.handleObj, selector = handleObj.selector, ret;
                if (!related || related !== target && !jQuery.contains(target, related))
                    event.type = handleObj.origType, ret = handleObj.handler.apply(this, arguments), event.type = fix;
                return ret
            }}
    }), !jQuery.support.submitBubbles)
        jQuery.event.special.submit = {setup: function() {
                if (jQuery.nodeName(this, "form"))
                    return !1;
                else
                    return jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                        var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                        if (form && !form._submit_attached)
                            jQuery.event.add(form, "submit._submit", function(event) {
                                if (this.parentNode && !event.isTrigger)
                                    jQuery.event.simulate("submit", this.parentNode, event, !0)
                            }), form._submit_attached = !0
                    }), void 0
            },teardown: function() {
                if (jQuery.nodeName(this, "form"))
                    return !1;
                else
                    return jQuery.event.remove(this, "._submit"), void 0
            }};
    if (!jQuery.support.changeBubbles)
        jQuery.event.special.change = {setup: function() {
                if (rformElems.test(this.nodeName)) {
                    if ("checkbox" === this.type || "radio" === this.type)
                        jQuery.event.add(this, "propertychange._change", function(event) {
                            if ("checked" === event.originalEvent.propertyName)
                                this._just_changed = !0
                        }), jQuery.event.add(this, "click._change", function(event) {
                            if (this._just_changed && !event.isTrigger)
                                this._just_changed = !1, jQuery.event.simulate("change", this, event, !0)
                        });
                    return !1
                }
                jQuery.event.add(this, "beforeactivate._change", function(e) {
                    var elem = e.target;
                    if (rformElems.test(elem.nodeName) && !elem._change_attached)
                        jQuery.event.add(elem, "change._change", function(event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger)
                                jQuery.event.simulate("change", this.parentNode, event, !0)
                        }), elem._change_attached = !0
                })
            },handle: function(event) {
                var elem = event.target;
                if (this !== elem || event.isSimulated || event.isTrigger || "radio" !== elem.type && "checkbox" !== elem.type)
                    return event.handleObj.handler.apply(this, arguments);
                else
                    return void 0
            },teardown: function() {
                return jQuery.event.remove(this, "._change"), rformElems.test(this.nodeName)
            }};
    if (!jQuery.support.focusinBubbles)
        jQuery.each({focus: "focusin",blur: "focusout"}, function(orig, fix) {
            var attaches = 0, handler = function(event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), !0)
            };
            jQuery.event.special[fix] = {setup: function() {
                    if (0 === attaches++)
                        document.addEventListener(orig, handler, !0)
                },teardown: function() {
                    if (0 === --attaches)
                        document.removeEventListener(orig, handler, !0)
                }}
        });
    jQuery.fn.extend({on: function(types, selector, data, fn, one) {
            var origFn, type;
            if ("object" == typeof types) {
                if ("string" != typeof selector)
                    data = selector, selector = undefined;
                for (type in types)
                    this.on(type, selector, data, types[type], one);
                return this
            }
            if (null == data && null == fn)
                fn = selector, data = selector = undefined;
            else if (null == fn)
                if ("string" == typeof selector)
                    fn = data, data = undefined;
                else
                    fn = data, data = selector, selector = undefined;
            if (fn === !1)
                fn = returnFalse;
            else if (!fn)
                return this;
            if (1 === one)
                origFn = fn, fn = function(event) {
                    return jQuery().off(event), origFn.apply(this, arguments)
                }, fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            return this.each(function() {
                jQuery.event.add(this, types, fn, data, selector)
            })
        },one: function(types, selector, data, fn) {
            return this.on.call(this, types, selector, data, fn, 1)
        },off: function(types, selector, fn) {
            if (types && types.preventDefault && types.handleObj) {
                var handleObj = types.handleObj;
                return jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type, handleObj.selector, handleObj.handler), this
            }
            if ("object" == typeof types) {
                for (var type in types)
                    this.off(type, selector, types[type]);
                return this
            }
            if (selector === !1 || "function" == typeof selector)
                fn = selector, selector = undefined;
            if (fn === !1)
                fn = returnFalse;
            return this.each(function() {
                jQuery.event.remove(this, types, fn, selector)
            })
        },bind: function(types, data, fn) {
            return this.on(types, null, data, fn)
        },unbind: function(types, fn) {
            return this.off(types, null, fn)
        },live: function(types, data, fn) {
            return jQuery(this.context).on(types, this.selector, data, fn), this
        },die: function(types, fn) {
            return jQuery(this.context).off(types, this.selector || "**", fn), this
        },delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn)
        },undelegate: function(selector, types, fn) {
            return 1 == arguments.length ? this.off(selector, "**") : this.off(types, selector, fn)
        },trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this)
            })
        },triggerHandler: function(type, data) {
            if (this[0])
                return jQuery.event.trigger(type, data, this[0], !0);
            else
                return void 0
        },toggle: function(fn) {
            var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function(event) {
                var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0) % i;
                return jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1), event.preventDefault(), args[lastToggle].apply(this, arguments) || !1
            };
            for (toggler.guid = guid; i < args.length; )
                args[i++].guid = guid;
            return this.click(toggler)
        },hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver)
        }}), jQuery.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(i, name) {
        if (jQuery.fn[name] = function(data, fn) {
            if (null == fn)
                fn = data, data = null;
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name)
        }, jQuery.attrFn)
            jQuery.attrFn[name] = !0;
        if (rkeyEvent.test(name))
            jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
        if (rmouseEvent.test(name))
            jQuery.event.fixHooks[name] = jQuery.event.mouseHooks
    }), function() {
        function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; l > i; i++) {
                var elem = checkSet[i];
                if (elem) {
                    var match = !1;
                    for (elem = elem[dir]; elem; ) {
                        if (elem[expando] === doneName) {
                            match = checkSet[elem.sizset];
                            break
                        }
                        if (1 === elem.nodeType && !isXML)
                            elem[expando] = doneName, elem.sizset = i;
                        if (elem.nodeName.toLowerCase() === cur) {
                            match = elem;
                            break
                        }
                        elem = elem[dir]
                    }
                    checkSet[i] = match
                }
            }
        }
        function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
            for (var i = 0, l = checkSet.length; l > i; i++) {
                var elem = checkSet[i];
                if (elem) {
                    var match = !1;
                    for (elem = elem[dir]; elem; ) {
                        if (elem[expando] === doneName) {
                            match = checkSet[elem.sizset];
                            break
                        }
                        if (1 === elem.nodeType) {
                            if (!isXML)
                                elem[expando] = doneName, elem.sizset = i;
                            if ("string" != typeof cur) {
                                if (elem === cur) {
                                    match = !0;
                                    break
                                }
                            } else if (Sizzle.filter(cur, [elem]).length > 0) {
                                match = elem;
                                break
                            }
                        }
                        elem = elem[dir]
                    }
                    checkSet[i] = match
                }
            }
        }
        var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, expando = "sizcache" + (Math.random() + "").replace(".", ""), done = 0, toString = Object.prototype.toString, hasDuplicate = !1, baseHasDuplicate = !0, rBackslash = /\\/g, rReturn = /\r\n/g, rNonWord = /\W/;
        [0, 0].sort(function() {
            return baseHasDuplicate = !1, 0
        });
        var Sizzle = function(selector, context, results, seed) {
            results = results || [], context = context || document;
            var origContext = context;
            if (1 !== context.nodeType && 9 !== context.nodeType)
                return [];
            if (!selector || "string" != typeof selector)
                return results;
            var m, set, checkSet, extra, ret, cur, pop, i, prune = !0, contextXML = Sizzle.isXML(context), parts = [], soFar = selector;
            do
                if (chunker.exec(""), m = chunker.exec(soFar))
                    if (soFar = m[3], parts.push(m[1]), m[2]) {
                        extra = m[3];
                        break
                    }
            while (m);
            if (parts.length > 1 && origPOS.exec(selector))
                if (2 === parts.length && Expr.relative[parts[0]])
                    set = posProcess(parts[0] + parts[1], context, seed);
                else
                    for (set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context); parts.length; ) {
                        if (selector = parts.shift(), Expr.relative[selector])
                            selector += parts.shift();
                        set = posProcess(selector, set, seed)
                    }
            else {
                if (!seed && parts.length > 1 && 9 === context.nodeType && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]))
                    ret = Sizzle.find(parts.shift(), context, contextXML), context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                if (context) {
                    if (ret = seed ? {expr: parts.pop(),set: makeArray(seed)} : Sizzle.find(parts.pop(), 1 === parts.length && ("~" === parts[0] || "+" === parts[0]) && context.parentNode ? context.parentNode : context, contextXML), set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set, parts.length > 0)
                        checkSet = makeArray(set);
                    else
                        prune = !1;
                    for (; parts.length; ) {
                        if (cur = parts.pop(), pop = cur, !Expr.relative[cur])
                            cur = "";
                        else
                            pop = parts.pop();
                        if (null == pop)
                            pop = context;
                        Expr.relative[cur](checkSet, pop, contextXML)
                    }
                } else
                    checkSet = parts = []
            }
            if (!checkSet)
                checkSet = set;
            if (!checkSet)
                Sizzle.error(cur || selector);
            if ("[object Array]" === toString.call(checkSet)) {
                if (!prune)
                    results.push.apply(results, checkSet);
                else if (context && 1 === context.nodeType) {
                    for (i = 0; null != checkSet[i]; i++)
                        if (checkSet[i] && (checkSet[i] === !0 || 1 === checkSet[i].nodeType && Sizzle.contains(context, checkSet[i])))
                            results.push(set[i])
                } else
                    for (i = 0; null != checkSet[i]; i++)
                        if (checkSet[i] && 1 === checkSet[i].nodeType)
                            results.push(set[i])
            } else
                makeArray(checkSet, results);
            if (extra)
                Sizzle(extra, origContext, results, seed), Sizzle.uniqueSort(results);
            return results
        };
        Sizzle.uniqueSort = function(results) {
            if (sortOrder)
                if (hasDuplicate = baseHasDuplicate, results.sort(sortOrder), hasDuplicate)
                    for (var i = 1; i < results.length; i++)
                        if (results[i] === results[i - 1])
                            results.splice(i--, 1);
            return results
        }, Sizzle.matches = function(expr, set) {
            return Sizzle(expr, null, null, set)
        }, Sizzle.matchesSelector = function(node, expr) {
            return Sizzle(expr, null, null, [node]).length > 0
        }, Sizzle.find = function(expr, context, isXML) {
            var set, i, len, match, type, left;
            if (!expr)
                return [];
            for (i = 0, len = Expr.order.length; len > i; i++)
                if (type = Expr.order[i], match = Expr.leftMatch[type].exec(expr))
                    if (left = match[1], match.splice(1, 1), "\\" !== left.substr(left.length - 1))
                        if (match[1] = (match[1] || "").replace(rBackslash, ""), set = Expr.find[type](match, context, isXML), null != set) {
                            expr = expr.replace(Expr.match[type], "");
                            break
                        }
            if (!set)
                set = "undefined" != typeof context.getElementsByTagName ? context.getElementsByTagName("*") : [];
            return {set: set,expr: expr}
        }, Sizzle.filter = function(expr, set, inplace, not) {
            for (var match, anyFound, type, found, item, filter, left, i, pass, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]); expr && set.length; ) {
                for (type in Expr.filter)
                    if (null != (match = Expr.leftMatch[type].exec(expr)) && match[2]) {
                        if (filter = Expr.filter[type], left = match[1], anyFound = !1, match.splice(1, 1), "\\" === left.substr(left.length - 1))
                            continue;
                        if (curLoop === result)
                            result = [];
                        if (Expr.preFilter[type])
                            if (match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter), !match)
                                anyFound = found = !0;
                            else if (match === !0)
                                continue;
                        if (match)
                            for (i = 0; null != (item = curLoop[i]); i++)
                                if (item)
                                    if (found = filter(item, match, i, curLoop), pass = not ^ found, inplace && null != found)
                                        if (pass)
                                            anyFound = !0;
                                        else
                                            curLoop[i] = !1;
                                    else if (pass)
                                        result.push(item), anyFound = !0;
                        if (found !== undefined) {
                            if (!inplace)
                                curLoop = result;
                            if (expr = expr.replace(Expr.match[type], ""), !anyFound)
                                return [];
                            break
                        }
                    }
                if (expr === old)
                    if (null == anyFound)
                        Sizzle.error(expr);
                    else
                        break;
                old = expr
            }
            return curLoop
        }, Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg)
        };
        var getText = Sizzle.getText = function(elem) {
            var i, node, nodeType = elem.nodeType, ret = "";
            if (nodeType) {
                if (1 === nodeType || 9 === nodeType)
                    if ("string" == typeof elem.textContent)
                        return elem.textContent;
                    else if ("string" == typeof elem.innerText)
                        return elem.innerText.replace(rReturn, "");
                    else
                        for (elem = elem.firstChild; elem; elem = elem.nextSibling)
                            ret += getText(elem);
                else if (3 === nodeType || 4 === nodeType)
                    return elem.nodeValue
            } else
                for (i = 0; node = elem[i]; i++)
                    if (8 !== node.nodeType)
                        ret += getText(node);
            return ret
        }, Expr = Sizzle.selectors = {order: ["ID", "NAME", "TAG"],match: {ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch: {},attrMap: {"class": "className","for": "htmlFor"},attrHandle: {href: function(elem) {
                    return elem.getAttribute("href")
                },type: function(elem) {
                    return elem.getAttribute("type")
                }},relative: {"+": function(checkSet, part) {
                    var isPartStr = "string" == typeof part, isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;
                    if (isTag)
                        part = part.toLowerCase();
                    for (var i = 0, l = checkSet.length, elem; l > i; i++)
                        if (elem = checkSet[i]) {
                            for (; (elem = elem.previousSibling) && 1 !== elem.nodeType; )
                                ;
                            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || !1 : elem === part
                        }
                    if (isPartStrNotTag)
                        Sizzle.filter(part, checkSet, !0)
                },">": function(checkSet, part) {
                    var elem, isPartStr = "string" == typeof part, i = 0, l = checkSet.length;
                    if (isPartStr && !rNonWord.test(part)) {
                        for (part = part.toLowerCase(); l > i; i++)
                            if (elem = checkSet[i]) {
                                var parent = elem.parentNode;
                                checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : !1
                            }
                    } else {
                        for (; l > i; i++)
                            if (elem = checkSet[i])
                                checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                        if (isPartStr)
                            Sizzle.filter(part, checkSet, !0)
                    }
                },"": function(checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;
                    if ("string" == typeof part && !rNonWord.test(part))
                        part = part.toLowerCase(), nodeCheck = part, checkFn = dirNodeCheck;
                    checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML)
                },"~": function(checkSet, part, isXML) {
                    var nodeCheck, doneName = done++, checkFn = dirCheck;
                    if ("string" == typeof part && !rNonWord.test(part))
                        part = part.toLowerCase(), nodeCheck = part, checkFn = dirNodeCheck;
                    checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML)
                }},find: {ID: function(match, context, isXML) {
                    if ("undefined" != typeof context.getElementById && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m && m.parentNode ? [m] : []
                    }
                },NAME: function(match, context) {
                    if ("undefined" != typeof context.getElementsByName) {
                        for (var ret = [], results = context.getElementsByName(match[1]), i = 0, l = results.length; l > i; i++)
                            if (results[i].getAttribute("name") === match[1])
                                ret.push(results[i]);
                        return 0 === ret.length ? null : ret
                    }
                },TAG: function(match, context) {
                    if ("undefined" != typeof context.getElementsByTagName)
                        return context.getElementsByTagName(match[1]);
                    else
                        return void 0
                }},preFilter: {CLASS: function(match, curLoop, inplace, result, not, isXML) {
                    if (match = " " + match[1].replace(rBackslash, "") + " ", isXML)
                        return match;
                    for (var i = 0, elem; null != (elem = curLoop[i]); i++)
                        if (elem)
                            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
                                if (!inplace)
                                    result.push(elem)
                            } else if (inplace)
                                curLoop[i] = !1;
                    return !1
                },ID: function(match) {
                    return match[1].replace(rBackslash, "")
                },TAG: function(match, curLoop) {
                    return match[1].replace(rBackslash, "").toLowerCase()
                },CHILD: function(match) {
                    if ("nth" === match[1]) {
                        if (!match[2])
                            Sizzle.error(match[0]);
                        match[2] = match[2].replace(/^\+|\s*/g, "");
                        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec("even" === match[2] && "2n" || "odd" === match[2] && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                        match[2] = test[1] + (test[2] || 1) - 0, match[3] = test[3] - 0
                    } else if (match[2])
                        Sizzle.error(match[0]);
                    return match[0] = done++, match
                },ATTR: function(match, curLoop, inplace, result, not, isXML) {
                    var name = match[1] = match[1].replace(rBackslash, "");
                    if (!isXML && Expr.attrMap[name])
                        match[1] = Expr.attrMap[name];
                    if (match[4] = (match[4] || match[5] || "").replace(rBackslash, ""), "~=" === match[2])
                        match[4] = " " + match[4] + " ";
                    return match
                },PSEUDO: function(match, curLoop, inplace, result, not) {
                    if ("not" === match[1])
                        if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3]))
                            match[3] = Sizzle(match[3], null, null, curLoop);
                        else {
                            var ret = Sizzle.filter(match[3], curLoop, inplace, !0 ^ not);
                            if (!inplace)
                                result.push.apply(result, ret);
                            return !1
                        }
                    else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0]))
                        return !0;
                    return match
                },POS: function(match) {
                    return match.unshift(!0), match
                }},filters: {enabled: function(elem) {
                    return elem.disabled === !1 && "hidden" !== elem.type
                },disabled: function(elem) {
                    return elem.disabled === !0
                },checked: function(elem) {
                    return elem.checked === !0
                },selected: function(elem) {
                    if (elem.parentNode)
                        elem.parentNode.selectedIndex;
                    return elem.selected === !0
                },parent: function(elem) {
                    return !!elem.firstChild
                },empty: function(elem) {
                    return !elem.firstChild
                },has: function(elem, i, match) {
                    return !!Sizzle(match[3], elem).length
                },header: function(elem) {
                    return /h\d/i.test(elem.nodeName)
                },text: function(elem) {
                    var attr = elem.getAttribute("type"), type = elem.type;
                    return "input" === elem.nodeName.toLowerCase() && "text" === type && (attr === type || null === attr)
                },radio: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "radio" === elem.type
                },checkbox: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "checkbox" === elem.type
                },file: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "file" === elem.type
                },password: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "password" === elem.type
                },submit: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return ("input" === name || "button" === name) && "submit" === elem.type
                },image: function(elem) {
                    return "input" === elem.nodeName.toLowerCase() && "image" === elem.type
                },reset: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return ("input" === name || "button" === name) && "reset" === elem.type
                },button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return "input" === name && "button" === elem.type || "button" === name
                },input: function(elem) {
                    return /input|select|textarea|button/i.test(elem.nodeName)
                },focus: function(elem) {
                    return elem === elem.ownerDocument.activeElement
                }},setFilters: {first: function(elem, i) {
                    return 0 === i
                },last: function(elem, i, match, array) {
                    return i === array.length - 1
                },even: function(elem, i) {
                    return 0 === i % 2
                },odd: function(elem, i) {
                    return 1 === i % 2
                },lt: function(elem, i, match) {
                    return i < match[3] - 0
                },gt: function(elem, i, match) {
                    return i > match[3] - 0
                },nth: function(elem, i, match) {
                    return match[3] - 0 === i
                },eq: function(elem, i, match) {
                    return match[3] - 0 === i
                }},filter: {PSEUDO: function(elem, match, i, array) {
                    var name = match[1], filter = Expr.filters[name];
                    if (filter)
                        return filter(elem, i, match, array);
                    else if ("contains" === name)
                        return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;
                    else if ("not" === name) {
                        for (var not = match[3], j = 0, l = not.length; l > j; j++)
                            if (not[j] === elem)
                                return !1;
                        return !0
                    } else
                        Sizzle.error(name)
                },CHILD: function(elem, match) {
                    var first, last, doneName, parent, cache, count, diff, type = match[1], node = elem;
                    switch (type) {
                        case "only":
                        case "first":
                            for (; node = node.previousSibling; )
                                if (1 === node.nodeType)
                                    return !1;
                            if ("first" === type)
                                return !0;
                            node = elem;
                        case "last":
                            for (; node = node.nextSibling; )
                                if (1 === node.nodeType)
                                    return !1;
                            return !0;
                        case "nth":
                            if (first = match[2], last = match[3], 1 === first && 0 === last)
                                return !0;
                            if (doneName = match[0], parent = elem.parentNode, parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
                                for (count = 0, node = parent.firstChild; node; node = node.nextSibling)
                                    if (1 === node.nodeType)
                                        node.nodeIndex = ++count;
                                parent[expando] = doneName
                            }
                            if (diff = elem.nodeIndex - last, 0 === first)
                                return 0 === diff;
                            else
                                return 0 === diff % first && diff / first >= 0
                    }
                },ID: function(elem, match) {
                    return 1 === elem.nodeType && elem.getAttribute("id") === match
                },TAG: function(elem, match) {
                    return "*" === match && 1 === elem.nodeType || !!elem.nodeName && elem.nodeName.toLowerCase() === match
                },CLASS: function(elem, match) {
                    return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1
                },ATTR: function(elem, match) {
                    var name = match[1], result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : null != elem[name] ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];
                    return null == result ? "!=" === type : !type && Sizzle.attr ? null != result : "=" === type ? value === check : "*=" === type ? value.indexOf(check) >= 0 : "~=" === type ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== !1 : "!=" === type ? value !== check : "^=" === type ? 0 === value.indexOf(check) : "$=" === type ? value.substr(value.length - check.length) === check : "|=" === type ? value === check || value.substr(0, check.length + 1) === check + "-" : !1
                },POS: function(elem, match, i, array) {
                    var name = match[2], filter = Expr.setFilters[name];
                    if (filter)
                        return filter(elem, i, match, array);
                    else
                        return void 0
                }}}, origPOS = Expr.match.POS, fescape = function(all, num) {
            return "\\" + (num - 0 + 1)
        };
        for (var type in Expr.match)
            Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source), Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
        var makeArray = function(array, results) {
            if (array = Array.prototype.slice.call(array, 0), results)
                return results.push.apply(results, array), results;
            else
                return array
        };
        try {
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType
        } catch (e) {
            makeArray = function(array, results) {
                var i = 0, ret = results || [];
                if ("[object Array]" === toString.call(array))
                    Array.prototype.push.apply(ret, array);
                else if ("number" == typeof array.length)
                    for (var l = array.length; l > i; i++)
                        ret.push(array[i]);
                else
                    for (; array[i]; i++)
                        ret.push(array[i]);
                return ret
            }
        }
        var sortOrder, siblingCheck;
        if (document.documentElement.compareDocumentPosition)
            sortOrder = function(a, b) {
                if (a === b)
                    return hasDuplicate = !0, 0;
                if (!a.compareDocumentPosition || !b.compareDocumentPosition)
                    return a.compareDocumentPosition ? -1 : 1;
                else
                    return 4 & a.compareDocumentPosition(b) ? -1 : 1
            };
        else
            sortOrder = function(a, b) {
                if (a === b)
                    return hasDuplicate = !0, 0;
                else if (a.sourceIndex && b.sourceIndex)
                    return a.sourceIndex - b.sourceIndex;
                var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;
                if (aup === bup)
                    return siblingCheck(a, b);
                else if (!aup)
                    return -1;
                else if (!bup)
                    return 1;
                for (; cur; )
                    ap.unshift(cur), cur = cur.parentNode;
                for (cur = bup; cur; )
                    bp.unshift(cur), cur = cur.parentNode;
                al = ap.length, bl = bp.length;
                for (var i = 0; al > i && bl > i; i++)
                    if (ap[i] !== bp[i])
                        return siblingCheck(ap[i], bp[i]);
                return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1)
            }, siblingCheck = function(a, b, ret) {
                if (a === b)
                    return ret;
                for (var cur = a.nextSibling; cur; ) {
                    if (cur === b)
                        return -1;
                    cur = cur.nextSibling
                }
                return 1
            };
        if (function() {
            var form = document.createElement("div"), id = "script" + (new Date).getTime(), root = document.documentElement;
            if (form.innerHTML = "<a name='" + id + "'/>", root.insertBefore(form, root.firstChild), document.getElementById(id))
                Expr.find.ID = function(match, context, isXML) {
                    if ("undefined" != typeof context.getElementById && !isXML) {
                        var m = context.getElementById(match[1]);
                        return m ? m.id === match[1] || "undefined" != typeof m.getAttributeNode && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : []
                    }
                }, Expr.filter.ID = function(elem, match) {
                    var node = "undefined" != typeof elem.getAttributeNode && elem.getAttributeNode("id");
                    return 1 === elem.nodeType && node && node.nodeValue === match
                };
            root.removeChild(form), root = form = null
        }(), function() {
            var div = document.createElement("div");
            if (div.appendChild(document.createComment("")), div.getElementsByTagName("*").length > 0)
                Expr.find.TAG = function(match, context) {
                    var results = context.getElementsByTagName(match[1]);
                    if ("*" === match[1]) {
                        for (var tmp = [], i = 0; results[i]; i++)
                            if (1 === results[i].nodeType)
                                tmp.push(results[i]);
                        results = tmp
                    }
                    return results
                };
            if (div.innerHTML = "<a href='#'></a>", div.firstChild && "undefined" != typeof div.firstChild.getAttribute && "#" !== div.firstChild.getAttribute("href"))
                Expr.attrHandle.href = function(elem) {
                    return elem.getAttribute("href", 2)
                };
            div = null
        }(), document.querySelectorAll)
            !function() {
                var oldSizzle = Sizzle, div = document.createElement("div"), id = "__sizzle__";
                if (div.innerHTML = "<p class='TEST'></p>", !div.querySelectorAll || 0 !== div.querySelectorAll(".TEST").length) {
                    Sizzle = function(query, context, extra, seed) {
                        if (context = context || document, !seed && !Sizzle.isXML(context)) {
                            var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
                            if (match && (1 === context.nodeType || 9 === context.nodeType))
                                if (match[1])
                                    return makeArray(context.getElementsByTagName(query), extra);
                                else if (match[2] && Expr.find.CLASS && context.getElementsByClassName)
                                    return makeArray(context.getElementsByClassName(match[2]), extra);
                            if (9 === context.nodeType) {
                                if ("body" === query && context.body)
                                    return makeArray([context.body], extra);
                                else if (match && match[3]) {
                                    var elem = context.getElementById(match[3]);
                                    if (elem && elem.parentNode) {
                                        if (elem.id === match[3])
                                            return makeArray([elem], extra)
                                    } else
                                        return makeArray([], extra)
                                }
                                try {
                                    return makeArray(context.querySelectorAll(query), extra)
                                } catch (qsaError) {
                                }
                            } else if (1 === context.nodeType && "object" !== context.nodeName.toLowerCase()) {
                                var oldContext = context, old = context.getAttribute("id"), nid = old || id, hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(query);
                                if (!old)
                                    context.setAttribute("id", nid);
                                else
                                    nid = nid.replace(/'/g, "\\$&");
                                if (relativeHierarchySelector && hasParent)
                                    context = context.parentNode;
                                try {
                                    if (!relativeHierarchySelector || hasParent)
                                        return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra)
                                } catch (pseudoError) {
                                }finally {
                                    if (!old)
                                        oldContext.removeAttribute("id")
                                }
                            }
                        }
                        return oldSizzle(query, context, extra, seed)
                    };
                    for (var prop in oldSizzle)
                        Sizzle[prop] = oldSizzle[prop];
                    div = null
                }
            }();
        if (function() {
            var html = document.documentElement, matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;
            if (matches) {
                var disconnectedMatch = !matches.call(document.createElement("div"), "div"), pseudoWorks = !1;
                try {
                    matches.call(document.documentElement, "[test!='']:sizzle")
                } catch (pseudoError) {
                    pseudoWorks = !0
                }
                Sizzle.matchesSelector = function(node, expr) {
                    if (expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']"), !Sizzle.isXML(node))
                        try {
                            if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
                                var ret = matches.call(node, expr);
                                if (ret || !disconnectedMatch || node.document && 11 !== node.document.nodeType)
                                    return ret
                            }
                        } catch (e) {
                        }
                    return Sizzle(expr, null, null, [node]).length > 0
                }
            }
        }(), function() {
            var div = document.createElement("div");
            if (div.innerHTML = "<div class='test e'></div><div class='test'></div>", div.getElementsByClassName && 0 !== div.getElementsByClassName("e").length)
                if (div.lastChild.className = "e", 1 !== div.getElementsByClassName("e").length)
                    Expr.order.splice(1, 0, "CLASS"), Expr.find.CLASS = function(match, context, isXML) {
                        if ("undefined" != typeof context.getElementsByClassName && !isXML)
                            return context.getElementsByClassName(match[1]);
                        else
                            return void 0
                    }, div = null
        }(), document.documentElement.contains)
            Sizzle.contains = function(a, b) {
                return a !== b && (a.contains ? a.contains(b) : !0)
            };
        else if (document.documentElement.compareDocumentPosition)
            Sizzle.contains = function(a, b) {
                return !!(16 & a.compareDocumentPosition(b))
            };
        else
            Sizzle.contains = function() {
                return !1
            };
        Sizzle.isXML = function(elem) {
            var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
            return documentElement ? "HTML" !== documentElement.nodeName : !1
        };
        var posProcess = function(selector, context, seed) {
            for (var match, tmpSet = [], later = "", root = context.nodeType ? [context] : context; match = Expr.match.PSEUDO.exec(selector); )
                later += match[0], selector = selector.replace(Expr.match.PSEUDO, "");
            selector = Expr.relative[selector] ? selector + "*" : selector;
            for (var i = 0, l = root.length; l > i; i++)
                Sizzle(selector, root[i], tmpSet, seed);
            return Sizzle.filter(later, tmpSet)
        };
        Sizzle.attr = jQuery.attr, Sizzle.selectors.attrMap = {}, jQuery.find = Sizzle, jQuery.expr = Sizzle.selectors, jQuery.expr[":"] = jQuery.expr.filters, jQuery.unique = Sizzle.uniqueSort, jQuery.text = Sizzle.getText, jQuery.isXMLDoc = Sizzle.isXML, jQuery.contains = Sizzle.contains
    }();
    var runtil = /Until$/, rparentsprev = /^(?:parents|prevUntil|prevAll)/, rmultiselector = /,/, isSimple = /^.[^:#\[\.,]*$/, slice = Array.prototype.slice, POS = jQuery.expr.match.POS, guaranteedUnique = {children: !0,contents: !0,next: !0,prev: !0};
    jQuery.fn.extend({find: function(selector) {
            var self = this, i, l;
            if ("string" != typeof selector)
                return jQuery(selector).filter(function() {
                    for (i = 0, l = self.length; l > i; i++)
                        if (jQuery.contains(self[i], this))
                            return !0
                });
            var ret = this.pushStack("", "find", selector), length, n, r;
            for (i = 0, l = this.length; l > i; i++)
                if (length = ret.length, jQuery.find(selector, this[i], ret), i > 0)
                    for (n = length; n < ret.length; n++)
                        for (r = 0; length > r; r++)
                            if (ret[r] === ret[n]) {
                                ret.splice(n--, 1);
                                break
                            }
            return ret
        },has: function(target) {
            var targets = jQuery(target);
            return this.filter(function() {
                for (var i = 0, l = targets.length; l > i; i++)
                    if (jQuery.contains(this, targets[i]))
                        return !0
            })
        },not: function(selector) {
            return this.pushStack(winnow(this, selector, !1), "not", selector)
        },filter: function(selector) {
            return this.pushStack(winnow(this, selector, !0), "filter", selector)
        },is: function(selector) {
            return !!selector && ("string" == typeof selector ? POS.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0)
        },closest: function(selectors, context) {
            var ret = [], i, l, cur = this[0];
            if (jQuery.isArray(selectors)) {
                for (var level = 1; cur && cur.ownerDocument && cur !== context; ) {
                    for (i = 0; i < selectors.length; i++)
                        if (jQuery(cur).is(selectors[i]))
                            ret.push({selector: selectors[i],elem: cur,level: level});
                    cur = cur.parentNode, level++
                }
                return ret
            }
            var pos = POS.test(selectors) || "string" != typeof selectors ? jQuery(selectors, context || this.context) : 0;
            for (i = 0, l = this.length; l > i; i++)
                for (cur = this[i]; cur; )
                    if (pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
                        ret.push(cur);
                        break
                    } else if (cur = cur.parentNode, !cur || !cur.ownerDocument || cur === context || 11 === cur.nodeType)
                        break;
            return ret = ret.length > 1 ? jQuery.unique(ret) : ret, this.pushStack(ret, "closest", selectors)
        },index: function(elem) {
            if (!elem)
                return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if ("string" == typeof elem)
                return jQuery.inArray(this[0], jQuery(elem));
            else
                return jQuery.inArray(elem.jquery ? elem[0] : elem, this)
        },add: function(selector, context) {
            var set = "string" == typeof selector ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), all = jQuery.merge(this.get(), set);
            return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all))
        },andSelf: function() {
            return this.add(this.prevObject)
        }}), jQuery.each({parent: function(elem) {
            var parent = elem.parentNode;
            return parent && 11 !== parent.nodeType ? parent : null
        },parents: function(elem) {
            return jQuery.dir(elem, "parentNode")
        },parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until)
        },next: function(elem) {
            return jQuery.nth(elem, 2, "nextSibling")
        },prev: function(elem) {
            return jQuery.nth(elem, 2, "previousSibling")
        },nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling")
        },prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling")
        },nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until)
        },prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until)
        },siblings: function(elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem)
        },children: function(elem) {
            return jQuery.sibling(elem.firstChild)
        },contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes)
        }}, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var ret = jQuery.map(this, fn, until);
            if (!runtil.test(name))
                selector = until;
            if (selector && "string" == typeof selector)
                ret = jQuery.filter(selector, ret);
            if (ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret, (this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name))
                ret = ret.reverse();
            return this.pushStack(ret, name, slice.call(arguments).join(","))
        }
    }), jQuery.extend({filter: function(expr, elems, not) {
            if (not)
                expr = ":not(" + expr + ")";
            return 1 === elems.length ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems)
        },dir: function(elem, dir, until) {
            for (var matched = [], cur = elem[dir]; cur && 9 !== cur.nodeType && (until === undefined || 1 !== cur.nodeType || !jQuery(cur).is(until)); ) {
                if (1 === cur.nodeType)
                    matched.push(cur);
                cur = cur[dir]
            }
            return matched
        },nth: function(cur, result, dir, elem) {
            result = result || 1;
            for (var num = 0; cur && (1 !== cur.nodeType || ++num !== result); cur = cur[dir])
                ;
            return cur
        },sibling: function(n, elem) {
            for (var r = []; n; n = n.nextSibling)
                if (1 === n.nodeType && n !== elem)
                    r.push(n);
            return r
        }});
    var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"), rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/, wrapMap = {option: [1, "<select multiple='multiple'>", "</select>"],legend: [1, "<fieldset>", "</fieldset>"],thead: [1, "<table>", "</table>"],tr: [2, "<table><tbody>", "</tbody></table>"],td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],area: [1, "<map>", "</map>"],_default: [0, "", ""]}, safeFragment = createSafeFragment(document);
    if (wrapMap.optgroup = wrapMap.option, wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead, wrapMap.th = wrapMap.td, !jQuery.support.htmlSerialize)
        wrapMap._default = [1, "div<div>", "</div>"];
    jQuery.fn.extend({text: function(text) {
            if (jQuery.isFunction(text))
                return this.each(function(i) {
                    var self = jQuery(this);
                    self.text(text.call(this, i, self.text()))
                });
            if ("object" != typeof text && text !== undefined)
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
            else
                return jQuery.text(this)
        },wrapAll: function(html) {
            if (jQuery.isFunction(html))
                return this.each(function(i) {
                    jQuery(this).wrapAll(html.call(this, i))
                });
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(!0);
                if (this[0].parentNode)
                    wrap.insertBefore(this[0]);
                wrap.map(function() {
                    for (var elem = this; elem.firstChild && 1 === elem.firstChild.nodeType; )
                        elem = elem.firstChild;
                    return elem
                }).append(this)
            }
            return this
        },wrapInner: function(html) {
            if (jQuery.isFunction(html))
                return this.each(function(i) {
                    jQuery(this).wrapInner(html.call(this, i))
                });
            else
                return this.each(function() {
                    var self = jQuery(this), contents = self.contents();
                    if (contents.length)
                        contents.wrapAll(html);
                    else
                        self.append(html)
                })
        },wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html)
            })
        },unwrap: function() {
            return this.parent().each(function() {
                if (!jQuery.nodeName(this, "body"))
                    jQuery(this).replaceWith(this.childNodes)
            }).end()
        },append: function() {
            return this.domManip(arguments, !0, function(elem) {
                if (1 === this.nodeType)
                    this.appendChild(elem)
            })
        },prepend: function() {
            return this.domManip(arguments, !0, function(elem) {
                if (1 === this.nodeType)
                    this.insertBefore(elem, this.firstChild)
            })
        },before: function() {
            if (this[0] && this[0].parentNode)
                return this.domManip(arguments, !1, function(elem) {
                    this.parentNode.insertBefore(elem, this)
                });
            else if (arguments.length) {
                var set = jQuery.clean(arguments);
                return set.push.apply(set, this.toArray()), this.pushStack(set, "before", arguments)
            }
        },after: function() {
            if (this[0] && this[0].parentNode)
                return this.domManip(arguments, !1, function(elem) {
                    this.parentNode.insertBefore(elem, this.nextSibling)
                });
            else if (arguments.length) {
                var set = this.pushStack(this, "after", arguments);
                return set.push.apply(set, jQuery.clean(arguments)), set
            }
        },remove: function(selector, keepData) {
            for (var i = 0, elem; null != (elem = this[i]); i++)
                if (!selector || jQuery.filter(selector, [elem]).length) {
                    if (!keepData && 1 === elem.nodeType)
                        jQuery.cleanData(elem.getElementsByTagName("*")), jQuery.cleanData([elem]);
                    if (elem.parentNode)
                        elem.parentNode.removeChild(elem)
                }
            return this
        },empty: function() {
            for (var i = 0, elem; null != (elem = this[i]); i++) {
                if (1 === elem.nodeType)
                    jQuery.cleanData(elem.getElementsByTagName("*"));
                for (; elem.firstChild; )
                    elem.removeChild(elem.firstChild)
            }
            return this
        },clone: function(dataAndEvents, deepDataAndEvents) {
            return dataAndEvents = null == dataAndEvents ? !1 : dataAndEvents, deepDataAndEvents = null == deepDataAndEvents ? dataAndEvents : deepDataAndEvents, this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents)
            })
        },html: function(value) {
            if (value === undefined)
                return this[0] && 1 === this[0].nodeType ? this[0].innerHTML.replace(rinlinejQuery, "") : null;
            else if (!("string" != typeof value || rnoInnerhtml.test(value) || !jQuery.support.leadingWhitespace && rleadingWhitespace.test(value) || wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()])) {
                value = value.replace(rxhtmlTag, "<$1></$2>");
                try {
                    for (var i = 0, l = this.length; l > i; i++)
                        if (1 === this[i].nodeType)
                            jQuery.cleanData(this[i].getElementsByTagName("*")), this[i].innerHTML = value
                } catch (e) {
                    this.empty().append(value)
                }
            } else if (jQuery.isFunction(value))
                this.each(function(i) {
                    var self = jQuery(this);
                    self.html(value.call(this, i, self.html()))
                });
            else
                this.empty().append(value);
            return this
        },replaceWith: function(value) {
            if (this[0] && this[0].parentNode) {
                if (jQuery.isFunction(value))
                    return this.each(function(i) {
                        var self = jQuery(this), old = self.html();
                        self.replaceWith(value.call(this, i, old))
                    });
                if ("string" != typeof value)
                    value = jQuery(value).detach();
                return this.each(function() {
                    var next = this.nextSibling, parent = this.parentNode;
                    if (jQuery(this).remove(), next)
                        jQuery(next).before(value);
                    else
                        jQuery(parent).append(value)
                })
            } else
                return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this
        },detach: function(selector) {
            return this.remove(selector, !0)
        },domManip: function(args, table, callback) {
            var results, first, fragment, parent, value = args[0], scripts = [];
            if (!jQuery.support.checkClone && 3 === arguments.length && "string" == typeof value && rchecked.test(value))
                return this.each(function() {
                    jQuery(this).domManip(args, table, callback, !0)
                });
            if (jQuery.isFunction(value))
                return this.each(function(i) {
                    var self = jQuery(this);
                    args[0] = value.call(this, i, table ? self.html() : undefined), self.domManip(args, table, callback)
                });
            if (this[0]) {
                if (parent = value && value.parentNode, jQuery.support.parentNode && parent && 11 === parent.nodeType && parent.childNodes.length === this.length)
                    results = {fragment: parent};
                else
                    results = jQuery.buildFragment(args, this, scripts);
                if (fragment = results.fragment, 1 === fragment.childNodes.length)
                    first = fragment = fragment.firstChild;
                else
                    first = fragment.firstChild;
                if (first) {
                    table = table && jQuery.nodeName(first, "tr");
                    for (var i = 0, l = this.length, lastIndex = l - 1; l > i; i++)
                        callback.call(table ? root(this[i], first) : this[i], results.cacheable || l > 1 && lastIndex > i ? jQuery.clone(fragment, !0, !0) : fragment)
                }
                if (scripts.length)
                    jQuery.each(scripts, evalScript)
            }
            return this
        }}), jQuery.buildFragment = function(args, nodes, scripts) {
        var fragment, cacheable, cacheresults, doc, first = args[0];
        if (nodes && nodes[0])
            doc = nodes[0].ownerDocument || nodes[0];
        if (!doc.createDocumentFragment)
            doc = document;
        if (1 === args.length && "string" == typeof first && first.length < 512 && doc === document && "<" === first.charAt(0) && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first)))
            if (cacheable = !0, cacheresults = jQuery.fragments[first], cacheresults && 1 !== cacheresults)
                fragment = cacheresults;
        if (!fragment)
            fragment = doc.createDocumentFragment(), jQuery.clean(args, doc, fragment, scripts);
        if (cacheable)
            jQuery.fragments[first] = cacheresults ? fragment : 1;
        return {fragment: fragment,cacheable: cacheable}
    }, jQuery.fragments = {}, jQuery.each({appendTo: "append",prependTo: "prepend",insertBefore: "before",insertAfter: "after",replaceAll: "replaceWith"}, function(name, original) {
        jQuery.fn[name] = function(selector) {
            var ret = [], insert = jQuery(selector), parent = 1 === this.length && this[0].parentNode;
            if (parent && 11 === parent.nodeType && 1 === parent.childNodes.length && 1 === insert.length)
                return insert[original](this[0]), this;
            else {
                for (var i = 0, l = insert.length; l > i; i++) {
                    var elems = (i > 0 ? this.clone(!0) : this).get();
                    jQuery(insert[i])[original](elems), ret = ret.concat(elems)
                }
                return this.pushStack(ret, name, insert.selector)
            }
        }
    }), jQuery.extend({clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var srcElements, destElements, i, clone = jQuery.support.html5Clone || !rnoshimcache.test("<" + elem.nodeName) ? elem.cloneNode(!0) : shimCloneNode(elem);
            if (!(jQuery.support.noCloneEvent && jQuery.support.noCloneChecked || 1 !== elem.nodeType && 11 !== elem.nodeType || jQuery.isXMLDoc(elem)))
                for (cloneFixAttributes(elem, clone), srcElements = getAll(elem), destElements = getAll(clone), i = 0; srcElements[i]; ++i)
                    if (destElements[i])
                        cloneFixAttributes(srcElements[i], destElements[i]);
            if (dataAndEvents)
                if (cloneCopyEvent(elem, clone), deepDataAndEvents)
                    for (srcElements = getAll(elem), destElements = getAll(clone), i = 0; srcElements[i]; ++i)
                        cloneCopyEvent(srcElements[i], destElements[i]);
            return srcElements = destElements = null, clone
        },clean: function(elems, context, fragment, scripts) {
            var checkScriptType;
            if (context = context || document, "undefined" == typeof context.createElement)
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
            for (var ret = [], j, i = 0, elem; null != (elem = elems[i]); i++) {
                if ("number" == typeof elem)
                    elem += "";
                if (elem) {
                    if ("string" == typeof elem)
                        if (!rhtml.test(elem))
                            elem = context.createTextNode(elem);
                        else {
                            elem = elem.replace(rxhtmlTag, "<$1></$2>");
                            var tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, depth = wrap[0], div = context.createElement("div");
                            if (context === document)
                                safeFragment.appendChild(div);
                            else
                                createSafeFragment(context).appendChild(div);
                            for (div.innerHTML = wrap[1] + elem + wrap[2]; depth--; )
                                div = div.lastChild;
                            if (!jQuery.support.tbody) {
                                var hasBody = rtbody.test(elem), tbody = "table" === tag && !hasBody ? div.firstChild && div.firstChild.childNodes : "<table>" === wrap[1] && !hasBody ? div.childNodes : [];
                                for (j = tbody.length - 1; j >= 0; --j)
                                    if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length)
                                        tbody[j].parentNode.removeChild(tbody[j])
                            }
                            if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem))
                                div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
                            elem = div.childNodes
                        }
                    var len;
                    if (!jQuery.support.appendChecked)
                        if (elem[0] && "number" == typeof (len = elem.length))
                            for (j = 0; len > j; j++)
                                findInputs(elem[j]);
                        else
                            findInputs(elem);
                    if (elem.nodeType)
                        ret.push(elem);
                    else
                        ret = jQuery.merge(ret, elem)
                } else
                    ;
            }
            if (fragment)
                for (checkScriptType = function(elem) {
                    return !elem.type || rscriptType.test(elem.type)
                }, i = 0; ret[i]; i++)
                    if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || "text/javascript" === ret[i].type.toLowerCase()))
                        scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
                    else {
                        if (1 === ret[i].nodeType) {
                            var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);
                            ret.splice.apply(ret, [i + 1, 0].concat(jsTags))
                        }
                        fragment.appendChild(ret[i])
                    }
            return ret
        },cleanData: function(elems) {
            for (var data, id, cache = jQuery.cache, special = jQuery.event.special, deleteExpando = jQuery.support.deleteExpando, i = 0, elem; null != (elem = elems[i]); i++)
                if (!elem.nodeName || !jQuery.noData[elem.nodeName.toLowerCase()]) {
                    if (id = elem[jQuery.expando]) {
                        if (data = cache[id], data && data.events) {
                            for (var type in data.events)
                                if (special[type])
                                    jQuery.event.remove(elem, type);
                                else
                                    jQuery.removeEvent(elem, type, data.handle);
                            if (data.handle)
                                data.handle.elem = null
                        }
                        if (deleteExpando)
                            delete elem[jQuery.expando];
                        else if (elem.removeAttribute)
                            elem.removeAttribute(jQuery.expando);
                        delete cache[id]
                    }
                } else
                    ;
        }});
    var ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/, rupper = /([A-Z]|^ms)/g, rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/, rrelNum = /^([\-+])=([\-+.\de]+)/, cssShow = {position: "absolute",visibility: "hidden",display: "block"}, cssWidth = ["Left", "Right"], cssHeight = ["Top", "Bottom"], curCSS, getComputedStyle, currentStyle;
    if (jQuery.fn.css = function(name, value) {
        if (2 === arguments.length && value === undefined)
            return this;
        else
            return jQuery.access(this, name, value, !0, function(elem, name, value) {
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name)
            })
    }, jQuery.extend({cssHooks: {opacity: {get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity", "opacity");
                        return "" === ret ? "1" : ret
                    } else
                        return elem.style.opacity
                }}},cssNumber: {fillOpacity: !0,fontWeight: !0,lineHeight: !0,opacity: !0,orphans: !0,widows: !0,zIndex: !0,zoom: !0},cssProps: {"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"},style: function(elem, name, value, extra) {
            if (elem && 3 !== elem.nodeType && 8 !== elem.nodeType && elem.style) {
                var ret, type, origName = jQuery.camelCase(name), style = elem.style, hooks = jQuery.cssHooks[origName];
                if (name = jQuery.cssProps[origName] || origName, value !== undefined) {
                    if (type = typeof value, "string" === type && (ret = rrelNum.exec(value)))
                        value = +(ret[1] + 1) * +ret[2] + parseFloat(jQuery.css(elem, name)), type = "number";
                    if (null == value || "number" === type && isNaN(value))
                        return;
                    if ("number" === type && !jQuery.cssNumber[origName])
                        value += "px";
                    if (!(hooks && "set" in hooks && (value = hooks.set(elem, value)) === undefined))
                        try {
                            style[name] = value
                        } catch (e) {
                        }
                } else if (hooks && "get" in hooks && (ret = hooks.get(elem, !1, extra)) !== undefined)
                    return ret;
                else
                    return style[name]
            }
        },css: function(elem, name, extra) {
            var ret, hooks;
            if (name = jQuery.camelCase(name), hooks = jQuery.cssHooks[name], name = jQuery.cssProps[name] || name, "cssFloat" === name)
                name = "float";
            if (hooks && "get" in hooks && (ret = hooks.get(elem, !0, extra)) !== undefined)
                return ret;
            else if (curCSS)
                return curCSS(elem, name)
        },swap: function(elem, options, callback) {
            var old = {};
            for (var name in options)
                old[name] = elem.style[name], elem.style[name] = options[name];
            callback.call(elem);
            for (name in options)
                elem.style[name] = old[name]
        }}), jQuery.curCSS = jQuery.css, jQuery.each(["height", "width"], function(i, name) {
        jQuery.cssHooks[name] = {get: function(elem, computed, extra) {
                var val;
                if (computed) {
                    if (0 !== elem.offsetWidth)
                        return getWH(elem, name, extra);
                    else
                        jQuery.swap(elem, cssShow, function() {
                            val = getWH(elem, name, extra)
                        });
                    return val
                }
            },set: function(elem, value) {
                if (rnumpx.test(value)) {
                    if (value = parseFloat(value), value >= 0)
                        return value + "px"
                } else
                    return value
            }}
    }), !jQuery.support.opacity)
        jQuery.cssHooks.opacity = {get: function(elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : computed ? "1" : ""
            },set: function(elem, value) {
                var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + 100 * value + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
                if (style.zoom = 1, value >= 1 && "" === jQuery.trim(filter.replace(ralpha, "")) && style.removeAttribute)
                    if (style.removeAttribute("filter"), currentStyle && !currentStyle.filter)
                        return;
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity
            }};
    if (jQuery(function() {
        if (!jQuery.support.reliableMarginRight)
            jQuery.cssHooks.marginRight = {get: function(elem, computed) {
                    var ret;
                    return jQuery.swap(elem, {display: "inline-block"}, function() {
                        if (computed)
                            ret = curCSS(elem, "margin-right", "marginRight");
                        else
                            ret = elem.style.marginRight
                    }), ret
                }}
    }), document.defaultView && document.defaultView.getComputedStyle)
        getComputedStyle = function(elem, name) {
            var ret, defaultView, computedStyle;
            if (name = name.replace(rupper, "-$1").toLowerCase(), (defaultView = elem.ownerDocument.defaultView) && (computedStyle = defaultView.getComputedStyle(elem, null)))
                if (ret = computedStyle.getPropertyValue(name), "" === ret && !jQuery.contains(elem.ownerDocument.documentElement, elem))
                    ret = jQuery.style(elem, name);
            return ret
        };
    if (document.documentElement.currentStyle)
        currentStyle = function(elem, name) {
            var left, rsLeft, uncomputed, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;
            if (null === ret && style && (uncomputed = style[name]))
                ret = uncomputed;
            if (!rnumpx.test(ret) && rnum.test(ret)) {
                if (left = style.left, rsLeft = elem.runtimeStyle && elem.runtimeStyle.left)
                    elem.runtimeStyle.left = elem.currentStyle.left;
                if (style.left = "fontSize" === name ? "1em" : ret || 0, ret = style.pixelLeft + "px", style.left = left, rsLeft)
                    elem.runtimeStyle.left = rsLeft
            }
            return "" === ret ? "auto" : ret
        };
    if (curCSS = getComputedStyle || currentStyle, jQuery.expr && jQuery.expr.filters)
        jQuery.expr.filters.hidden = function(elem) {
            var width = elem.offsetWidth, height = elem.offsetHeight;
            return 0 === width && 0 === height || !jQuery.support.reliableHiddenOffsets && "none" === (elem.style && elem.style.display || jQuery.css(elem, "display"))
        }, jQuery.expr.filters.visible = function(elem) {
            return !jQuery.expr.filters.hidden(elem)
        };
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rselectTextarea = /^(?:select|textarea)/i, rspacesAjax = /\s+/, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/, _load = jQuery.fn.load, prefilters = {}, transports = {}, ajaxLocation, ajaxLocParts, allTypes = ["*/"] + ["*"];
    try {
        ajaxLocation = location.href
    } catch (e) {
        ajaxLocation = document.createElement("a"), ajaxLocation.href = "", ajaxLocation = ajaxLocation.href
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [], jQuery.fn.extend({load: function(url, params, callback) {
            if ("string" != typeof url && _load)
                return _load.apply(this, arguments);
            else if (!this.length)
                return this;
            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off)
            }
            var type = "GET";
            if (params)
                if (jQuery.isFunction(params))
                    callback = params, params = undefined;
                else if ("object" == typeof params)
                    params = jQuery.param(params, jQuery.ajaxSettings.traditional), type = "POST";
            var self = this;
            return jQuery.ajax({url: url,type: type,dataType: "html",data: params,complete: function(jqXHR, status, responseText) {
                    if (responseText = jqXHR.responseText, jqXHR.isResolved())
                        jqXHR.done(function(r) {
                            responseText = r
                        }), self.html(selector ? jQuery("<div>").append(responseText.replace(rscript, "")).find(selector) : responseText);
                    if (callback)
                        self.each(callback, [responseText, status, jqXHR])
                }}), this
        },serialize: function() {
            return jQuery.param(this.serializeArray())
        },serializeArray: function() {
            return this.map(function() {
                return this.elements ? jQuery.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type))
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return null == val ? null : jQuery.isArray(val) ? jQuery.map(val, function(val, i) {
                    return {name: elem.name,value: val.replace(rCRLF, "\r\n")}
                }) : {name: elem.name,value: val.replace(rCRLF, "\r\n")}
            }).get()
        }}), jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
        jQuery.fn[o] = function(f) {
            return this.on(o, f)
        }
    }), jQuery.each(["get", "post"], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            if (jQuery.isFunction(data))
                type = type || callback, callback = data, data = undefined;
            return jQuery.ajax({type: method,url: url,data: data,success: callback,dataType: type})
        }
    }), jQuery.extend({getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script")
        },getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json")
        },ajaxSetup: function(target, settings) {
            if (settings)
                ajaxExtend(target, jQuery.ajaxSettings);
            else
                settings = target, target = jQuery.ajaxSettings;
            return ajaxExtend(target, settings), target
        },ajaxSettings: {url: ajaxLocation,isLocal: rlocalProtocol.test(ajaxLocParts[1]),global: !0,type: "GET",contentType: "application/x-www-form-urlencoded",processData: !0,async: !0,accepts: {xml: "application/xml, text/xml",html: "text/html",text: "text/plain",json: "application/json, text/javascript","*": allTypes},contents: {xml: /xml/,html: /html/,json: /json/},responseFields: {xml: "responseXML",text: "responseText"},converters: {"* text": window.String,"text html": !0,"text json": jQuery.parseJSON,"text xml": jQuery.parseXML},flatOptions: {context: !0,url: !0}},ajaxPrefilter: addToPrefiltersOrTransports(prefilters),ajaxTransport: addToPrefiltersOrTransports(transports),ajax: function(url, options) {
            function done(status, nativeStatusText, responses, headers) {
                if (2 !== state) {
                    if (state = 2, timeoutTimer)
                        clearTimeout(timeoutTimer);
                    transport = undefined, responseHeadersString = headers || "", jqXHR.readyState = status > 0 ? 4 : 0;
                    var isSuccess, success, error, statusText = nativeStatusText, response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined, lastModified, etag;
                    if (status >= 200 && 300 > status || 304 === status) {
                        if (s.ifModified) {
                            if (lastModified = jqXHR.getResponseHeader("Last-Modified"))
                                jQuery.lastModified[ifModifiedKey] = lastModified;
                            if (etag = jqXHR.getResponseHeader("Etag"))
                                jQuery.etag[ifModifiedKey] = etag
                        }
                        if (304 === status)
                            statusText = "notmodified", isSuccess = !0;
                        else
                            try {
                                success = ajaxConvert(s, response), statusText = "success", isSuccess = !0
                            } catch (e) {
                                statusText = "parsererror", error = e
                            }
                    } else if (error = statusText, !statusText || status)
                        if (statusText = "error", 0 > status)
                            status = 0;
                    if (jqXHR.status = status, jqXHR.statusText = "" + (nativeStatusText || statusText), isSuccess)
                        deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
                    else
                        deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
                    if (jqXHR.statusCode(statusCode), statusCode = undefined, fireGlobals)
                        globalEventContext.trigger("ajax" + (isSuccess ? "Success" : "Error"), [jqXHR, s, isSuccess ? success : error]);
                    if (completeDeferred.fireWith(callbackContext, [jqXHR, statusText]), fireGlobals)
                        if (globalEventContext.trigger("ajaxComplete", [jqXHR, s]), !--jQuery.active)
                            jQuery.event.trigger("ajaxStop")
                }
            }
            if ("object" == typeof url)
                options = url, url = undefined;
            options = options || {};
            var s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, ifModifiedKey, requestHeaders = {}, requestHeadersNames = {}, responseHeadersString, responseHeaders, transport, timeoutTimer, parts, state = 0, fireGlobals, i, jqXHR = {readyState: 0,setRequestHeader: function(name, value) {
                    if (!state) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[lname] = requestHeadersNames[lname] || name, requestHeaders[name] = value
                    }
                    return this
                },getAllResponseHeaders: function() {
                    return 2 === state ? responseHeadersString : null
                },getResponseHeader: function(key) {
                    var match;
                    if (2 === state) {
                        if (!responseHeaders)
                            for (responseHeaders = {}; match = rheaders.exec(responseHeadersString); )
                                responseHeaders[match[1].toLowerCase()] = match[2];
                        match = responseHeaders[key.toLowerCase()]
                    }
                    return match === undefined ? null : match
                },overrideMimeType: function(type) {
                    if (!state)
                        s.mimeType = type;
                    return this
                },abort: function(statusText) {
                    if (statusText = statusText || "abort", transport)
                        transport.abort(statusText);
                    return done(0, statusText), this
                }};
            if (deferred.promise(jqXHR), jqXHR.success = jqXHR.done, jqXHR.error = jqXHR.fail, jqXHR.complete = completeDeferred.add, jqXHR.statusCode = function(map) {
                if (map) {
                    var tmp;
                    if (2 > state)
                        for (tmp in map)
                            statusCode[tmp] = [statusCode[tmp], map[tmp]];
                    else
                        tmp = map[jqXHR.status], jqXHR.then(tmp, tmp)
                }
                return this
            }, s.url = ((url || s.url) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//"), s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax), null == s.crossDomain)
                parts = rurl.exec(s.url.toLowerCase()), s.crossDomain = !(!parts || parts[1] == ajaxLocParts[1] && parts[2] == ajaxLocParts[2] && (parts[3] || ("http:" === parts[1] ? 80 : 443)) == (ajaxLocParts[3] || ("http:" === ajaxLocParts[1] ? 80 : 443)));
            if (s.data && s.processData && "string" != typeof s.data)
                s.data = jQuery.param(s.data, s.traditional);
            if (inspectPrefiltersOrTransports(prefilters, s, options, jqXHR), 2 === state)
                return !1;
            if (fireGlobals = s.global, s.type = s.type.toUpperCase(), s.hasContent = !rnoContent.test(s.type), fireGlobals && 0 === jQuery.active++)
                jQuery.event.trigger("ajaxStart");
            if (!s.hasContent) {
                if (s.data)
                    s.url += (rquery.test(s.url) ? "&" : "?") + s.data, delete s.data;
                if (ifModifiedKey = s.url, s.cache === !1) {
                    var ts = jQuery.now(), ret = s.url.replace(rts, "$1_=" + ts);
                    s.url = ret + (ret === s.url ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "")
                }
            }
            if (s.data && s.hasContent && s.contentType !== !1 || options.contentType)
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            if (s.ifModified) {
                if (ifModifiedKey = ifModifiedKey || s.url, jQuery.lastModified[ifModifiedKey])
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
                if (jQuery.etag[ifModifiedKey])
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey])
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + ("*" !== s.dataTypes[0] ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers)
                jqXHR.setRequestHeader(i, s.headers[i]);
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === !1 || 2 === state))
                return jqXHR.abort(), !1;
            for (i in {success: 1,error: 1,complete: 1})
                jqXHR[i](s[i]);
            if (transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR), !transport)
                done(-1, "No Transport");
            else {
                if (jqXHR.readyState = 1, fireGlobals)
                    globalEventContext.trigger("ajaxSend", [jqXHR, s]);
                if (s.async && s.timeout > 0)
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout")
                    }, s.timeout);
                try {
                    state = 1, transport.send(requestHeaders, done)
                } catch (e) {
                    if (2 > state)
                        done(-1, e);
                    else
                        throw e
                }
            }
            return jqXHR
        },param: function(a, traditional) {
            var s = [], add = function(key, value) {
                value = jQuery.isFunction(value) ? value() : value, s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value)
            };
            if (traditional === undefined)
                traditional = jQuery.ajaxSettings.traditional;
            if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a))
                jQuery.each(a, function() {
                    add(this.name, this.value)
                });
            else
                for (var prefix in a)
                    buildParams(prefix, a[prefix], traditional, add);
            return s.join("&").replace(r20, "+")
        }}), jQuery.extend({active: 0,lastModified: {},etag: {}});
    var jsc = jQuery.now(), jsre = /(\=)\?(&|$)|\?\?/i;
    jQuery.ajaxSetup({jsonp: "callback",jsonpCallback: function() {
            return jQuery.expando + "_" + jsc++
        }}), jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var inspectData = "application/x-www-form-urlencoded" === s.contentType && "string" == typeof s.data;
        if ("jsonp" === s.dataTypes[0] || s.jsonp !== !1 && (jsre.test(s.url) || inspectData && jsre.test(s.data))) {
            var responseContainer, jsonpCallback = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, previous = window[jsonpCallback], url = s.url, data = s.data, replace = "$1" + jsonpCallback + "$2";
            if (s.jsonp !== !1)
                if (url = url.replace(jsre, replace), s.url === url) {
                    if (inspectData)
                        data = data.replace(jsre, replace);
                    if (s.data === data)
                        url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback
                }
            return s.url = url, s.data = data, window[jsonpCallback] = function(response) {
                responseContainer = [response]
            }, jqXHR.always(function() {
                if (window[jsonpCallback] = previous, responseContainer && jQuery.isFunction(previous))
                    window[jsonpCallback](responseContainer[0])
            }), s.converters["script json"] = function() {
                if (!responseContainer)
                    jQuery.error(jsonpCallback + " was not called");
                return responseContainer[0]
            }, s.dataTypes[0] = "json", "script"
        }
    }), jQuery.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents: {script: /javascript|ecmascript/},converters: {"text script": function(text) {
                return jQuery.globalEval(text), text
            }}}), jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === undefined)
            s.cache = !1;
        if (s.crossDomain)
            s.type = "GET", s.global = !1
    }), jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
            return {send: function(_, callback) {
                    if (script = document.createElement("script"), script.async = "async", s.scriptCharset)
                        script.charset = s.scriptCharset;
                    script.src = s.url, script.onload = script.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            if (script.onload = script.onreadystatechange = null, head && script.parentNode)
                                head.removeChild(script);
                            if (script = undefined, !isAbort)
                                callback(200, "success")
                        }
                    }, head.insertBefore(script, head.firstChild)
                },abort: function() {
                    if (script)
                        script.onload(0, 1)
                }}
        }
    });
    var xhrOnUnloadAbort = window.ActiveXObject ? function() {
        for (var key in xhrCallbacks)
            xhrCallbacks[key](0, 1)
    } : !1, xhrId = 0, xhrCallbacks;
    if (jQuery.ajaxSettings.xhr = window.ActiveXObject ? function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR()
    } : createStandardXHR, function(xhr) {
        jQuery.extend(jQuery.support, {ajax: !!xhr,cors: !!xhr && "withCredentials" in xhr})
    }(jQuery.ajaxSettings.xhr()), jQuery.support.ajax)
        jQuery.ajaxTransport(function(s) {
            if (!s.crossDomain || jQuery.support.cors) {
                var callback;
                return {send: function(headers, complete) {
                        var xhr = s.xhr(), handle, i;
                        if (s.username)
                            xhr.open(s.type, s.url, s.async, s.username, s.password);
                        else
                            xhr.open(s.type, s.url, s.async);
                        if (s.xhrFields)
                            for (i in s.xhrFields)
                                xhr[i] = s.xhrFields[i];
                        if (s.mimeType && xhr.overrideMimeType)
                            xhr.overrideMimeType(s.mimeType);
                        if (!s.crossDomain && !headers["X-Requested-With"])
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        try {
                            for (i in headers)
                                xhr.setRequestHeader(i, headers[i])
                        } catch (_) {
                        }
                        if (xhr.send(s.hasContent && s.data || null), callback = function(_, isAbort) {
                            var status, statusText, responseHeaders, responses, xml;
                            try {
                                if (callback && (isAbort || 4 === xhr.readyState)) {
                                    if (callback = undefined, handle)
                                        if (xhr.onreadystatechange = jQuery.noop, xhrOnUnloadAbort)
                                            delete xhrCallbacks[handle];
                                    if (isAbort) {
                                        if (4 !== xhr.readyState)
                                            xhr.abort()
                                    } else {
                                        if (status = xhr.status, responseHeaders = xhr.getAllResponseHeaders(), responses = {}, xml = xhr.responseXML, xml && xml.documentElement)
                                            responses.xml = xml;
                                        responses.text = xhr.responseText;
                                        try {
                                            statusText = xhr.statusText
                                        } catch (e) {
                                            statusText = ""
                                        }
                                        if (!status && s.isLocal && !s.crossDomain)
                                            status = responses.text ? 200 : 404;
                                        else if (1223 === status)
                                            status = 204
                                    }
                                }
                            } catch (firefoxAccessException) {
                                if (!isAbort)
                                    complete(-1, firefoxAccessException)
                            }
                            if (responses)
                                complete(status, statusText, responses, responseHeaders)
                        }, !s.async || 4 === xhr.readyState)
                            callback();
                        else {
                            if (handle = ++xhrId, xhrOnUnloadAbort) {
                                if (!xhrCallbacks)
                                    xhrCallbacks = {}, jQuery(window).unload(xhrOnUnloadAbort);
                                xhrCallbacks[handle] = callback
                            }
                            xhr.onreadystatechange = callback
                        }
                    },abort: function() {
                        if (callback)
                            callback(0, 1)
                    }}
            }
        });
    var elemdisplay = {}, iframe, iframeDoc, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, timerId, fxAttrs = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]], fxNow;
    if (jQuery.fn.extend({show: function(speed, easing, callback) {
            var elem, display;
            if (speed || 0 === speed)
                return this.animate(genFx("show", 3), speed, easing, callback);
            else {
                for (var i = 0, j = this.length; j > i; i++)
                    if (elem = this[i], elem.style) {
                        if (display = elem.style.display, !jQuery._data(elem, "olddisplay") && "none" === display)
                            display = elem.style.display = "";
                        if ("" === display && "none" === jQuery.css(elem, "display"))
                            jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName))
                    }
                for (i = 0; j > i; i++)
                    if (elem = this[i], elem.style)
                        if (display = elem.style.display, "" === display || "none" === display)
                            elem.style.display = jQuery._data(elem, "olddisplay") || "";
                return this
            }
        },hide: function(speed, easing, callback) {
            if (speed || 0 === speed)
                return this.animate(genFx("hide", 3), speed, easing, callback);
            else {
                for (var elem, display, i = 0, j = this.length; j > i; i++)
                    if (elem = this[i], elem.style)
                        if (display = jQuery.css(elem, "display"), "none" !== display && !jQuery._data(elem, "olddisplay"))
                            jQuery._data(elem, "olddisplay", display);
                for (i = 0; j > i; i++)
                    if (this[i].style)
                        this[i].style.display = "none";
                return this
            }
        },_toggle: jQuery.fn.toggle,toggle: function(fn, fn2, callback) {
            var bool = "boolean" == typeof fn;
            if (jQuery.isFunction(fn) && jQuery.isFunction(fn2))
                this._toggle.apply(this, arguments);
            else if (null == fn || bool)
                this.each(function() {
                    var state = bool ? fn : jQuery(this).is(":hidden");
                    jQuery(this)[state ? "show" : "hide"]()
                });
            else
                this.animate(genFx("toggle", 3), fn, fn2, callback);
            return this
        },fadeTo: function(speed, to, easing, callback) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity: to}, speed, easing, callback)
        },animate: function(prop, speed, easing, callback) {
            function doAnimation() {
                if (optall.queue === !1)
                    jQuery._mark(this);
                var opt = jQuery.extend({}, optall), isElement = 1 === this.nodeType, hidden = isElement && jQuery(this).is(":hidden"), name, val, p, e, parts, start, end, unit, method;
                opt.animatedProperties = {};
                for (p in prop) {
                    if (name = jQuery.camelCase(p), p !== name)
                        prop[name] = prop[p], delete prop[p];
                    if (val = prop[name], jQuery.isArray(val))
                        opt.animatedProperties[name] = val[1], val = prop[name] = val[0];
                    else
                        opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || "swing";
                    if ("hide" === val && hidden || "show" === val && !hidden)
                        return opt.complete.call(this);
                    if (isElement && ("height" === name || "width" === name))
                        if (opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], "inline" === jQuery.css(this, "display") && "none" === jQuery.css(this, "float"))
                            if (!jQuery.support.inlineBlockNeedsLayout || "inline" === defaultDisplay(this.nodeName))
                                this.style.display = "inline-block";
                            else
                                this.style.zoom = 1
                }
                if (null != opt.overflow)
                    this.style.overflow = "hidden";
                for (p in prop)
                    if (e = new jQuery.fx(this, opt, p), val = prop[p], rfxtypes.test(val))
                        if (method = jQuery._data(this, "toggle" + p) || ("toggle" === val ? hidden ? "show" : "hide" : 0))
                            jQuery._data(this, "toggle" + p, "show" === method ? "hide" : "show"), e[method]();
                        else
                            e[val]();
                    else if (parts = rfxnum.exec(val), start = e.cur(), parts) {
                        if (end = parseFloat(parts[2]), unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px"), "px" !== unit)
                            jQuery.style(this, p, (end || 1) + unit), start = (end || 1) / e.cur() * start, jQuery.style(this, p, start + unit);
                        if (parts[1])
                            end = ("-=" === parts[1] ? -1 : 1) * end + start;
                        e.custom(start, end, unit)
                    } else
                        e.custom(start, val, "");
                return !0
            }
            var optall = jQuery.speed(speed, easing, callback);
            if (jQuery.isEmptyObject(prop))
                return this.each(optall.complete, [!1]);
            else
                return prop = jQuery.extend({}, prop), optall.queue === !1 ? this.each(doAnimation) : this.queue(optall.queue, doAnimation)
        },stop: function(type, clearQueue, gotoEnd) {
            if ("string" != typeof type)
                gotoEnd = clearQueue, clearQueue = type, type = undefined;
            if (clearQueue && type !== !1)
                this.queue(type || "fx", []);
            return this.each(function() {
                function stopQueue(elem, data, index) {
                    var hooks = data[index];
                    jQuery.removeData(elem, index, !0), hooks.stop(gotoEnd)
                }
                var index, hadTimers = !1, timers = jQuery.timers, data = jQuery._data(this);
                if (!gotoEnd)
                    jQuery._unmark(!0, this);
                if (null == type) {
                    for (index in data)
                        if (data[index] && data[index].stop && index.indexOf(".run") === index.length - 4)
                            stopQueue(this, data, index)
                } else if (data[index = type + ".run"] && data[index].stop)
                    stopQueue(this, data, index);
                for (index = timers.length; index--; )
                    if (timers[index].elem === this && (null == type || timers[index].queue === type)) {
                        if (gotoEnd)
                            timers[index](!0);
                        else
                            timers[index].saveState();
                        hadTimers = !0, timers.splice(index, 1)
                    }
                if (!gotoEnd || !hadTimers)
                    jQuery.dequeue(this, type)
            })
        }}), jQuery.each({slideDown: genFx("show", 1),slideUp: genFx("hide", 1),slideToggle: genFx("toggle", 1),fadeIn: {opacity: "show"},fadeOut: {opacity: "hide"},fadeToggle: {opacity: "toggle"}}, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback)
        }
    }), jQuery.extend({speed: function(speed, easing, fn) {
            var opt = speed && "object" == typeof speed ? jQuery.extend({}, speed) : {complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,duration: speed,easing: fn && easing || easing && !jQuery.isFunction(easing) && easing};
            if (opt.duration = jQuery.fx.off ? 0 : "number" == typeof opt.duration ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default, null == opt.queue || opt.queue === !0)
                opt.queue = "fx";
            return opt.old = opt.complete, opt.complete = function(noUnmark) {
                if (jQuery.isFunction(opt.old))
                    opt.old.call(this);
                if (opt.queue)
                    jQuery.dequeue(this, opt.queue);
                else if (noUnmark !== !1)
                    jQuery._unmark(this)
            }, opt
        },easing: {linear: function(p, n, firstNum, diff) {
                return firstNum + diff * p
            },swing: function(p, n, firstNum, diff) {
                return (-Math.cos(p * Math.PI) / 2 + .5) * diff + firstNum
            }},timers: [],fx: function(elem, options, prop) {
            this.options = options, this.elem = elem, this.prop = prop, options.orig = options.orig || {}
        }}), jQuery.fx.prototype = {update: function() {
            if (this.options.step)
                this.options.step.call(this.elem, this.now, this);
            (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this)
        },cur: function() {
            if (null != this.elem[this.prop] && (!this.elem.style || null == this.elem.style[this.prop]))
                return this.elem[this.prop];
            var parsed, r = jQuery.css(this.elem, this.prop);
            return isNaN(parsed = parseFloat(r)) ? !r || "auto" === r ? 0 : r : parsed
        },custom: function(from, to, unit) {
            function t(gotoEnd) {
                return self.step(gotoEnd)
            }
            var self = this, fx = jQuery.fx;
            if (this.startTime = fxNow || createFxNow(), this.end = to, this.now = this.start = from, this.pos = this.state = 0, this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px"), t.queue = this.options.queue, t.elem = this.elem, t.saveState = function() {
                if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined)
                    jQuery._data(self.elem, "fxshow" + self.prop, self.start)
            }, t() && jQuery.timers.push(t) && !timerId)
                timerId = setInterval(fx.tick, fx.interval)
        },show: function() {
            var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);
            if (this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop), this.options.show = !0, dataShow !== undefined)
                this.custom(this.cur(), dataShow);
            else
                this.custom("width" === this.prop || "height" === this.prop ? 1 : 0, this.cur());
            jQuery(this.elem).show()
        },hide: function() {
            this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },step: function(gotoEnd) {
            var p, n, complete, t = fxNow || createFxNow(), done = !0, elem = this.elem, options = this.options;
            if (gotoEnd || t >= options.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), options.animatedProperties[this.prop] = !0;
                for (p in options.animatedProperties)
                    if (options.animatedProperties[p] !== !0)
                        done = !1;
                if (done) {
                    if (null != options.overflow && !jQuery.support.shrinkWrapBlocks)
                        jQuery.each(["", "X", "Y"], function(index, value) {
                            elem.style["overflow" + value] = options.overflow[index]
                        });
                    if (options.hide)
                        jQuery(elem).hide();
                    if (options.hide || options.show)
                        for (p in options.animatedProperties)
                            jQuery.style(elem, p, options.orig[p]), jQuery.removeData(elem, "fxshow" + p, !0), jQuery.removeData(elem, "toggle" + p, !0);
                    if (complete = options.complete)
                        options.complete = !1, complete.call(elem)
                }
                return !1
            } else {
                if (1 / 0 == options.duration)
                    this.now = t;
                else
                    n = t - this.startTime, this.state = n / options.duration, this.pos = jQuery.easing[options.animatedProperties[this.prop]](this.state, n, 0, 1, options.duration), this.now = this.start + (this.end - this.start) * this.pos;
                this.update()
            }
            return !0
        }}, jQuery.extend(jQuery.fx, {tick: function() {
            for (var timer, timers = jQuery.timers, i = 0; i < timers.length; i++)
                if (timer = timers[i], !timer() && timers[i] === timer)
                    timers.splice(i--, 1);
            if (!timers.length)
                jQuery.fx.stop()
        },interval: 13,stop: function() {
            clearInterval(timerId), timerId = null
        },speeds: {slow: 600,fast: 200,_default: 400},step: {opacity: function(fx) {
                jQuery.style(fx.elem, "opacity", fx.now)
            },_default: function(fx) {
                if (fx.elem.style && null != fx.elem.style[fx.prop])
                    fx.elem.style[fx.prop] = fx.now + fx.unit;
                else
                    fx.elem[fx.prop] = fx.now
            }}}), jQuery.each(["width", "height"], function(i, prop) {
        jQuery.fx.step[prop] = function(fx) {
            jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit)
        }
    }), jQuery.expr && jQuery.expr.filters)
        jQuery.expr.filters.animated = function(elem) {
            return jQuery.grep(jQuery.timers, function(fn) {
                return elem === fn.elem
            }).length
        };
    var rtable = /^t(?:able|d|h)$/i, rroot = /^(?:body|html)$/i;
    if ("getBoundingClientRect" in document.documentElement)
        jQuery.fn.offset = function(options) {
            var elem = this[0], box;
            if (options)
                return this.each(function(i) {
                    jQuery.offset.setOffset(this, options, i)
                });
            if (!elem || !elem.ownerDocument)
                return null;
            if (elem === elem.ownerDocument.body)
                return jQuery.offset.bodyOffset(elem);
            try {
                box = elem.getBoundingClientRect()
            } catch (e) {
            }
            var doc = elem.ownerDocument, docElem = doc.documentElement;
            if (!box || !jQuery.contains(docElem, elem))
                return box ? {top: box.top,left: box.left} : {top: 0,left: 0};
            var body = doc.body, win = getWindow(doc), clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
            return {top: top,left: left}
        };
    else
        jQuery.fn.offset = function(options) {
            var elem = this[0];
            if (options)
                return this.each(function(i) {
                    jQuery.offset.setOffset(this, options, i)
                });
            if (!elem || !elem.ownerDocument)
                return null;
            if (elem === elem.ownerDocument.body)
                return jQuery.offset.bodyOffset(elem);
            for (var computedStyle, offsetParent = elem.offsetParent, prevOffsetParent = elem, doc = elem.ownerDocument, docElem = doc.documentElement, body = doc.body, defaultView = doc.defaultView, prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle, top = elem.offsetTop, left = elem.offsetLeft; (elem = elem.parentNode) && elem !== body && elem !== docElem && (!jQuery.support.fixedPosition || "fixed" !== prevComputedStyle.position); ) {
                if (computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle, top -= elem.scrollTop, left -= elem.scrollLeft, elem === offsetParent) {
                    if (top += elem.offsetTop, left += elem.offsetLeft, jQuery.support.doesNotAddBorder && (!jQuery.support.doesAddBorderForTableAndCells || !rtable.test(elem.nodeName)))
                        top += parseFloat(computedStyle.borderTopWidth) || 0, left += parseFloat(computedStyle.borderLeftWidth) || 0;
                    prevOffsetParent = offsetParent, offsetParent = elem.offsetParent
                }
                if (jQuery.support.subtractsBorderForOverflowNotVisible && "visible" !== computedStyle.overflow)
                    top += parseFloat(computedStyle.borderTopWidth) || 0, left += parseFloat(computedStyle.borderLeftWidth) || 0;
                prevComputedStyle = computedStyle
            }
            if ("relative" === prevComputedStyle.position || "static" === prevComputedStyle.position)
                top += body.offsetTop, left += body.offsetLeft;
            if (jQuery.support.fixedPosition && "fixed" === prevComputedStyle.position)
                top += Math.max(docElem.scrollTop, body.scrollTop), left += Math.max(docElem.scrollLeft, body.scrollLeft);
            return {top: top,left: left}
        };
    if (jQuery.offset = {bodyOffset: function(body) {
            var top = body.offsetTop, left = body.offsetLeft;
            if (jQuery.support.doesNotIncludeMarginInBodyOffset)
                top += parseFloat(jQuery.css(body, "marginTop")) || 0, left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            return {top: top,left: left}
        },setOffset: function(elem, options, i) {
            var position = jQuery.css(elem, "position");
            if ("static" === position)
                elem.style.position = "relative";
            var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = ("absolute" === position || "fixed" === position) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1, props = {}, curPosition = {}, curTop, curLeft;
            if (calculatePosition)
                curPosition = curElem.position(), curTop = curPosition.top, curLeft = curPosition.left;
            else
                curTop = parseFloat(curCSSTop) || 0, curLeft = parseFloat(curCSSLeft) || 0;
            if (jQuery.isFunction(options))
                options = options.call(elem, i, curOffset);
            if (null != options.top)
                props.top = options.top - curOffset.top + curTop;
            if (null != options.left)
                props.left = options.left - curOffset.left + curLeft;
            if ("using" in options)
                options.using.call(elem, props);
            else
                curElem.css(props)
        }}, jQuery.fn.extend({position: function() {
            if (!this[0])
                return null;
            var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {top: 0,left: 0} : offsetParent.offset();
            return offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0, offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0, parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0, parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0, {top: offset.top - parentOffset.top,left: offset.left - parentOffset.left}
        },offsetParent: function() {
            return this.map(function() {
                for (var offsetParent = this.offsetParent || document.body; offsetParent && !rroot.test(offsetParent.nodeName) && "static" === jQuery.css(offsetParent, "position"); )
                    offsetParent = offsetParent.offsetParent;
                return offsetParent
            })
        }}), jQuery.each(["Left", "Top"], function(i, name) {
        var method = "scroll" + name;
        jQuery.fn[method] = function(val) {
            var elem, win;
            if (val === undefined)
                if (elem = this[0], !elem)
                    return null;
                else
                    return win = getWindow(elem), win ? "pageXOffset" in win ? win[i ? "pageYOffset" : "pageXOffset"] : jQuery.support.boxModel && win.document.documentElement[method] || win.document.body[method] : elem[method];
            return this.each(function() {
                if (win = getWindow(this))
                    win.scrollTo(!i ? val : jQuery(win).scrollLeft(), i ? val : jQuery(win).scrollTop());
                else
                    this[method] = val
            })
        }
    }), jQuery.each(["Height", "Width"], function(i, name) {
        var type = name.toLowerCase();
        jQuery.fn["inner" + name] = function() {
            var elem = this[0];
            return elem ? elem.style ? parseFloat(jQuery.css(elem, type, "padding")) : this[type]() : null
        }, jQuery.fn["outer" + name] = function(margin) {
            var elem = this[0];
            return elem ? elem.style ? parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) : this[type]() : null
        }, jQuery.fn[type] = function(size) {
            var elem = this[0];
            if (!elem)
                return null == size ? null : this;
            if (jQuery.isFunction(size))
                return this.each(function(i) {
                    var self = jQuery(this);
                    self[type](size.call(this, i, self[type]()))
                });
            if (jQuery.isWindow(elem)) {
                var docElemProp = elem.document.documentElement["client" + name], body = elem.document.body;
                return "CSS1Compat" === elem.document.compatMode && docElemProp || body && body["client" + name] || docElemProp
            } else if (9 === elem.nodeType)
                return Math.max(elem.documentElement["client" + name], elem.body["scroll" + name], elem.documentElement["scroll" + name], elem.body["offset" + name], elem.documentElement["offset" + name]);
            else if (size === undefined) {
                var orig = jQuery.css(elem, type), ret = parseFloat(orig);
                return jQuery.isNumeric(ret) ? ret : orig
            } else
                return this.css(type, "string" == typeof size ? size : size + "px")
        }
    }), window.jQuery = window.$ = jQuery, "function" == typeof define && define.amd && define.amd.jQuery)
        define([], function() {
            return jQuery
        })
}(window);
