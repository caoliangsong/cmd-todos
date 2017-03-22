# cmd-todos
a todo list in command line 

# install
```
npm install cmd-todo -g
```

# how to use

## in nodejs

```
var todo = require('cmd-todo')
todo.get()

```
## in command line

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


