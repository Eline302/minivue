class Vue {
    constructor(options) {
        // 1.通过属性保存选项的数据
        this.$option = options || {}
        this.$data = options.data || {}
        // el是对象或者选择器
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        //2.把data中属性转换成getter和setter,注入到vue中
        this._proxyData(this.$data)
        //3.调用observer对象，监听数据的变化
        new Observer(this.$data)
        // 4.调用compiler对象，解析指令和差值表达式
        new Compiler(this)
    }
      // 约定 _ 开头，为私有属性
      // 代理数据，即让 Vue 代理data中的属性
    _proxyData(data) {
        // 遍历data中的所有属性
        Object.keys(data).forEach( key => {
            // 把data的属性注入到vue实例中
            Object.defineProperty( this, key,{
                enumerable: true,
                configurable: true,
                get(){
                    return data[key]
                },
                set(newvalue){
                    if(data[key] === newvalue){
                        return
                    }
                    data[key] = newvalue
                }
            })
        })
    }
}