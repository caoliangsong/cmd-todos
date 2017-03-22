var path = require('path')
var dataUrl = path.resolve(__dirname ,'./data.json')
var fs = require('fs')
var colors = require('colors')

var CmdTodos = {
    get:function(status){
        var data = this._getData()
        var doneData = []
        var todoData = []
        data.forEach(function(item,index){
            if(!item.done){
                todoData.push(item)
            }else{
                doneData.push(item)
            }
        })
        if(status === 'todo' || status === undefined){
            console.log('todo >>>'.grey)
            todoData.forEach(function(item,index){
                console.log(`${item.id}: ${item.content}(${item.time})`.green)
            })
        }
        if(status === 'done' || status === undefined){
            console.log('done >>>'.grey)
            doneData.forEach(function(item,index){
                console.log(`${item.id}: ${item.content}(${item.time})`.gray.underline)
            })
        }

        if(status !== undefined && status !== 'done' && status != 'todo'){
            throw new Error('wrong params')
        }
    },
    add:function(content){
        var data = this._getData()
        data.push({
            id:data.length+1,
            content:content,
            done: false,
            time:new Date().toLocaleString().slice(0,10)
        })

        this._setData(data)


    },
    done:function(id,status){
        var status = status === undefined ? true : false;
        var data = this._getData()
        data.forEach(function(item,index){
            if(item.id === id) item.done = status
        })
        this._setData(data)

    },
    undone:function(id){
        this.done(id,false)
    },
    del:function(id){
        var data = this._getData()
        data.forEach(function(item,index){
            if(item.id === parseInt(id)) {
                data.splice(index,1)
            }
        })
        this._setData(data)
    },
    clear:function(){
        this._setData([])
    },
    _getData:function(){
        return JSON.parse(fs.readFileSync(dataUrl,'utf-8'))
    },
    _setData:function(data){
        fs.writeFileSync(dataUrl,JSON.stringify(data),'utf-8')
        this.get();
    }
    
}




module.exports = CmdTodos