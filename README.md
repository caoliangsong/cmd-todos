# cmd-todo
```
a todo list in command line 
新增网络保存todo数据
新增用户注册
```
# Install
```
npm install cmd-todo -g
```

# How to use
cmd-todo -h
## Work at command line

### When first use, auto register new user

```
cmd-todo get 
```
get all list

```
cmd-todo get done
```
get done list
```
cmd-todo get undone
```
get undone list

```
cmd-todo add xxx 
```
add xxx to  list

```
cmd-todo done xxid
```
set id=xx done

```
cmd-todo undone  xxid
```
set id=xx undone


## 权限问题
```
(node:34715) UnhandledPromiseRejectionWarning: Error: EACCES: permission denied, open '/usr/local/lib/node_modules/cmd-todo/src/account.json'

需要设置cmd-todo的写入权限
 sudo chmod -R 777 /usr/local/lib/node_modules/cmd-todo/      
```
