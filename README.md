## 目录
* [小程式登录](#小程式登录)
  * [授权登录](#授权登录)
  * [查看登录用户信息](#查看登录用户信息)

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


## 教育后台