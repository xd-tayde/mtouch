# MTouch通用移动端手势库1.0

> demo地址: [摸](http://f2er.meitu.com/gxd/mtouch/dist/index.html)

> 源码地址: [摸](https://gitlab.meitu.com/npm/MTouch)

> 代码下载: [摸](http://f2er.meitu.com/gxd/mtouch/dist/js/mtouch.min.js)

### 简介

该手势库是以我们业务中常用的贴纸类型做为基础，进行进一步的封装抽象，更贴近我们业务，更加便于使用，更加轻量以及有更好的业务定制性，大家有业务上的需求时，可随时联系我；该库去除了一些比较少用到的手势，使代码更加精简和轻量，没有依赖，压缩后大小为8K；

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

let Mtouch = required('@meitu/mtouch')
```


##### 2.使用`import || required`直接引入;

```js
import MTouch from './mtouch.min'

new MTouch( options )

```

##### 3.直接通过`script`标签引入,挂载在全局 **MTPlugin.MTouch** 下;

```js
<script src="mtouch.min.js"></script>

new window.MTPlugin.MTouch( options )

```

#### 使用:

由于对单个元素的操作中，存在着一些无法避免的问题，例如双指操纵元素时单指先离开；单指先触发后，又变换成双指操作；一个在元素上，一个在元素外等等，这些问题会影响到基础手指的确定，会导致操作过程中元素可能出现 **跳动** ；

因此更加推荐 **使用委托** 的方式进行操作元素，既能有效的 **避免上述问题** ，同时也可以对 **移动范围进行限制** ；

如果特殊情况下需要直接绑定到元素上，则需注意对 **每个需要操作的元素单独创建一个实例** ，以避免各个元素之间的运动状态相互侵染，因为每个实例中存储着元素的运动操作状态；

```js
new MTouch({

    // 事件监听元素，用于监听所有事件产生；必填；

    receiver:'.className',

    // 事件操纵元素，用于反馈事件所的操作；
    // 该值为可选，如果不填，则操纵元素即为监听元素本身；

    operator:'.className',  

    // 当使用父级委托的方式时，则可以通过该参数对操纵元素的移动范围进行限制；
    // 对象中的4个参数均为可选，当没有时，则表示不对该操作进行限制；

    // Tips：只有直接使用。ev.setTransform() 方法进行操作时，该值才有效果；

    limit:{

        // 水平方向的移动范围，可移出的范围 = operator.width * limit.x;
        x : Number,

        // 竖直方向的移动范围，可移出的范围 = operator.height * limit.y;
        y : Number,

        // 最小缩放系数；
        minScale : 0 ~ 1,

        // 最大缩放系数；
        maxScale : Number
    },

    // 可监听的事件；
    // 传入事件回调中的事件对象，有在原生对象的基础上做了层简单的封装；
    // ev = {
    //    origin : 原生事件对象，
    //    eventType : eventName,  对应的事件名称
    //    transform : { x:0,y:0,scale:1,rotate:0 } 元素实例化操作后状态的保存,同时会                以 data-mtouch-status 的属性记录在元素的 dom 上；
    //    delta:{ deltaX/deltaY/scale/rotate } 事件触发产生的增量；
    //    setTransform : 操纵 operator 的封装函数，封装了css的设置与
    //                   data-mtouch-status 的记录；
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

    singlePinch(ev) {},
    singlePinchstart(ev) {},
    singlePinchend(ev) {},

    // 单指旋转事件；
    // ev.delta对象中对应 rotate 属性，为缩放事件的缩放增量；

    singleRotate(ev) {},
    singleRotatestart(ev) {},
    singleRotatend(ev) {},


    // 下面两个值为单指操作时所需要的按钮id，两个按钮可单独拆开，也可合并为一个；

    // 单指旋转按钮对应的id值；
    // 需要单指缩放时，该值为必需，否则会提示错误；

    singleRotateId: null,

    // 单指缩放按钮对应的id值；
    // 需要单指缩放时，该值为必需，否则会提示错误；

    singlePinchId: null,
})

```

#### 业务方控制的逻辑；

1. 可直接使用封装在回调函数中ev对象的 `setTransform()` 方法，例如：

```js
new MTouch({
    receiver:'.className',
    operator:'.className',
    drag(ev) {
        ev.setTransform();  
    }
})

```

该方式会直接使用 `transform` 属性对 `operator` 元素 进行操作，同时记录其状态于 `data-mtouch-status`上; 同时只有使用该方式，才能使范围限制 `limit` 生效；

2. ev对象中同样暴露了 `ev.transform` 的状态参数，也可由业务方直接进行元素的操作，最好同时也将该值以字符串的形式设置在元素的 `data-mtouch-status` 上，这样才能对状态进行记录,在切换元素后获取当前的状态；该方式有利于加强业务方的控制能力，更加灵活；例如：

```js
new MTouch({
    receiver:'.className',
    operator:'.className',
    drag(ev) {
        let transform = ev.transform;

        $(el).css('transform',
                `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`)
        .data('mtouch-status',JSON.stringify(transform));
    }
})

```

3. 也可通过 `ev.delta` 暴露的运动增量来进行操作；

```js
let transform = {
    x:0,
    y:0,
    scale:1,
    rotate:0
}

new MTouch({
    receiver:'.className',
    operator:'.className',
    drag(ev) {
        transform.x += ev.deltaX;
        transform.y += ev.deltaY;

        $(el).css('transform',
                `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`)
        .data('mtouch-status',JSON.stringify(transform));
    }
})

```

#### API；

##### 1.`limitOperator`:

`transform = mtouch.limitOperator(transform)`

该方法为限制范围的函数，可传入 `transform` 对象，函数会返回出一个已加了在初始化 `mtouch`实例传入的 `limit` 参数限制的 `transform` 对象，设置后既会限制元素的操作；

##### 2.`switchOperator`:

`mtouch.switchOperator(el)`;

该方法适用于切换操作元素 `operator`,例如：

    ```js
    $('.js-el').on('tap',function(){
        $('.js-el').removeClass('active');
        $(this).addClass('active');
        mtouch.switchOperator(this);
    })

    ```

##### 3.`on/off`:

`mtouch.on(evName,handler) / mtouch.off(evName,handler)`;

该方法可以用在实例化后，添加或删除某个事件的回调，例如：

    ```js
    mtouch.on('drag',(ev)=>{
        console.log(ev);
    })

    ```
