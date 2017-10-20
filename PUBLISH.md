# educationmusic

```js
  git clone https://github.com/Cbinbin/educationmusic.git    
  cd educationmusic    
  npm install    
```

如果本地没有.leancloud文件夹，执行下面:    

```js
  lean login    //本地没装lean-cli， 请先安装
  lean switch    //关联到leancloud上的应用
```

然后到leancloud该应用的 云引擎 -> 设置 -> 自定义环境变量 -> 添加新变量, 添加如下变量:    

```js 
  XCXID    //小程序appId
  XCXSECRET    //小程序appSecret
  MUSICSALT    //盐
  MUSICADMINSALT    //admin盐
  MUSICRAW    //raw
  QCLOUDAPPID    //腾讯云存储appId
  QCLOUDSECRETID    //腾讯云存储secretId
  QCLOUDSECRETKEY    //腾讯云存储secretKey
  QCREGION    //腾讯云存储区域
  QCBUCKET    //腾讯云存储bucket
```

本地测试运行     

```js
  lean up
```

部署到leancloud预备环境    

```js
  lean deploy -m "educationmusic"
```

发布到生产环境     

```js
  lean publish
```



