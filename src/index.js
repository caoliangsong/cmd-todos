var path = require('path')
var dataUrl = path.resolve(__dirname, './data.json')
var fs = require('fs')
var colors = require('colors')
var ora = require("ora")
const spinners = ora("Loading...");

var AV = require('./online').AV
var formatDate = require('./online').formatDate

// 判断权限
var accoutFile = path.resolve(__dirname, './account.json')
var accout = fs.readFileSync(accoutFile, { encoding: 'utf-8' })
accout = JSON.parse(accout || '{}');

// 每行显示最大字数
const MAX_LENGTH = 80


// 声明 class
const Todo = AV.Object.extend('Todo');
const MyUser = AV.Object.extend('MyUser');


/**
 * 计算字符串的实际长度
 * @author caols@bsoft.com.cn
 * @date 2020-12-03
 * @param {any} str
 * @returns {any}
 */
function byteLength(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128)
            realLength += 1;
        else
            realLength += 2;
    }
    return realLength;
};

/**
 * 数据取于网络
 */

var CmdTodos = {
    todoData: [],
    doneData: [],
    /**
     * 获取待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @param {any} status
     * @returns {any}
     */
    get: function (status) {
        this._getData().then(data => {
            var doneData = []
            var todoData = []
            data.forEach(function (item, index) {
                if (item.attributes.status == 'todo') {
                    todoData.push(item)
                } else {
                    doneData.push(item)
                }
            })

            this.todoData = todoData
            this.doneData = doneData


            console.log(`cmd-todo:待办项目 >>>${todoData.length}条                `.red.inverse)
            todoData.forEach(function (item, index) {
                var len = byteLength(item.attributes.content)
                len = index < 9 ? len - 1 : len
                console.log(`${index + 1}:${item.attributes.content}${' '.repeat(MAX_LENGTH - len)}${formatDate(item.createdAt)}`.red)
            })

            console.log(`cmd-todo:已办项目 >>>${doneData.length}条                `.grey.inverse)
            doneData.forEach(function (item, index) {
                var len = byteLength(item.attributes.content)
                len = index < 9 ? len - 1 : len
                console.log(`${index + 1}: ${item.attributes.content}${' '.repeat(MAX_LENGTH - len)}${formatDate(item.createdAt)}`.gray)
            })
        })

    },

    /**
     * 增加待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @param {any} content
     * @returns {any}
     */
    add: function (content) {
        // 构建对象
        const todo = new Todo();
        todo.set('status', 'todo');
        todo.set('content', content);
        todo.set('mobile', accout.username)
        // 将对象保存到云端
        todo.save().then((todo) => {
            console.log(`保存成功。objectId：${todo.id}`);
            this.get()
        });
    },


    /**
     * 完成待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @param {any} id
     * @param {any} status
     * @returns {any}
     */
    done: function (id, status) {
        this._getData('todo').then(d => {
            var status = status === 'todo' ? 'done' : 'todo';
            const todo = AV.Object.createWithoutData('Todo', d[id - 1].id);
            todo.set('status', 'done')
            todo.save().then(() => this.get())
        })
    },


    /**
     * 激活待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @param {any} id
     * @returns {any}
     */
    undone: function (id) {
        this.done(id, false)
    },

    /**
     * 删除单个待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @param {any} id
     * @returns {any}
     */
    del: function (id) {
        this._getData('todo').then(d => {
            var status = status === 'todo' ? 'done' : 'todo';
            const todo = AV.Object.createWithoutData('Todo', d[id - 1].id);
            todo.set('status', 'done')
            todo.save().then(() => this.get())
        })
    },

    /**
     * 清空所有项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @returns {any}
     */
    clear: function () {
        this.get([])
    },

    /**
     * 获取所有待办项目
     * @author caols@bsoft.com.cn
     * @date 2020-11-26
     * @returns {any}
     */
    _getData: function (status = "") {
        spinners.start()
        const query = new AV.Query('Todo');
        query.equalTo('mobile', accout.username)
        if (status) {
            query.equalTo('status', status)
        }
        const promise = new Promise((resolve, reject) => {
            query.find().then((todos) => {
                spinners.succeed('网络数据获取成功！')
                resolve(todos)
            }).catch(err => reject(err))
        })
        return promise;
    },

    checkRepeatUser: function (mobile) {
        const userQuery = new AV.Query('MyUser');
        userQuery.equalTo('mobile', mobile);
        const promise = new Promise((resolve, reject) => {
            userQuery.find().then((todos) => {
                if (todos && todos.length > 0) {
                    console.log('>该手机号已经被注册!'.red.inverse)
                    return resolve(todos.length)
                }
                console.log('>恭喜您手机号未注册，请继续输入密码'.green)
                resolve(0)
            }).catch(err => reject(err))
        })
        return promise;
    },

    login: function (mobile, password) {
        const userQuery = new AV.Query('MyUser');
        userQuery.equalTo('mobile', mobile);
        userQuery.equalTo('password', password);
        const promise = new Promise((resolve, reject) => {
            userQuery.find().then((todos) => {
                if (todos && todos.length > 0) {
                    console.log('>登录成功!'.green)
                    return resolve(todos.length)
                }
                console.log('>登录失败!用户名或密码错误！'.red.inverse)
                resolve(0)
            }).catch(err => reject(err))
        })
        return promise;
    },

    registerUser: function (mobile, password) {
        spinners.start()
        const myUser = new MyUser();
        myUser.set('mobile', mobile);
        myUser.set('password', password);
        const promise = new Promise((resolve, reject) => {
            myUser.save().then((todos) => {
                spinners.succeed('注册新用户成功，已经自动登录，尝试运行cmd-todo add foo')
                resolve(1)
            }).catch(err => reject(err))
        })
        return promise;
    }





}

module.exports = CmdTodos