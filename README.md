## 目录
* [小程式登录](#小程式登录)
  * [授权登录](#授权登录)
  * [查看登录用户信息](#查看登录用户信息)
  * [上传头像](#上传头像)
  * [新建教师信息](#新建教师信息)
  * [更改教师信息](#更改教师信息)
  * [上传二维码](#上传二维码)
  * [更改证书](#更改证书)
  * [更改视频](#更改视频)

* [教育后台](#教育后台)
  * [管理登录](#管理登录)
  * [新增物品](#新增物品)
  * [获取商城物品列表](#获取商城物品列表)
  * [获取单个商品详情](#获取单个商品详情)
  * [修改单个商品详情](#修改单个商品详情)



## 小程式登录
### 授权登录
```js
  POST    http://localhost:?/session?iv=${iv}&code=${code}&encryptedData=${encryptedData}&raw=${raw}
```
```js
{
  iv: ${iv},    //require
  code: ${code},    //require
  encryptedData: ${encryptedData},    //require
  raw: ${raw}
}
```
### 查看登录用户信息
```js
  GET    http://localhost:?/music/user?token=${token}
```

### 上传头像
```js
  POST    http://localhost:?/music/uploadimg?token=${token}
```
```js
// 上传头像 key: 'music/imgs'
```
### 新建教师信息
```js
  POST    http://localhost:?/music/teacher/new?token=${token}
```
```js
{
  lat: ${lat},    //纬度(Number)
  lng: ${lng},    //经度(Number)
  realName: ${realName},    //真实姓名(String)
  gender: ${gender},    //性别(Number)
  introduction: ${introduction},    //自我介绍(String)
  labels: ${labels},    //标签(Array)
  img: ${img}
}
```
### 更改教师信息
```js
  POST    http://localhost:?/music/teacher/change?token=${token}
```
```js
{
  lat: ${lat},    //纬度(Number)
  lng: ${lng},    //经度(Number)
  realName: ${realName},    //真实姓名(String)
  gender: ${gender},    //性别(Number)
  introduction: ${introduction},    //自我介绍(String)
  show: ${show},    //展示(Boolean)
  addlabel: ${addlabel},    //添加1个标签(String)
  rdulabel: ${rdulabel}    //删减1个标签(String)
  // 上传头像 key: 'music/imgs'
}
```
### 上传二维码
```js
  POST    http://localhost:?/music/teacher/change/rqcode?token=${token}
```
```js
{
  // 上传二维码图片 key: 'music/rqcodes',覆盖原有
}
```
### 更改证书
```js
  POST    http://localhost:?/music/teacher/change/cert?token=${token}
```
```js
{
  rducertUrl: ${rducertUrl}    //删减1个证书(String)
  // 上传头像 key: 'music/certs'
}
```
### 更改视频
```js
  POST    http://localhost:?/music/teacher/change/video?token=${token}
```
```js
{
  rduvideoUrl: ${rduvideoUrl}    //删减1个视频(String)
  // 上传头像 key: 'music/videos'
}
```


## 教育后台

### 管理登录
```js
  POST    http://localhost:?/login
```
```js
{
  adminName: ${adminName},
  passWord: ${passWord}
}
```

### 新增物品
#### 上传图片
```js
  POST    http://localhost:?/admin/goods/create/images?token=${token}
```
```js
// key: 'adminmusic/images'
```
#### 清空图片
```js
  GET    http://localhost:?/admin/goods/create/images/empty?token=${token}
```
#### 添加物品
```js
  POST    http://localhost:?/admin/goods/create?token=${token}
```
```js
{
  title: ${title},    //标题(String)
  point: ${point},    //积分(Number)
  text: ${text},    //商品详情(String)
  defaultState: ${defaultState}    //默认上下架['true'上架，'false'下架](Boolean)
}
```
### 获取商城物品列表
```js
  GET    http://localhost:?/admin/goods/list?token=${token}
```
### 获取单个商品详情
```js
  GET    http://localhost:?/admin/goods/list/one?goodsid=${goodsid}&token=${token}
```
### 修改单个商品详情
```js
  POST    http://localhost:?/admin/goods/change/one?token=${token}
```
```js
{
  goodsId: ${goodsId},    //(String)
  title: ${title},    //(String)
  point: ${point},    //(Number)
  text: ${text},    //(String)
  state: ${state},    //(Boolean)
  //delgoods: ${delgoods}    //删除(Boolean),和 goodsId 一起
}
```


