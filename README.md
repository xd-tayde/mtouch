# MTouch.js

> [demo](http://f2er.meitu.com/gxd/mtouch/example/index.html)

> [github](https://github.com/xd-tayde/mtouch)

### Introduction

**[中文版](./README_ZH.md)**

MTouch is a modern JavaScript mobile touch gesture library. It's simple, convenient and only 9k.

The library support 5 kinds of gesture.

- drag
- pinch
- rotate
- **singlePinch**
- **singleRotate**

> Tips:Single finger operation is so useful as practice confirms.

### event

all the event you can bind:

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

### Installation

- You can download the latest version from the [GitHub](https://github.com/xd-tayde/mtouch/blob/master/dist/mtouch.min.js);

- use a npm [CDN](https://unpkg.com/mtouch@3.0.4/dist/mtouch.min.js).

- or install via npm:

```js
	npm install mtouch --save
```

### Basic usage

```js
let mt = new MTouch(selector);
// bind the drag event；
mt.on('drag',e => {

});

// bind the singlePinch. but there must be a operator that is the element which you want to operate;
mt.on('singlePinch', e =>{

} , operator);

```

### Example

You can operate the element via the `ev.delta`(incremental motion) in callback's params;

```js
// the global transform to store the state of ele;
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

### API

#### 1.`switch`

`mtouch.switch(el,addButton)`;

Switch the operator to change the basepoint that will be used in singlePinch or singleRotate's calculation.

params:

	// the element want to operate;
	el: type: string or HTMLElement,
		optional;
		default: the el on create the instance;


	// whether you want to add a button when use single gesture.
	addButton: type: boolean,
				 optional,
				 default:true;

#### 2.`on/off`

`mtouch.on(evName,handle,operator) / mtouch.off(evName,handler)`;

bind the event callback;

```js
mtouch.on('drag',(ev)=>{
    console.log(ev);
})
```

the ev of callback is:

```js
ev = {
	origin:TouchEvent,
	eventType:'drag',
	delta:{
		deltaX : 1,
		deltaY : 1,
	}
}

```

#### 3.`destroy`

`mtouch.destroy()`;

unbind all the event that has band on el;
