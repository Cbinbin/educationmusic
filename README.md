## 目录
* [小程式登录](#小程式登录)
  * [授权登录](#授权登录)
  * [查看登录用户信息](#查看登录用户信息)
  * [新建教师信息](#新建教师信息)
  * [更改教师信息](#更改教师信息)
  * [上传二维码](#上传二维码)
  * [更改证书](#更改证书)

* [教育后台](#教育后台)



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
  labels: ${labels}    //标签(Array)
  // 上传头像 key: 'music/imgs'
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


## 教育后台