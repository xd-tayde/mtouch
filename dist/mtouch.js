(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MTouch = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = {
    getLength: function getLength(v1) {
        if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) !== 'object') {
            console.error('getLength error!');
            return;
        }
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    },
    getAngle: function getAngle(v1, v2) {
        if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) !== 'object' || (typeof v2 === 'undefined' ? 'undefined' : _typeof(v2)) !== 'object') {
            console.error('getAngle error!');
            return;
        }
        // 判断方向，顺时针为 1 ,逆时针为 -1；
        var direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1 : -1,

        // 两个向量的模；
        len1 = this.getLength(v1),
            len2 = this.getLength(v2),
            mr = len1 * len2,
            dot = void 0,
            r = void 0;
        if (mr === 0) return 0;
        // 通过数量积公式可以推导出：
        // cos = (x1 * x2 + y1 * y2)/(|a| * |b|);
        dot = v1.x * v2.x + v1.y * v2.y;
        r = dot / mr;
        if (r > 1) r = 1;
        if (r < -1) r = -1;
        // 解值并结合方向转化为角度值；
        return Math.acos(r) * direction * 180 / Math.PI;
    },
    getBasePoint: function getBasePoint(el) {
        if (!el) return { x: 0, y: 0 };
        var offset = this.getOffset(el);
        var x = offset.left + el.getBoundingClientRect().width / 2,
            y = offset.top + el.getBoundingClientRect().width / 2;
        return { x: Math.round(x), y: Math.round(y) };
    },
    extend: function extend(obj1, obj2) {
        for (var k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if (_typeof(obj2[k]) == 'object' && !(obj2[k] instanceof Node)) {
                    if (_typeof(obj1[k]) !== 'object') {
                        obj1[k] = {};
                    }
                    this.extend(obj1[k], obj2[k]);
                } else {
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    },
    getVector: function getVector(p1, p2) {
        if ((typeof p1 === 'undefined' ? 'undefined' : _typeof(p1)) !== 'object' || (typeof p2 === 'undefined' ? 'undefined' : _typeof(p2)) !== 'object') {
            console.error('getvector error!');
            return;
        }
        var x = Math.round(p1.x - p2.x),
            y = Math.round(p1.y - p2.y);
        return { x: x, y: y };
    },
    getPoint: function getPoint(ev, index) {
        if (!ev || !ev.touches[index]) {
            console.error('getPoint error!');
            return;
        }
        return {
            x: Math.round(ev.touches[index].pageX),
            y: Math.round(ev.touches[index].pageY)
        };
    },
    getOffset: function getOffset(el) {
        el = typeof el == 'string' ? document.querySelector(el) : el;
        var rect = el.getBoundingClientRect();
        var offset = {
            left: rect.left + document.body.scrollLeft,
            top: rect.top + document.body.scrollTop,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
        return offset;
    },
    matrixTo: function matrixTo(matrix) {
        var arr = matrix.replace('matrix(', '').replace(')', '').split(',');
        var cos = arr[0],
            sin = arr[1],
            tan = sin / cos,
            rotate = Math.atan(tan) * 180 / Math.PI,
            scale = cos / Math.cos(Math.PI / 180 * rotate),
            trans = void 0;
        trans = {
            x: parseInt(arr[4]),
            y: parseInt(arr[5]),
            scale: scale,
            rotate: rotate
        };
        return trans;
    },
    getUseName: function getUseName(evName) {
        var useName = evName.replace('start', '');
        var end = useName.indexOf('rotate') !== -1 ? 'nd' : 'end';
        useName = useName.replace(end, '');
        return useName;
    },
    domify: function domify(DOMString) {
        var htmlDoc = document.implementation.createHTMLDocument();
        htmlDoc.body.innerHTML = DOMString;
        return htmlDoc.body.children;
    },
    getEl: function getEl(el) {
        if (!el) {
            console.error('el error,there must be a el!');
            return;
        }
        var _el = void 0;
        if (typeof el == 'string') {
            _el = document.querySelector(el);
        } else if (el instanceof Node) {
            _el = el;
        } else {
            console.error('el error,there must be a el!');
            return;
        }
        return _el;
    },
    data: function data(el, key) {
        el = this.getEl(el);
        return el.getAttribute('data-' + key);
    },
    include: function include(str1, str2) {
        if (str1.indexOf) {
            return str1.indexOf(str2) !== -1;
        } else {
            return false;
        }
    },
    getPos: function getPos(el) {
        if (!el) return;
        el = this.getEl(el);
        var defaulTrans = void 0;
        var style = window.getComputedStyle(el, null);
        var cssTrans = style.transform || style.webkitTransform;

        if (window.getComputedStyle && cssTrans !== 'none') {
            defaulTrans = this.matrixTo(cssTrans);
        } else {
            defaulTrans = {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0
            };
        }
        return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    }
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HandlerBus = function () {
    function HandlerBus(el) {
        _classCallCheck(this, HandlerBus);

        this.handlers = [];
        this.el = el;
    }

    _createClass(HandlerBus, [{
        key: 'add',
        value: function add(handler) {
            this.handlers.push(handler);
            return this;
        }
    }, {
        key: 'del',
        value: function del(handler) {
            var _this = this;

            if (!handler) {
                this.handlers = [];
            } else {
                this.handlers.forEach(function (value, index) {
                    if (value === handler) {
                        _this.handlers.splice(index, 1);
                    }
                });
            }
            return this;
        }
    }, {
        key: 'fire',
        value: function fire() {
            var _this2 = this,
                _arguments = arguments;

            if (!this.handlers || !this.handlers.length === 0) return;
            this.handlers.forEach(function (handler) {
                if (typeof handler === 'function') handler.apply(_this2.el, _arguments);
            });
            return this;
        }
    }]);

    return HandlerBus;
}();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var EVENT = ['touchstart', 'touchmove', 'touchend', 'drag', 'dragstart', 'dragend', 'pinch', 'pinchstart', 'pinchend', 'rotate', 'rotatestart', 'rotatend', 'singlePinchstart', 'singlePinch', 'singlePinchend', 'singleRotate', 'singleRotatestart', 'singleRotatend'];

var ORIGINEVENT = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

function MTouch() {
    var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // 兼容不使用 new 的方式；
    if (!(this instanceof MTouch)) return new MTouch(el);
    // 开关；
    // 初始化时关闭，在调用 on 函数时对应开启；
    this.use = {
        drag: false,
        pinch: false,
        rotate: false,
        singlePinch: false,
        singleRotate: false
    };
    // 获取容器元素；
    this.operator = this.el = _.getEl(el);
    // 状态记录；
    this.draging = this.pinching = this.rotating = this.singlePinching = this.singleRotating = false;
    // 全局参数记录；
    this.fingers = 0;
    this.startScale = 1;
    this.startPoint = {};
    this.secondPoint = {};
    this.pinchStartLength = null;
    this.singlePinchStartLength = null;
    this.vector1 = {};
    this.singleBasePoint = {};

    // 初始化注册事件队列；
    this._driveBus();
    // 监听原生 touch 事件；
    this._bind();
}

MTouch.prototype._driveBus = function () {
    var _this = this;

    EVENT.forEach(function (evName) {
        _this[evName] = new HandlerBus(_this.el);
    });
};

MTouch.prototype._bind = function () {
    var _this2 = this;

    ORIGINEVENT.forEach(function (evName) {
        var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
        // 需要存下 bind(this) 后的函数指向，用于 destroy;
        _this2['_' + fn + '_bind'] = _this2['_' + fn].bind(_this2);
        _this2.el.addEventListener(evName, _this2['_' + fn + '_bind'], false);
    });
};
MTouch.prototype.destroy = function () {
    var _this3 = this;

    ORIGINEVENT.forEach(function (evName) {
        var fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
        _this3.el.removeEventListener(evName, _this3['_' + fn + '_bind'], false);
    });
};
MTouch.prototype._start = function (e) {
    if (!e.touches || e.type !== 'touchstart') return;
    // 记录手指数量；
    this.fingers = e.touches.length;
    // 记录第一触控点；
    this.startPoint = _.getPoint(e, 0);
    // 计算单指操作时的基础点；
    this.singleBasePoint = _.getBasePoint(this.operator);
    // 双指操作时
    if (this.fingers > 1) {
        // 第二触控点；
        this.secondPoint = _.getPoint(e, 1);
        // 计算双指向量；
        this.vector1 = _.getVector(this.secondPoint, this.startPoint);
        // 计算向量模；
        this.pinchStartLength = _.getLength(this.vector1);
    } else if (this.use.singlePinch) {
        // 单指且监听 singlePinch 时，计算向量模；
        var pinchV1 = _.getVector(this.startPoint, this.singleBasePoint);
        this.singlePinchStartLength = _.getLength(pinchV1);
    }
    // 触发 touchstart 事件；
    this.touchstart.fire({ origin: e, eventType: 'touchstart' });
};
MTouch.prototype._move = function (ev) {
    if (!ev.touches || ev.type !== 'touchmove') return;
    // 判断触控点是否为 singlebutton 区域；
    var isSingleButton = _.data(ev.target, 'singleButton'),
        curFingers = ev.touches.length,
        curPoint = _.getPoint(ev, 0),
        singlePinchLength = void 0,
        pinchLength = void 0,
        rotateV1 = void 0,
        rotateV2 = void 0,
        pinchV2 = void 0;
    // 当从原先的两指到一指的时候，可能会出现基础手指的变化，导致跳动；
    // 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
    if (curFingers < this.fingers) {
        this.startPoint = curPoint;
        this.fingers = curFingers;
        return;
    }
    // 两指先后触摸时，只会触发第一指一次 touchstart，第二指不会再次触发 touchstart；
    // 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
    if (curFingers > 1 && (!this.secondPoint || !this.vector1 || !this.pinchStartLength)) {
        this.secondPoint = _.getPoint(ev, 1);
        this.vector1 = _.getVector(this.secondPoint, this.startPoint);
        this.pinchStartLength = _.getLength(this.vector1);
    }
    // 双指时，需触发 pinch 和 rotate 事件；
    if (curFingers > 1) {
        var curSecPoint = _.getPoint(ev, 1),
            vector2 = _.getVector(curSecPoint, curPoint);
        // 触发 pinch 事件；
        if (this.use.pinch) {
            pinchLength = _.getLength(vector2);
            this._eventFire('pinch', {
                delta: {
                    scale: pinchLength / this.pinchStartLength
                },
                origin: ev
            });
            this.pinchStartLength = pinchLength;
        }
        // 触发 rotate 事件；
        if (this.use.rotate) {
            this._eventFire('rotate', {
                delta: {
                    rotate: _.getAngle(this.vector1, vector2)
                },
                origin: ev
            });
            this.vector1 = vector2;
        }
    } else {
        // 触发 singlePinch 事件;
        if (this.use.singlePinch && isSingleButton) {
            pinchV2 = _.getVector(curPoint, this.singleBasePoint);
            singlePinchLength = _.getLength(pinchV2);
            this._eventFire('singlePinch', {
                delta: {
                    scale: singlePinchLength / this.singlePinchStartLength,
                    deltaX: curPoint.x - this.startPoint.x,
                    deltaY: curPoint.y - this.startPoint.y
                },
                origin: ev
            });
            this.singlePinchStartLength = singlePinchLength;
        }
        // 触发 singleRotate 事件;
        if (this.use.singleRotate && isSingleButton) {
            rotateV1 = _.getVector(this.startPoint, this.singleBasePoint);
            rotateV2 = _.getVector(curPoint, this.singleBasePoint);
            this._eventFire('singleRotate', {
                delta: {
                    rotate: _.getAngle(rotateV1, rotateV2)
                },
                origin: ev
            });
        }
    }
    // 触发 drag 事件；
    if (this.use.drag) {
        if (!isSingleButton) {
            this._eventFire('drag', {
                delta: {
                    deltaX: curPoint.x - this.startPoint.x,
                    deltaY: curPoint.y - this.startPoint.y
                },
                origin: ev
            });
        }
    }
    this.startPoint = curPoint;
    // 触发 touchmove 事件；
    this.touchmove.fire({ eventType: 'touchmove', origin: ev });
    ev.preventDefault();
};
MTouch.prototype._end = function (ev) {
    var _this4 = this;

    if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel') return;
    // 触发 end 事件；
    ['pinch', 'drag', 'rotate', 'singleRotate', 'singlePinch'].forEach(function (evName) {
        _this4._eventEnd(evName, { origin: ev });
    });
    this.touchend.fire({ eventType: 'touchend', origin: ev });
};
MTouch.prototype._eventFire = function (evName, ev) {
    var ing = evName + 'ing',
        start = evName + 'start';
    if (!this[ing]) {
        ev.eventType = start;
        this[start].fire(ev);
        this[ing] = true;
    } else {
        ev.eventType = evName;
        this[evName].fire(ev);
    }
};
MTouch.prototype._eventEnd = function (evName, ev) {
    var ing = evName + 'ing',
        end = void 0;
    if (evName == 'rotate' || evName == 'singleRotate') {
        end = evName + 'nd';
    } else {
        end = evName + 'end';
    }
    if (this[ing]) {
        ev.eventType = end;
        this[end].fire(ev);
        this[ing] = false;
    }
};
// 添加 button 区域；
// 背景样式由业务方定制；
MTouch.prototype._addButton = function (el) {
    var _$domify = _.domify('<div class="mtouch-singleButton" data-singleButton=\'true\' style=\'position:absolute;right:-15px;bottom: -15px;width:30px;height: 30px;background-size: 100% 100%;\'></div>'),
        _$domify2 = _slicedToArray(_$domify, 1),
        button = _$domify2[0],
        _style = void 0;

    el.appendChild(button);
    el.setAttribute('data-mtouch-addButton', true);
    if (getComputedStyle && window.getComputedStyle(el, null).position === 'static') {
        _style = el.style || '';
        el.style = _style + 'position:relative';
    }
};
// 切换 operator;
MTouch.prototype.switch = function (el) {
    var addButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var _el = void 0;
    if (!el) {
        this.operator = this.el;
        return;
    }
    this.operator = _el = _.getEl(el);
    if (!_.data(_el, 'mtouch-addButton') && (this.use.singleRotate || this.use.singlePinch) && addButton) {
        this._addButton(_el);
    }
};
MTouch.prototype.on = function (evName) {
    var _this5 = this;

    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var operator = arguments[2];

    if (_.include(evName, ' ')) {
        evName.split(' ').forEach(function (v) {
            _this5._on(v, handler, operator);
        });
    } else {
        this._on(evName, handler, operator);
    }
    return this;
};
MTouch.prototype._on = function (evName, handler, operator) {
    this.use[_.getUseName(evName)] = true;
    this[evName].add(handler);
    this.switch(operator);
};
MTouch.prototype.off = function (evName, handler) {
    this[evName].del(handler);
};

return MTouch;

})));
//# sourceMappingURL=mtouch.js.map
