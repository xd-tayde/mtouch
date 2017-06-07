import _ from './utils';
import HandlerBus from './handlerBus';

const EVENT = [
    'touchstart',
    'touchmove',
    'touchend',
    'drag',
    'dragstart',
    'dragend',
    'pinch',
    'pinchstart',
    'pinchend',
    'rotate',
    'rotatestart',
    'rotatend',
];

const ORIGINEVENT = [
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
];

export default class MTouch {
    constructor(options) {
        this.ops = {
            // config:
            receiver: null,
            operator: null,

            // event
            touchstart() {},
            touchmove() {},
            touchend() {},

            drag() {},
            dragstart() {},
            dragend() {},

            pinch() {},
            pinchstart() {},
            pinchend() {},

            rotate() {},
            rotatestart() {},
            rotatend() {},

            singlePinch:{
                start(){},
                pinch(){},
                end(){},
                buttonId:null,
            },

            singleRotate:{
                start(){},
                rotate(){},
                end(){},
                buttonId:null,
            },
        };

        // 开关；
        this.use = {
            drag: !!options.drag || !!options.dragstart || !!options.dragend,
            pinch: !!options.pinch || !!options.pinchstart || !!options.pinchend,
            rotate: !!options.rotate || !!options.rotatestart || !!options.rotateend,
            singlePinch: !!options.singlePinch && !!options.singlePinch.buttonId,
            singleRotate: !!options.singleRotate && !!options.singleRotate.buttonId,
        };

        this.ops = _.extend(this.ops, options);

        // receiver test;
        if(!this.ops.receiver || typeof this.ops.receiver !== 'string'){
            console.error('receiver error,there must be a receiver-selector');
            return;
        }
        // 事件接收器；
        this.receiver = document.querySelector(this.ops.receiver);

        // 事件操纵器；
        if (this.ops.operator) {
            if(typeof this.ops.operator !== 'string'){
                console.error('operator error, the operator param must be a selector');
                return;
            }
            this.operator = document.querySelector(this.ops.operator);
        } else {
            this.operator = this.receiver;
        }


        // touch状态；
        this.fingers = 0;
        // 初始状态;
        this.draging = this.pinching = this.rotating = this.singleRotating = this.singlePinching = false;

        this.startScale = 1;
        this.startPoint = {};
        this.secondPoint = {};
        this.pinchStartLength = null;
        this.singlePinchStartLength = null;
        this.vector1 = {};
        this.singleBasePoint = {};
        // eventbus
        this.driveBus();
        this.bind();
    }
    driveBus() {
        EVENT.forEach(eventName => {
            this[eventName] = new HandlerBus(this.receiver).add(this.ops[eventName] || function(){});
        });
        this.singlePinchstart = new HandlerBus(this.receiver).add(this.ops.singlePinch.start || function(){});
        this.singlePinch = new HandlerBus(this.receiver).add(this.ops.singlePinch.pinch || function(){});
        this.singlePinchend = new HandlerBus(this.receiver).add(this.ops.singlePinch.end || function(){});
        this.singleRotatestart = new HandlerBus(this.receiver).add(this.ops.singleRotate.start || function(){});
        this.singleRotate = new HandlerBus(this.receiver).add(this.ops.singleRotate.rotate || function(){});
        this.singleRotatend = new HandlerBus(this.receiver).add(this.ops.singleRotate.end || function(){});
    }
    bind() {
        ORIGINEVENT.forEach(evName => {
            let fn = evName == 'touchcancel'? 'end': evName.replace('touch', '');
            // 需要存下 bind(this) 后的函数指向，用于 destroy;
            this[fn+'bind'] = this[fn].bind(this);
            this.receiver.addEventListener(evName, this[fn+'bind'], false);
        });
    }
    destroy(){
        ORIGINEVENT.forEach(evName => {
            let fn = evName == 'touchcancel'? 'end': evName.replace('touch', '');
            this.receiver.removeEventListener(evName, this[fn+'bind'], false);
        });
    }
    start(ev) {
        if (!ev.touches || ev.type !== 'touchstart')return;

        this.fingers = ev.touches.length;
        this.startPoint = _.getPoint(ev, 0);
        this.singleBasePoint = _.getBasePoint(this.operator);

        if (this.fingers > 1) {
            this.secondPoint = _.getPoint(ev, 1);
            this.vector1 = _.getVector(this.secondPoint, this.startPoint);
            this.pinchStartLength = _.getLength(this.vector1);
        } else if (this.use.singlePinch) {
            let pinchV1 = _.getVector(this.startPoint, this.singleBasePoint);
            this.singlePinchStartLength = _.getLength(pinchV1);
        }

        this.touchstart.fire({
            origin : ev,
            eventType:'touchstart',
        });
    }
    move(ev) {
        if (!ev.touches || ev.type !== 'touchmove')return;
        let curPoint = _.getPoint(ev, 0);
        let curFingers = ev.touches.length;
        let rotateV1,
            rotateV2,
            pinchV2,
            pinchLength,
            singlePinchLength;

        // 当从原先的两指到一指的时候，可能会出现基础手指的变化，导致跳动；
        // 因此需屏蔽掉一次错误的touchmove事件，待重新设置基础指后，再继续进行；
        if (curFingers < this.fingers) {
            this.startPoint = curPoint;
            this.fingers = curFingers;
            return;
        }

        // 两指先后触摸时，只会触发第一指一次touchstart，第二指不会再次触发touchstart；
        // 因此会出现没有记录第二指状态，需要在touchmove中重新获取参数；
        if (curFingers > 1 && (!this.secondPoint || !this.vector1 || !this.pinchStartLength)) {
            this.secondPoint = _.getPoint(ev, 1);
            this.vector1 = _.getVector(this.secondPoint, this.startPoint);
            this.pinchStartLength = _.getLength(this.vector1);
        }

        // 双指时，需触发pinch和rotate事件；
        if (curFingers > 1) {
            let curSecPoint = _.getPoint(ev, 1);
            let vector2 = _.getVector(curSecPoint, curPoint);
            // pinch
            if (this.use.pinch) {
                pinchLength = _.getLength(vector2);
                this.eventFire('pinch', {
                    delta:{
                        scale: pinchLength / this.pinchStartLength,
                    },
                    origin:ev,
                });
                this.pinchStartLength = pinchLength;
            }
            // rotate
            if (this.use.rotate) {
                this.eventFire('rotate', {
                    delta:{
                        rotate: _.getAngle(this.vector1, vector2),
                    },
                    origin:ev,
                });
                this.vector1 = vector2;
            }
        } else {
            // singlePinch;
            if (this.use.singlePinch && ev.target.id == this.ops.singlePinch.buttonId) {
                pinchV2 = _.getVector(curPoint, this.singleBasePoint);
                singlePinchLength = _.getLength(pinchV2);
                this.eventFire('singlePinch', {
                    delta:{
                        scale: singlePinchLength / this.singlePinchStartLength,
                    },
                    origin:ev,
                });
                this.singlePinchStartLength = singlePinchLength;
            }
            // singleRotate;
            if (this.use.singleRotate && ev.target.id == this.ops.singleRotate.buttonId) {
                rotateV1 = _.getVector(this.startPoint, this.singleBasePoint);
                rotateV2 = _.getVector(curPoint, this.singleBasePoint);
                this.eventFire('singleRotate', {
                    delta:{
                        rotate: _.getAngle(rotateV1, rotateV2),
                    },
                    origin:ev,
                });
            }
        }
        if (this.use.drag) {
            if (ev.target.id !== this.ops.singlePinch.buttonId && ev.target.id !== this.ops.singleRotate.buttonId) {
                this.eventFire('drag', {
                    delta:{
                        deltaX: curPoint.x - this.startPoint.x,
                        deltaY: curPoint.y - this.startPoint.y,
                    },
                    origin:ev,
                });
            }
        }
        this.startPoint = curPoint;
        this.touchmove.fire({
            eventType:'touchmove',
            origin:ev,
        });
        ev.preventDefault();
    }
    end(ev) {
        if (!ev.touches && ev.type !== 'touchend' && ev.type !== 'touchcancel')
            return;

        ['pinch', 'drag', 'rotate', 'singleRotate', 'singlePinch'].forEach(evName => {
            this.eventEnd(evName, {
                origin:ev,
            });
        });
        this.touchend.fire({
            eventType:'touchend',
            origin:ev,
        });
    }
    eventFire(evName, ev) {
        let ing = `${evName}ing`;
        let start = `${evName}start`;
        if (!this[ing]) {
            ev.eventType = start;
            this[start].fire(ev);
            this[ing] = true;
        } else {
            ev.eventType = evName;
            this[evName].fire(ev);
        }
    }
    eventEnd(evName, ev) {
        let ing = `${evName}ing`;
        let end;
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
    }
    switchOperator(el) {
        this.operator = el;
    }
    on(evName, handler) {
        this[evName] && this[evName].add(handler);
    }
    off(evName, handler) {
        this[evName] && this[evName].del(handler);
    }
}
