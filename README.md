## 目录
* [小程式](#小程式)
  * [登录](#登录)
    * [授权登录](#授权登录)
    * [查看登录用户信息](#查看登录用户信息)
    * [上传头像](#上传头像)
    * [新建教师信息](#新建教师信息)
    * [新建学生信息](#新建学生信息)
    * [打卡开工](#打卡开工)
    * [删除身份](#删除身份)
  * [我的](#我的)
    * [更改教师信息](#更改教师信息)
    * [上传二维码](#上传二维码)
    * [更改证书](#更改证书)
    * [更改视频](#更改视频)
    * [自己发布的知识天地列表](#自己发布的知识天地列表)
    * [自己收到的评论](#自己收到的评论)
  * [积分商城](#积分商城)
    * [积分交易](#积分交易)
    * [查看交易凭证](#查看交易凭证)
    * [查看目前积分](#查看目前积分)
    * [查看积分清单](#查看积分清单)
    * [获取物品列表](#获取物品列表)
    * [获取单个物品详情](#获取单个物品详情)
  * [知识天地](#知识天地)
    * [发布一条知识天地](#发布一条知识天地)
    * [获取所有知识天地列表](#获取所有知识天地列表)
    * [获取单个知识天地](#获取单个知识天地)
    * [删除自己单个知识天地](#删除自己单个知识天地)
    * [自己发布评论](#自己发布评论)
    * [删除已发布评论](#删除已发布评论)
  * [音乐沙龙](#音乐沙龙)
    * [发布一条沙龙](#发布一条沙龙)
    * [获取所有沙龙列表](#获取所有沙龙列表)
    * [获取单个沙龙](#获取单个沙龙)
    * [获取自己发布的沙龙](#获取自己发布的沙龙)
    * [获取已有的沙龙模版](#获取已有的沙龙模版)

* [教育后台](#教育后台)
  * [管理登录](#管理登录)
  * [管理商城](#管理商城)
    * [新增物品](#新增物品)
    * [获取商城物品列表](#获取商城物品列表)
    * [获取单个商品详情](#获取单个商品详情)
    * [修改单个商品详情](#修改单个商品详情)
  * [管理知识天地](#管理知识天地)
    * [获取所有知识天地](#获取所有知识天地)
    * [删除单个知识天地](#删除单个知识天地)



# 小程式登录
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
  instrument: ${instrument},    //擅长乐器(String)
  introduction: ${introduction},    //自我介绍(String)
  labels: ${labels},    //标签(Array)
  img: ${img}
}
```
### 新建学生信息
```js
  POST    http://localhost:?/music/student/new?token=${token}
```
```js
{
  realName: ${realName},    //真实姓名(String)
  gender: ${gender},    //性别(Number)
  age: ${age},    //年龄(Number)
  labels: ${labels},    //标签(Array)
  img: ${img}
}
```
### 打卡开工
```js
  GET    http://localhost:?/music/signed?token=${token}
```
### 删除身份
```js
  POST    http://localhost:?/music/relieve?token=${token}
```
```js
{
  relieve: ${relieve}    //身份(String)['teacher'教师, 'student'学生]
}
```



## 我的
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
### 自己发布的知识天地列表
```js
  GET    http://localhost:?/music/knowledge/own?token=${token}
```
### 自己收到的评论
```js
  GET    http://localhost:?/music/knowledge/own/comment?token=${token}
```



## 积分商城
### 积分交易
```js
  POST    http://localhost:?/music/trade/one?token=${token}
```
```js
{
  goodsId: ${goodsId}    //物品ID
}
```
### 查看交易凭证
```js
  GET    http://localhost:?/music/trade/vouchers?token=${token}
```
### 查看目前积分
```js
  GET    http://localhost:?/music/user/integral?token=${token}
```
### 查看积分清单
```js
  GET    http://localhost:?/music/user/integral/situation?token=${token}
```
### 获取物品列表
```js
  GET    http://localhost:?/music/goods/all?token=${token}&state=${state}&per=${per}&page=${page}
  // state: 'sell' 获取全部在售
```
### 获取单个物品详情
```js
  GET    http://localhost:?/music/goods/one?goodsid=${goodsid}&token=${token}
```



## 知识天地
### 发布一条知识天地
```js
  POST    http://localhost:?/music/knowledge/new?token=${token}
```
```js
{
  text: ${text}
}
```
### 获取所有知识天地列表
```js
  GET    http://localhost:?/music/knowledge/whole?token=${token}
```
### 获取单个知识天地
```js
  GET    http://localhost:?/music/knowledge/single?kledgeid=${kledgeid}&token=${token}
```
### 删除自己单个知识天地
```js
  POST    http://localhost:?/music/knowledge/delone?token=${token}
```
```js
{
  kledgeId: ${kledgeId}
}
```

### 自己发布评论
```js
  POST    http://localhost:?/music/knowledge/comment?token=${token}
```
```js
{
  kledgeId: ${kledgeId},    //知识天地ID(String)
  retext: ${retext},    //评论内容(String)
  commentId: ${commentId}    //评论ID(String)    此ID为评论中的objectId, 可选
}
```
### 删除已发布评论
```js
  POST    http://localhost:?/music/knowledge/comment/delone?token=${token}
```
```js
{
  commentId: ${commentId}
}
```



## 音乐沙龙
### 发布一条沙龙
```js
  POST    http://localhost:?/music/salon/new?token=${token}
```
```js
{
  title: ${title},    //主题(String)
  date: ${date},    //日期(String)
  time: ${time},    //时间(String)
  address: ${address},    //举办地点(String)
  content: ${content},    //主要信息(String)
  isFree: ${isFree},    //免费(Boolean)
  isOpen: ${isOpen},    //公开(Boolean)
  modle: ${modle},    //模版，可选(String)
  phone: ${phone}    //(Number)
}
```
### 获取所有沙龙列表
```js
  GET    http://localhost:?/music/salon/all?token=${token}
```
### 获取单个沙龙
```js
  GET    http://localhost:?/music/salon/one?salonid=${salonid}&token=${token}
```
### 获取自己发布的沙龙
```js
  GET    http://localhost:?/music/salon/own?token=${token}
```

### 获取已有的沙龙模版
```js
  GET    http://localhost:?/music/salon/modle?token=${token}
```







# 教育后台

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


## 管理商城
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
  defaultState: ${defaultState},    //默认上下架['true'上架，'false'下架](Boolean)
  category: ${category}    //商品类型['goods'物品，'modle'模版]
}
```
### 获取商城物品列表
```js
  GET    http://localhost:?/admin/goods/list?token=${token}&state=${state}&per=${per}&page=${page}
  // state: 'sell' 获取全部在售
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



## 管理知识天地
### 获取所有知识天地
```js
  GET    http://localhost:?/admin/knowledge/list?token=${token}
```
### 删除单个知识天地
```js
  POST    http://localhost:?/admin/knowledge/del?token=${token}
```
```js
{
  kledgeId: ${kledgeId}
}
```


