class Watcher{
    constructor(vm, key ,callback){
        this.vm = vm
        // data中的属性名称
        this.key = key 
        // 负责更新视图
        this.callback = callback
        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get方法，在get方法中会调用addSub()添加watcher
        this.oldValue = vm[key]
        // 防止重复添加
        Dep.target = null
    }
    // 当数据发生变化的时候更新视图
    update(){
        let newValue = this.vm[this.key]
        if(newValue === this.oldValue){
            return 
        }
        this.callback(newValue)
    }
}