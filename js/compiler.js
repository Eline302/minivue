class Compiler {
    constructor(vm){
       // 记录模板
       this.el = vm.$el
       // 记录vue实例
       this.vm = vm
       // 创建compiler实例时候会立即调用compile方法
       this.compile(this.el)
    }
    // 编译模板，处理文本节点和元素节点
    compile(el) {
        // 获取元素的节点   
        let childNodes = el.childNodes
        // 处理el第一层子节点
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)){
                // 处理文本节点
                this.compileText(node)
            }else if(this.isElementNode(node)){
                // 处理元素节点
                this.compileElement(node)
            } 
        // 判断node节点，是否有子节点，如果有子节点，要递归调用compile处理深层的子节点
        if(node.childNodes && node.childNodes.length){
            this.compile(node)
            }
        })
    }
    // 编译文本节点，处理差值表达式 {{ msg }}
    compileText(node) {
        // console.dir(node); 以对象的形式打印
        // {{ msg }}
        // . 匹配任意的单个字符，不包括换行
        // + 匹配前面修饰的字符出现一次或多次
        // ? 表示非贪婪模式，即尽可能早的结束匹配
        // 在正则表达式中，提取某个位置的内容，即添加()，进行分组        
        const reg = /\{\{(.+?)\}\}/ // 括号包裹的内容即为要提取的内容
        let value = node.textContent
        if(reg.test(value)){
            // 使用RegExp的构造函数，获取第一个分组的内容，即.$1,除去空格
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key] )
            // 创建watcher对象，当数据改变更新视图
            new Watcher(this.vm, key, (newValue)=>{
                node.textContent = newValue
            })
        }
    }
    // 编译元素节点，处理指令 v-text
    compileElement(node){
        // 获取属性的节点并遍历
        Array.from(node.attributes).forEach( attr =>{
            // 获取属性名
            let attrName =attr.name
            // 判断是否是指令
            if(this.isDirective(attrName)) {
                // v-text ==> text
                attrName = attrName.substr(2)
                // 获取属性的值，即为data定义属性的字段名称
                let key = attr.value
                // 根据不同指令做不同操作
                this.update(node, key, attrName)
            }
        })
    }
    // 调用指令的方法    
    update(node, key, attrName){
        // 获取指令对应的方法
        let updateFn = this[`${attrName}Updater`]
        updateFn && updateFn.call(this, node, key, this.vm[key])
    }
    // v-text指令操作
    textUpdater(node, key, value){
        node.textContent = value
        new Watcher(this.vm, key, (newValue)=>{
            node.textContent = newValue
        })
    }
    // v-model指令操作
    modelUpdater(node, key, value){
        node.value = value
        console.log(node);
        new Watcher(this.vm, key, (newValue)=>{
            node.value = newValue
        })
        // 双向绑定
        addEventListener('input',()=>{
            this.vm[key] = node.value
        })
    }
    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}