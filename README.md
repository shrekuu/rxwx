# rxwx

> **如果你电脑编译挺快并且也不想让最终包包含整个 rxjs 的话, 推荐直接 npm 安装最新的 rxjs, 自己将一些 api 封装为 Observable 使用.**

_克隆自仓库 https://github.com/yalishizhude/RxWX 然后升级 rxjs 到 6.5.3 umd 版本. 升级了一下打包工具, 更新了一下 readme.md 里这些示例. 重新发包到 npmjs.org

封装了[RxJS](http://cn.rx.js.org/manual/overview.html)对象[微信小程序 API](https://mp.weixin.qq.com/debug/wxadoc/dev/api/)，让你写出更优雅更简介的代码。

RxWX 模块支持所有微信小程序中 wx 对象的属性和函数，例如`getUserInfo`等。
RxWX 模块的`Rx`属性为 RxJS 对象，支持 RxJS 对象所有属性，例如`Observable`等。

# 安装

1. 安装依赖

`npm i rxjs6-wx`

2. 引用文件

`import rxwx from 'rxjs6-wx'`

也可将 `operators` 从 `rxjs` 单独引入 `import { operators } from 'rxjs6-wx/rx'`, 不单独引入的话就这样 `rxwx.Rx.operators.map(...)` 用.

不要直接 `npm install rxjs`, 那样小程序就太大了

## 同步函数

```js
// 原写法
try {
  let result = wx.removeStorageSync('xx')
  console.log(result)
} catch(e) {
  console.error('小程序API发现错误')
}

// 使用RxWX，rxwx对象具有wx对象的所有函数和属性，函数返回Observable对象
// 下面示例中省略这行
import rxwx from 'rxjs6-wx'

rxwx.removeStorageSync('xx').pipe(
  operators.catchError(e => console.error('rxwx发现错误'))
  // 或独立引入 operators: import { operators } from '../rxjs6-wx/rx'
  // rxwx.Rx.operators.catchError(e => console.error('rxwx发现错误'))
  ).subscribe(
    resp => console.log(resp)
  )
```

## 异步函数

```js
// 原写法
wx.removeStorage({
  key: 'xx',
  success: function(res) {
    console.log(res)
  },
  error: function(e) {
    console.error('小程序API发现错误')
  }
})

// 引用RxWX，rxwx对象函数参数与wx同名函数一致
rxwx.removeStorage({key: 'xx'}).pipe(
    operators.catchError(e => console.error('rxwx发现错误'))
    ).subscribe(
      resp => console.log(resp)
    )
```

## 异步嵌套

```js
// 调用小程序原生API
wx.login({
  success(res) {
    wx.getUserInfo({
      success(res) {
        console.log(res.userInfo)
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  fail(e) {
    console.error(e)
  }
})

// 调用RxWX
rxwx.login().switchMap(
    () => rxwx.getUserInfo()
  ).pipe(
    operators.catchError(e => console.log(e))
  ).subscribe(
    res => console.log(res.userInfo)
  )
```

## 异步合并

```js
// 调用小程序API
let getUser =  new Promise((success, fail) => {
  wx.getUserInfo({
    success,
    fail
  })
})
let getSystem =  new Promise((success, fail) => {
  wx.getSystemInfo({
    success,
    fail
  })
})
Promise.all([getUser, getSystem])
.then((resp) => console.log(resp), e => console.error(e))

// 调用RxWX中的Rx对象，包含RxJS所有操作符和函数
// 使用zip操作符
Rx.Observable.zip(
    rxwx.getUserInfo(),
    rxwx.getSystemInfo()
  ).pipe(
    operators.catchError(e => console.log(e))
  ).subscribe(
    resp => console.log(resp)
  )
```

## 网络请求

### http 请求

```js
let handlerA = (res) => console.log('handler a:', res)
let handlerB = (res) => console.log('handler b:', res)
// 调用小程序API
let url = 'http://localhost:3456'
wx.request({
  url,
  success(res) {
    // 逻辑与请求的紧耦合
    handlerA(res)
    handlerB(res)
  }
})

// 调用RxWX
let req = rxwx.request({
  url
})
// 轻轻松松将业务逻辑与请求分离
req.subscribe(handlerA)
req.subscribe(handlerB)
```

### websocket

```js
let url = 'ws://localhost:34567'
// 调用微信小程序API
let ws = wx.connectSocket({
  url
})
ws.onOpen(() => {
  ws.send({ data: new Date })
  ws.onMessage(msg => console.log(msg.data))
  ws.close()
  ws.onClose(msg => console.log('Websocket closed.'))
})
// 调用RxWX
rxwx.connectSocket({
  url
})
.subscribe(ws => {
  ws.onOpen(() => {
    ws.send({ data: new Date })
    ws.onMessage(msg => console.log(msg.data))
    ws.close()
    ws.onClose(msg => console.log('Websocket closed.'))
  })
})
```

## 事件绑定

```js
import rxwx from '../../utils/RxWX.js'
// 页面对象
let page ={
  data: {
    // 页面数据...
  },
  onLoad: function () {
    // 页面初始化
  },
}
// 使用fromEvent绑定事件，返回Observable对象
rxwx.fromEvent(page, 'bindViewTap')
  .debounceTime(1000)  // 防抖
  .switchMap(() => rxwx.navigateTo({
    url: '../logs/logs'
  }))  // 页面跳转
  .subscribe()
// 初始化页面逻辑
Page(page)
```


