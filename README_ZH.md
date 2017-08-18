# MTouch.js

> [demo](http://f2er.meitu.com/gxd/mtouch/example/index.html)

> [github](https://github.com/xd-tayde/mtouch)

### 更新日志

- 3.0.7
	- 提高单指缩放的按钮层级为9999；

- 3.0.6
	- 修复了数组结构语法导致的ios报错问题；

- 3.0.5
	- 增加内嵌`css`，内置`base64`缩放按钮图标；
	- 更新英文版文档；

- 3.0.4
	- `singlePinch`抛出的事件对象中增加两个增量参数:

		```js
			ev = {
				origin: TouchEvent,
				delta:{
					scale:1,
					deltaX:1,  // x轴方向上的运动增量
					deltaY:1,	 // y轴方向上的运动增量
				}，
				eventType:'singlePinch',
			}
		```

- 3.0.3
	- 为 `switch` 方法增加 `addButton` 参数，便于外部更精准灵活地控制按钮的添加；

- 3.0.2
	- 去除绑定单指手势时，如果不传入`operator`的警告，把绑定时不传入，再通过`switch`进行控制纳入常规的使用方式，同时使 `switch` 函数接受空值/`null`等非值；
	- 美化代码，增加一些基础函数的提取；
	- 修改 `example`示例；

- 3.0.0
	- 简化插件整体的使用思路及复杂度；
	- 修改初始化创建实例的方式，去除初始化时直接绑定事件；
	- 小幅修改 `API`；

- 2.2.6
	- 修改单指缩放旋转参数，buttonId ---> button，对应使用class，以兼容多个按钮的存在；

- 2.2.2
	- 新增可传入 operator = ''，这样可以更方便的进行实例化；

- 2.2
	- 新增直接执行函数的使用方式，修改构造函数的方式；
	- 新增初始化参数的多态判断，可直接使用字符串传入 receiver 与 operator;

- 2.1
	- 新增销毁api，mtouch.destroy(); 可解除所有绑定事件；

- 2.0
	- 剥离了业务逻辑，优化代码；
	- 调整单指缩放和单指旋转的使用方式，更为清晰，方便；
	- 新增对一些错误用法的容错和提示；



### 简介

该手势库是以我们业务中常用的贴纸类型做为基础，进行进一步的封装抽象，更贴近我们业务，更加便于使用，更加轻量以及有更好的业务定制性，大家有业务上的需求时，可随时联系我；该库去除了一些比较少用到的手势，使代码更加精简和轻量，没有依赖，压缩后大小为9K；

支持5种手势:

> 1. **拖动事件**：`drag`
> 2. **双指缩放**：`pinch`
> 3. **双指旋转**：`rotate`
> 4. **单指缩放**：`singlePinch`
> 5. **单指旋转**：`singleRotate`

#### 事件

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

### 安装

- 你可以直接在[GitHub](https://github.com/xd-tayde/mtouch/blob/master/dist/mtouch.min.js)上下载最近版本的代码；

- 使用npm官方的[CDN](https://unpkg.com/mtouch@3.0.4/dist/mtouch.min.js)；

- 直接使用npm安装：

```js
npm install mtouch --save
```

### 使用:

由于对单个元素的操作中，存在着一些无法避免的问题，例如双指操纵元素时单指先离开；单指先触发后，又变换成双指操作；一个在元素上，一个在元素外等等，这些问题会影响到基础手指的确定，会导致操作过程中元素可能出现 **跳动** ；

因此更加推荐 **使用委托** 的方式进行操作元素，能有效的 **避免上述问题**；

如果直接绑定到元素上，则需注意对 **每个需要操作的元素单独创建一个实例**；

```js
let mt = new MTouch(selector);
// 绑定拖动事件；
mt.on('drag',e => {

});

// 绑定单指缩放事件；单指事件需要指定对应的元素的选择器;
mt.on('singlePinch', e =>{

} , operator);

```

#### 例子

通过 `ev.delta` 暴露的运动增量来进行元素的操作；

```js
// 元素状态的保存；
let transform = {
    x:0,
    y:0,
    scale:1,
    rotate:0
}

MTouch('selector', ev => {
   transform.x += ev.deltaX;
        transform.y += ev.deltaY;

    $(el).css('transform',
            `translate3d(${transform.x}px,${transform.y}px,0px) scale(${transform.scale}) rotate(${transform.rotate}deg)`);
});

```

#### API；

##### 1.`switch`

`mtouch.switch(el，addButton)`;

该方法适用于切换操作元素 `operator`以改变单指缩放的基点,例如：
params:
>	el : 切换到的元素；
>
>	addButton: 是否需要添加单指操作按钮；


```js
$('.js-el').on('tap',function(){
    $('.js-el').removeClass('active');
    $(this).addClass('active');
    mtouch.switchOperator(this);
})
```

##### 2.`on/off`:

`mtouch.on(evName,handler,operator) / mtouch.off(evName,handler)`;

该方法可以绑定或解绑某个事件的回调，例如：

```js
mtouch.on('drag',(ev)=>{
    console.log(ev);
})
```
> tips: 需要绑定单指事件时，需要传入对应的元素，否则会以 `touch` 盒子的中心作为基础点进行计算，数值会有误；

##### 3. `destroy`:

    mtouch.destroy();

解除所有事件绑定；
