let sheet;
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
        // 判断方向，顺时针为 1 ,逆时针为 -1；
        let direction = v1.x * v2.y - v2.x * v1.y > 0 ? 1: -1,
            // 两个向量的模；
            len1 = this.getLength(v1),
            len2 = this.getLength(v2),
            mr = len1 * len2,
            dot,r;
        if (mr === 0)return 0;
        // 通过数量积公式可以推导出：
        // cos = (x1 * x2 + y1 * y2)/(|a| * |b|);
        dot = v1.x * v2.x + v1.y * v2.y;
        r = dot / mr;
        if (r > 1)r = 1;
        if (r < -1)r = -1;
        // 解值并结合方向转化为角度值；
        return Math.acos(r) * direction * 180 / Math.PI;
    },
    getBasePoint(el) {
        if (!el) return {x:0,y:0};
        let offset = this.getOffset(el);
        let x = offset.left + el.getBoundingClientRect().width / 2,
            y = offset.top + el.getBoundingClientRect().width / 2;
        return {x: Math.round(x), y: Math.round(y)};
    },
    extend(obj1, obj2) {
        for (let k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if(typeof obj2[k] == 'object' && !(obj2[k] instanceof Node)){
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
    getUseName(evName){
        let useName = evName.replace('start','');
        let end = useName.indexOf('rotate') !== -1 ? 'nd' : 'end';
        useName = useName.replace(end,'');
        return useName;
    },
    domify(DOMString) {
        let htmlDoc = document.implementation.createHTMLDocument();
        htmlDoc.body.innerHTML = DOMString;
        return htmlDoc.body.children;
    },
    getEl(el){
        if(!el){
            console.error('el error,there must be a el!');
            return;
        }
        let _el;
        if(typeof el == 'string'){
            _el = document.querySelector(el);
        }else if(el instanceof Node){
            _el = el;
        }else{
            console.error('el error,there must be a el!');
            return;
        }
        return _el;
    },
    data(el,key){
        el = this.getEl(el);
        return el.getAttribute(`data-${key}`);
    },
    include(str1,str2){
        if(str1.indexOf){
            return str1.indexOf(str2) !== -1;
        }else{
            return false;
        }
    },
    getPos(el) {
        if(!el)return;
        el = this.getEl(el);
        let defaulTrans;
        let style = window.getComputedStyle(el,null);
        let cssTrans = style.transform || style.webkitTransform;

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
    addCssRule(selector, rules){
        if(!sheet){
            sheet = createStyleSheet();
        }
        sheet.insertRule(`${selector}{${rules}}`,sheet.rules.length);
    },
};

function createStyleSheet() {
    let style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);
    return style.sheet;
}
