export default class HandlerBus{
    constructor(el) {
        this.handlers = [];
        this.el = el;
    }
    add(handler){
        this.handlers.push(handler);
        return this;
    }
    del(handler){
        if(!handler){
            this.handlers = [];
        }else{
            this.handlers.forEach((value,index)=>{
                if(value === handler){
                    this.handlers.splice(index,1);
                }
            });
        }
        return this;
    }
    fire(){
        if(!this.handlers || !this.handlers.length === 0)return;
        this.handlers.forEach(handler=>{
            if(typeof handler === 'function') handler.apply(this.el, arguments);
        });
        return this;
    }
}
