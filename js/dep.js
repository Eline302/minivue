class Dep {
    constructor (){
    //  存储所以观察者
        this.sub = []
    }
    // 添加观察者
    addSub(sub){
        if(sub && sub.update){
            this.sub.push(sub)
        }
    }
    // 发布通知
    notify(){
        // 遍历所有观察者，调用每一个观察者的update方法，更新视图
        this.sub.forEach(sub=>{
            sub.update()
        })
    }
}