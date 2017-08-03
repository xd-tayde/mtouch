import _ from './utils';
import HandlerBus from './handlerBus';

const EVENT = ['touchstart','touchmove','touchend','drag','dragstart','dragend','pinch','pinchstart','pinchend','rotate','rotatestart','rotatend','singlePinchstart','singlePinch','singlePinchend','singleRotate','singleRotatestart','singleRotatend'];

const ORIGINEVENT = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];

export default function MTouch(el = '') {
    // 兼容不使用 new 的方式；
    if (!(this instanceof MTouch))return new MTouch(el);
    // 开关；
    // 初始化时关闭，在调用 on 函数时对应开启；
    this.use = {
        drag: false,
        pinch: false,
        rotate: false,
        singlePinch: false,
        singleRotate: false,
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

MTouch.prototype._driveBus = function() {
    EVENT.forEach(evName => {
        this[evName] = new HandlerBus(this.el);
    });
};

MTouch.prototype._bind = function() {
    ORIGINEVENT.forEach(evName => {
        let fn = evName == 'touchcancel'? 'end': evName.replace('touch', '');
        // 需要存下 bind(this) 后的函数指向，用于 destroy;
        this[`_${fn}_bind`] = this[`_${fn}`].bind(this);
        this.el.addEventListener(evName, this[`_${fn}_bind`], false);
    });
};
MTouch.prototype.destroy = function() {
    ORIGINEVENT.forEach(evName => {
        let fn = evName == 'touchcancel' ? 'end' : evName.replace('touch', '');
        this.el.removeEventListener(evName, this[`_${fn}_bind`], false);
    });
};
MTouch.prototype._start = function(e) {
    if (!e.touches || e.type !== 'touchstart')return;
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
        let pinchV1 = _.getVector(this.startPoint, this.singleBasePoint);
        this.singlePinchStartLength = _.getLength(pinchV1);
    }
    // 触发 touchstart 事件；
    this.touchstart.fire({origin: e, eventType: 'touchstart'});
};
MTouch.prototype._move = function(ev) {
    if (!ev.touches || ev.type !== 'touchmove')return;
    // 判断触控点是否为 singlebutton 区域；
    let isSingleButton = _.data(ev.target,'singleButton'),
        curFingers = ev.touches.length,
        curPoint = _.getPoint(ev, 0),
        singlePinchLength,
        pinchLength,
        rotateV1,
        rotateV2,
        pinchV2;
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
        let curSecPoint = _.getPoint(ev, 1),
            vector2 = _.getVector(curSecPoint, curPoint);
        // 触发 pinch 事件；
        if (this.use.pinch) {
            pinchLength = _.getLength(vector2);
            this._eventFire('pinch', {
                delta: {
                    scale: pinchLength / this.pinchStartLength,
                },
                origin: ev,
            });
            this.pinchStartLength = pinchLength;
        }
        // 触发 rotate 事件；
        if (this.use.rotate) {
            this._eventFire('rotate', {
                delta: {
                    rotate: _.getAngle(this.vector1, vector2),
                },
                origin: ev,
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
                },
                origin: ev,
            });
            this.singlePinchStartLength = singlePinchLength;
        }
        // 触发 singleRotate 事件;
        if (this.use.singleRotate && isSingleButton) {
            rotateV1 = _.getVector(this.startPoint, this.singleBasePoint);
            rotateV2 = _.getVector(curPoint, this.singleBasePoint);
            this._eventFire('singleRotate', {
                delta: {
                    rotate: _.getAngle(rotateV1, rotateV2),
                },
                origin: ev,
            });
        }
    }
    // 触发 drag 事件；
    if (this.use.drag) {
        if (!isSingleButton) {
            this._eventFire('drag', {
                delta: {
                    deltaX: curPoint.x - this.startPoint.x,
                    deltaY: curPoint.y - this.startPoint.y,
                },
                origin: ev,
            });
        }
    }
    this.startPoint = curPoint;
    // 触发 touchmove 事件；
    this.touchmove.fire({eventType: 'touchmove', origin: ev});
    ev.preventDefault();
};
MTouch.prototype._end = function(ev) {
    if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel')return;
    // 触发 end 事件；
    ['pinch', 'drag', 'rotate', 'singleRotate', 'singlePinch'].forEach(evName => {
        this._eventEnd(evName, {origin: ev});
    });
    this.touchend.fire({eventType: 'touchend', origin: ev});
};
MTouch.prototype._eventFire = function(evName, ev) {
    let ing = `${evName}ing`,
        start = `${evName}start`;
    if (!this[ing]) {
        ev.eventType = start;
        this[start].fire(ev);
        this[ing] = true;
    } else {
        ev.eventType = evName;
        this[evName].fire(ev);
    }
};
MTouch.prototype._eventEnd = function(evName, ev) {
    let ing = `${evName}ing`,
        end;
    if (evName == 'rotate' || evName == 'singleRotate') {
        end = `${evName}nd`;
    } else {
        end = `${evName}end`;
    }
    if (this[ing]) {
        ev.eventType = end;
        this[end].fire(ev);
        this[ing] = false;
    }
};
// 添加 button 区域；
// 背景样式由业务方定制；
MTouch.prototype._addButton = function(el){
    let [button] = _.domify(`<div class="mtouch-singleButton" data-singleButton='true' style='position:absolute;right:-15px;bottom: -15px;width:30px;height: 30px;background-size: 100% 100%;'></div>`),
        _style;
    el.appendChild(button);
    el.setAttribute('data-mtouch-addButton',true);
    if(getComputedStyle && window.getComputedStyle(el,null).position === 'static'){
        _style = el.style || '';
        el.style = _style + 'position:relative';
    }
};
// 切换 operator;
MTouch.prototype.switch = function(el,addButton = true) {
    let _el;
    if(!el){
        this.operator = this.el;
        return;
    }
    this.operator = _el = _.getEl(el);
    if(!_.data(_el,'mtouch-addButton') && (this.use.singleRotate || this.use.singlePinch) && addButton){
        this._addButton(_el);
    }
};
MTouch.prototype.on = function(evName, handler = ()=>{}, operator) {
    if(_.include(evName,' ')){
        evName.split(' ').forEach(v=>{
            this._on(v,handler,operator);
        });
    }else{
        this._on(evName,handler,operator);
    }
    return this;
};
MTouch.prototype._on = function(evName,handler,operator){
    this.use[_.getUseName(evName)] = true;
    this[evName].add(handler);
    this.switch(operator);
};
MTouch.prototype.off = function(evName, handler) {
    this[evName].del(handler);
};
