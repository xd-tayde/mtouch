import MT from '../src/index';
import _ from '../src/utils';

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

if(!isMobile()){
    $('.js-mask').show();
}

// drag;
let dragTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $drags = $('.js-drag-el');
let $drag = $('.b');
let wrap = document.querySelector('.js-area');
let wrapRect = wrap.getBoundingClientRect();
let elRect = $drag[0].getBoundingClientRect();
let freeze = false;
let mt = MT('.js-area');
mt.on('drag',(ev)=>{
    if(!freeze){
        dragTrans.x += ev.delta.deltaX;
        dragTrans.y += ev.delta.deltaY;
        set($drag,limit(wrap,$drag[0],dragTrans));
    }
});

mt.on('pinch singlePinch',ev=>{
    if(!freeze){
        dragTrans.scale *= ev.delta.scale;
        set($drag,dragTrans);
    }
});
mt.on('rotate singleRotate',ev=>{
    if(!freeze){
        dragTrans.rotate += ev.delta.rotate;
        set($drag,dragTrans);
    }
});

mt.switch('.b',true);

$drags.on('click',function(e){
    freeze = false;
    $drags.removeClass('active');
    $(this).addClass('active');
    dragTrans = _.getPos(this);
    $drag = $(this);
    mt.switch(this);
    e.stopPropagation();
});
$(wrap).on('click',function(){
    $drags.removeClass('active');
    mt.switch(null);
    freeze = true;
});
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
MT('.pinch').on('pinch',ev=>{
    pinchTrans.scale *= ev.delta.scale;
    set($pinch,pinchTrans);
});
//
// rotate;
let rotateTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $rotate = $('.js-rotate-el');
MT('.rotate').on('rotate',ev=>{
    rotateTrans.rotate += ev.delta.rotate;
    set($rotate,rotateTrans);
});

let singlePinchTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $singlePinch = $('.js-singlePinch-el');
// let $singlePinchWidth = $singlePinch.width();
// let $singlePinchHeight = $singlePinch.height();
// let $active = $('.js-singlePinch-el-0');
MT('.singlePinch').on('singlePinch',(ev)=>{
    console.log(ev);
    // $singlePinchWidth += ev.delta.deltaX;
    // $singlePinchHeight += ev.delta.deltaY;
    // console.log($singlePinchWidth,$singlePinchHeight);
    singlePinchTrans.scale *= ev.delta.scale;
    set($singlePinch,singlePinchTrans);
    // $singlePinch.css({
    //     width:$singlePinchWidth + 'px',
    //     height:$singlePinchHeight + 'px',
    // });
},'.js-singlePinch-el');

// singleRotate;
let singleRotateTrans = {
    x:0,
    y:0,
    scale:1,
    rotate:0,
};
let $singleRotate = $('.js-singleRotate-el');
MT('.singleRotate').on('singleRotate',ev=>{
    singleRotateTrans.rotate += ev.delta.rotate;
    set($singleRotate,singleRotateTrans);
},'.js-singleRotate-el');

function set($el,transform){
    window.requestAnimFrame(()=>{
        $el.css('transform',`translate3d(${transform.x}px,${transform.y}px,0px) rotate(${transform.rotate}deg) scale(${transform.scale})`);
    });
}

function isMobile() {
   if( navigator.userAgent.match(/Android/i)
   || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone/i)
   || navigator.userAgent.match(/iPad/i)
   || navigator.userAgent.match(/iPod/i)
   || navigator.userAgent.match(/BlackBerry/i)
   || navigator.userAgent.match(/Windows Phone/i)
   ){
       return true;
   }
   else {
       return false;
   }
}
