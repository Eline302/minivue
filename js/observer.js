class Observer {
    constructor(data){
        this.walk(data)
    }
    walk(data){
        // 1.判断data是否是对象
        if( !data || typeof data !== 'object'){
            return
        }
        // 2.遍历data对象的所有属性，调用defineReactive方法
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
      // 调用 Object.defineProperty() 将data中的属性转换为 getter / setter
    defineReactive(data,key,val){
        let that = this // observer实例
        // 负责收集依赖并发送通知
        let dep =new Dep()
        // 如果val是对象，把val内部的属性转换成响应式数据
        that.walk(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get(){
                // 收集依赖 target中存储的是watcher对象
                Dep.target && dep.addSub(Dep.target)
                // 此处不可以写成 obj[key]，否则会发生死递归
                // 这里使用闭包，扩展了val变量的作用域
                return val
            },
            set(newvalue){
                if(newvalue === val){
                    return
                }
                val = newvalue
                // 如果newValue是对象，把newValue内部的属性转换成响应式数据
                // 在function内部会开启一个新的作用域，this的指向会发生变化此处的this指向data对象
                that.walk(newvalue)
                // 发送通知
                dep.notify()
            }
        })
    }
}