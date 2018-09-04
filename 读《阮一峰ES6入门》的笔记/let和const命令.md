### let

+ `let` 为js带来了块级作用域
+ `let` 不存在变量提升，如果在用`let`声明的变量之前访问该变量，会报错 ReferenceError
+ 暂时性死区。只要块级作用域内存在 `let` 命令，它所声明的变量就“绑定”这个区域，不再收外部的影响

```
var n = 1;
if(true){
    n = 10; // ReferenceError
    let n;
}
```

> ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

“暂时性死区”也意味着`typeof`不再是一个百分之一百安全的操作
```
typeof x; // ReferenceError
let x;
```
在`let`出现之前，利用`typeof`检测一个未声明的变量时，不会报错，而是返回`undefined`；所以也提醒我们，变量一定要在声明之后再使用。

> 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。


### const

+ `const`声明一个只读的常量。这也意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。
+ `const`也存在暂时性死区。
+ `const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个**内存地址**所保存的数据不得改动。

对于简单类型的数据类型（数值、字符串、布尔），等同于常量；

但对于复合类型的数据（对象、数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证指针是固定的，而不能保证指向的数据结构不变。因此，讲一个对象声明为常量必须非常小心。

```
①
cosnt person = {};

person.name = 'Tom';
console.log(person.name); // Tom

②
const arr = [];
arr.push('hello'); // 可行
arr.length = 0; // 可行

arr = ['world']; // 报错
```
用`const`声明对象或数组后，对其进行属性的操作是可以的，但再次进行赋值则不行。


如果真的想将对象冻结，可使用`Object.freeze`方法。

```
const person = Object.freeze({});

person.name = 'Tom'; // 常规模式下，不起作用；严格模式下报错
```

除了将对象本身冻结，对象的属性也应该冻结。

```
let constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach( (key, index)=>{
        if(typeof obj[key] === 'object'){
            constantize( obj(key) )
        }
    })
}
```

### ES6 声明变量的6种方法

ES5 只有两种声明变量的方法：`var`命令和`function`，命令。
ES6 除了`let`和`const`外，还有`import`和`class`命令。
