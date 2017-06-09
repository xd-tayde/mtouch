import MTouch from '../src/index';

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

// drag;
let dragTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $drag = $('.js-drag-el');
let wrap = document.querySelector('.js-area');
let wrapRect = wrap.getBoundingClientRect();
let elRect = $drag[0].getBoundingClientRect();
// new MTouch({
//     receiver:'.js-drag-el',
//     drag(ev){
//         dragTrans.x += ev.delta.deltaX;
//         dragTrans.y += ev.delta.deltaY;
//         set($drag,limit(wrap,$drag[0],dragTrans));
//     },
// });
MTouch('.js-area').on('drag',(ev)=>{
    dragTrans.x += ev.delta.deltaX;
    dragTrans.y += ev.delta.deltaY;
    set($drag,limit(wrap,$drag[0],dragTrans));
});
// console.log(touch);

function limit(wrap,el,trans){
    let bounce = 40;
    let minX = - el.offsetLeft - bounce;
    let maxX =  wrapRect.width - el.offsetLeft - elRect.width + bounce;
    let minY = - el.offsetTop - bounce;
    let maxY =  wrapRect.height - el.offsetTop - elRect.height + bounce;
    trans.x = trans.x < minX ? minX : trans.x;
    trans.x = trans.x > maxX ? maxX : trans.x;
    trans.y = trans.y < minY ? minY : trans.y;
    trans.y = trans.y > maxY ? maxY : trans.y;
    return trans;
}

// pinch;
let pinchTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $pinch = $('.js-pinch-el');
new MTouch({
    receiver:'.js-pinch-el',
    pinch(ev){
        pinchTrans.scale *= ev.delta.scale;
        set($pinch,pinchTrans);
    },
});

// rotate;
let rotateTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $rotate = $('.js-rotate-el');
new MTouch({
    receiver:'.js-rotate-el',
    rotate(ev){
        rotateTrans.rotate += ev.delta.rotate;
        set($rotate,rotateTrans);
    },
});
// singlePinch;
let singlePinchTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $singlePinch = $('.js-singlePinch-el');
new MTouch({
    receiver:'.js-singlePinch-el',
    singlePinch:{
        pinch(ev){
            singlePinchTrans.scale *= ev.delta.scale;
            set($singlePinch,singlePinchTrans);
        },
        buttonId:'js-singlePinch',
    },
});

// singleRotate;
let singleRotateTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $singleRotate = $('.js-singleRotate-el');
new MTouch({
    receiver:'.js-singleRotate-el',
    singleRotate:{
        rotate(ev){
            singleRotateTrans.rotate += ev.delta.rotate;
            set($singleRotate,singleRotateTrans);
        },
        buttonId:'js-singleRotate',
    },
});

function set($el,transform){
    window.requestAnimFrame(()=>{
        $el.css('transform',`translate3d(${transform.x}px,${transform.y}px,0px) rotate(${transform.rotate}deg) scale(${transform.scale})`);
    });
}
