export default {
    getLength(v1) {
        if (typeof v1 !== 'object') {
            console.error('getLength error!');
            return;
        }
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    },
    getAngle(v1, v2) {
        if (typeof v1 !== 'object' || typeof v2 !== 'object') {
            console.error('getAngle error!');
            return;
        }
        let direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1: -1,
            len1 = this.getLength(v1),
            len2 = this.getLength(v2),
            mr = len1 * len2,
            dot,r;
        if (mr === 0)return 0;
        dot = v1.x * v2.x + v1.y * v2.y;
        r = dot / mr;
        if (r > 1)r = 1;
        if (r < -1)r = -1;
        return Math.acos(r) * direction * 180 / Math.PI;
    },
    getBasePoint(el) {
        if (!el) {
            console.error('getBasePoint error!');
            return;
        }
        let offset = this.getOffset(el);
        let x = offset.left + el.getBoundingClientRect().width / 2,
            y = offset.top + el.getBoundingClientRect().width / 2;
        return {x: Math.round(x), y: Math.round(y)};
    },
    setPos(el, transform) {
        let str = JSON.stringify(transform);
        let value = `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`;
        el = typeof el == 'string'? document.querySelector(el): el;
        el.style.transform = value;
        el.setAttribute('data-mtouch-status', str);
    },
    getPos(el) {
        let defaulTrans;
        let cssTrans = window.getComputedStyle(el,null).transform;
        if(window.getComputedStyle && cssTrans !== 'none'){
            defaulTrans = this.matrixTo(cssTrans);
        }else{
            defaulTrans = {
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
            };
        }
        return JSON.parse(el.getAttribute('data-mtouch-status')) || defaulTrans;
    },
    extend(obj1, obj2) {
        for (let k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if(typeof obj2[k] == 'object'){
                    if(typeof obj1[k] !== 'object'){
                        obj1[k] = {};
                    }
                    this.extend(obj1[k],obj2[k]);
                }else{
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    },
    getVector(p1, p2) {
        if (typeof p1 !== 'object' || typeof p2 !== 'object' ) {
            console.error('getvector error!');
            return;
        }
        let x = Math.round(p1.x - p2.x),
            y = Math.round(p1.y - p2.y);
        return { x, y };
    },
    getPoint(ev, index) {
        if (!ev || !ev.touches[index]) {
            console.error('getPoint error!');
            return;
        }
        return {
            x: Math.round(ev.touches[index].pageX),
            y: Math.round(ev.touches[index].pageY),
        };
    },
    getOffset(el){
        el = typeof el == 'string'? document.querySelector(el): el;
        let rect = el.getBoundingClientRect();
        let offset = {
            left:rect.left + document.body.scrollLeft,
            top:rect.top + document.body.scrollTop,
            width:el.offsetWidth,
            height:el.offsetHeight,
        };
        return offset;
    },
    matrixTo(matrix){
        let arr = (matrix.replace('matrix(','').replace(')','')).split(',');
        let cos = arr[0],
            sin = arr[1],
            tan = sin / cos,
            rotate = Math.atan( tan ) * 180 / Math.PI,
            scale = cos / ( Math.cos( Math.PI / 180 * rotate )),
            trans;
        trans = {
            x:parseInt(arr[4]),
            y:parseInt(arr[5]),
            scale,
            rotate,
        };
        return trans;
    },
};
