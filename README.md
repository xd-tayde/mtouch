# MTouch通用移动端手势库2.0

> [demo](http://f2er.meitu.com/gxd/mtouch/example/index.html)

> [git](https://gitlab.meitu.com/npm/meitu-mtouch)

> [download](http://f2er.meitu.com/gxd/mtouch/dist/mtouch.min.js)

### 更新

2.0版本
> 1、剥离了业务逻辑，优化代码；

> 2、调整单指缩放和单指旋转的使用方式，更为清晰，方便；

> 3、新增对一些错误用法的容错和提示；

### 简介

该手势库是以我们业务中常用的贴纸类型做为基础，进行进一步的封装抽象，更贴近我们业务，更加便于使用，更加轻量以及有更好的业务定制性，大家有业务上的需求时，可随时联系我；该库去除了一些比较少用到的手势，使代码更加精简和轻量，没有依赖，压缩后大小为9K；

支持5种手势:

> 1. **拖动事件**：`drag`
> 2. **双指缩放**：`pinch`
> 3. **双指旋转**：`rotate`
> 4. **单指缩放**：`singlePinch`
> 5. **单指旋转**：`singleRotate`

#### 事件类型：

```js
EVENT = [
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
    'singlePinch',
    'singlePinchstart',
    'singlePinchend',
    'singleRotate',·
    'singleRotatestart',
    'singleRotatend'
];
```

### 兼容性

** 移动端全兼容 **

### 使用方式

#### 引入:

##### 1.直接使用公司私有npm进行引入;

在shell直接使用Npm进行安装

```js
npm set registry http://npm.meitu-inc.com
npm install @meitu/mtouch --save

```

```js
import MTouch from '@meitu/mtouch';

// 或者

let MTouch = required('@meitu/mtouch');
```


##### 2.使用`import || required`直接引入;

```js
import MTouch from './mtouch.min';

new MTouch( options );

```

##### 3.直接通过`script`标签引入;

```js
<script src="mtouch.min.js"></script>

new MTouch( options );
```

#### 使用:

由于对单个元素的操作中，存在着一些无法避免的问题，例如双指操纵元素时单指先离开；单指先触发后，又变换成双指操作；一个在元素上，一个在元素外等等，这些问题会影响到基础手指的确定，会导致操作过程中元素可能出现 **跳动** ；

因此更加推荐 **使用委托** 的方式进行操作元素，能有效的 **避免上述问题**；

如果直接绑定到元素上，则需注意对 **每个需要操作的元素单独创建一个实例**；

```js
new MTouch({

    // 事件监听元素，用于监听所有事件产生；必填；

    receiver:'selector',

    // 事件操纵元素，用于反馈事件所的操作；
    // 该值为可选，如果不填，则操纵元素即为监听元素本身；

    operator:'selector',  

    // 可监听的事件；
    // 传入事件回调中的事件对象，有在原生对象的基础上做了层简单的封装；
    // ev = {
    //    origin : 原生事件对象，
    //    eventType : eventName,  对应的事件名称
    //    delta:{ deltaX/deltaY/scale/rotate } 事件触发产生的增量；
    // };

    // 与原生的touch事件触发时机一致；

    touchstart(ev) {},  
    touchmove(ev) {},   
    touchend(ev) {},

    // 拖动事件;
    // ev.delta对象中对应 deltaX / deltaY 两个属性值，该值为拖动事件触发的位移增量，单位为px，表示比上一次触发增加的位移量；

    drag(ev) {},
    dragstart(ev) {},
    dragend(ev) {},

    // 双指缩放事件；
    // ev.delta对象中对应 scale 属性，为缩放事件的缩放增量；

    pinch(ev) {},
    pinchstart(ev) {},
    pinchend(ev) {},

    // 双指旋转事件；
    // ev.delta对象中对应 rotate 属性，为缩放事件的缩放增量；

    rotate(ev) {},
    rotatestart(ev) {},
    rotatend(ev) {},

    // 单指缩放事件；
    // ev.delta对象中对应 scale 属性，为单指缩放事件的缩放增量；

    singlePinch:{
        start(){},
        pinch(){},
        end(){},
        buttonId:null,  // 必需
    },

    // 单指旋转事件；
    // ev.delta对象中对应 rotate 属性，为缩放事件的缩放增量；

    singleRotate:{
        start(){},
        rotate(){},
        end(){},
        buttonId:null,  // 必需
    },
})
```

#### 业务方控制的逻辑；

通过 `ev.delta` 暴露的运动增量来进行元素的操作；

```js
// 元素状态的保存；
let transform = {
    x:0,
    y:0,
    scale:1,
    rotate:0
}

new MTouch({
    receiver:'selector',
    operator:'selector',
    drag(ev) {
        transform.x += ev.deltaX;
        transform.y += ev.deltaY;

        $(el).css('transform',
                `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`);
    }
})

```

#### API；

##### 1.`switchOperator`

`mtouch.switchOperator(el)`;

该方法适用于切换操作元素 `operator`以改变单指缩放的基点,例如：

    ```js
    $('.js-el').on('tap',function(){
        $('.js-el').removeClass('active');
        $(this).addClass('active');
        mtouch.switchOperator(this);
    })
    ```

##### 2.`on/off`:

`mtouch.on(evName,handler) / mtouch.off(evName,handler)`;

该方法可以用在实例化后，添加或删除某个事件的回调，例如：

    ```js
    mtouch.on('drag',(ev)=>{
        console.log(ev);
    })
    ```
