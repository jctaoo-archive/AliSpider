# AliSpider


### 什么是AliSpider?

> 一个可以根据txt文本内的url对淘宝或者天猫进行宝贝数据
> 爬取的应用程序，并提供持久存储功能，采用Mysql实现，并
> 配有对应的服务端，可以实现已存储数据的过滤等操作

![AliSpider](https://github.com/hello-acuario/AliSpider/blob/master/2018-08-15%20004311.png)

### AliSpider构造

> 客户端：在项目的master分支下（采用Electron开发，网页采用Jquery）

> 服务端：在项目的server分支下（采用Node.js开发，并采用Express协助开发）

> 持久存储： 采用Mysql数据库 （采用npm包mysql使服务器Node.js与数据库连接）

### 如何运行AliSpider?

> 1.修改server分支下的index.js文件中的全局常量connectionCONF，对应自己的Mysql配置

> 2.通过以下命令运行server分支下的index.js以在本地20205端口启动服务
>
```shell
npm install
node index.js
```

> 3.修改master分支下的src/home.html和src/user.html和user/login.html的script部分代码的全局常量HOST，对应自己服务端运行的host，注意要加协议

> 4.通过以下命令运行客户端GUI程序：


```shell
npm install -g electron
npm install
electron .
```
