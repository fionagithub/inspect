# Laputa App
## 技术栈
vue2 + vuex + vue-router + webpack  + quasar + feathers + socketio  + jpush+ cordova
注意：cordova 需要 7 的版本，~npm install -g cordova@7.1.0~
## 数据接口
此项目有配套的后台系统，可以下载对应的后台系统，-->git
## Develop, Build & Deploy
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build

# lint code
$ npm run lint

# 应用构建 + 容器镜像构建
$ npm run build:docker

# 容器镜像构建
$ npm run docker:build

# 在本机测试运行构建好的镜像
$ npm run docker:run

# 构建应用及容器镜像并部署到测试服务器上
$ npm run build:deploy

# 将之前构建好的镜像部署到测试服务器上
$ npm run docker:deploy
```

## 目标功能
- [x] 用户登录认证 -- 完成
- [x] 报障与设备的实时数据 -- 完成
- [x] 全局封装对错误信息的提示 -- 完成
- [x] 实现页面之前的跳转 -- 完成
- [x] 数据校验功能 -- 完成
- [x] flex布局 -- 完成
- [x] 处理移动端的返回键 -- 完成
- [x] 检测移动端的平台 -- 完成
- [x] 应用的状态栏样式 -- 完成
- [x] 使用feathers框架，向客户端推送实时数据 -- 完成
- [x] 接收极光消息推送，并跳转对应页面 -- 完成
- [x] 本地存储用户与个人配置项的数据 -- 完成
- [x] 引用echart图表，显示设备的实时数据 -- 完成
- [x] 报障页面显示报障列表。实现上下滚动，更新数据 -- 完成
- [ ] 配置服务器地址 -- 完成（socket重连出现timeout错误，参见官方issue，bug待解决(https://github.com/feathersjs/authentication-client/issues/64)）
- [ ] 应用断网时，显示离线数据 -- 未完成 
## 效果演示

## 总结
1.socket+FeathersJs ：实时，抽象的API接口搭建。
2.vue前端框架,Vue.js提供了更加简洁、更易于理解的API，相比于其他复杂性的框架
3.jpush消息推送,启动程序,已经可以接受服务器或者jpush官网推送的消息了
对有些复杂性功能进行重构时，涉及的页面比较多，所以重构的过程中经常遇上各种问题。同时，也是一个很好提升的过程。
重配socket服务，进行重新连接时，出现timeout错误。官方issue未曾有好的解决方法，继续关注，期待有好的解决方案(https://github.com/feathersjs/authentication-client/issues/64)。
## 另外
频繁的异步请求数据，经常会带来各种问题。Async/Await应该是目前最简单的异步方案了。待尝试！！！
## 项目布局

```
.
├── build                                       // webpack配置文件
├── config                                      // 启动项目配置 
├── cordova                                         // 移动端
├── dist                                         // 项目打包路径
├── src                                           // 源码目录
|   |__assets                                       // 静态文件，css、img
│   ├── components                                   // 组件
│   │   ├── Device                                    // 设备
│   │   │   ├── data.js                    
│   │   │   ├── detail.vue                   
│   │   │   ├── echart.vue                    
│   │   │   ├── jpushDetail.vue                 
│   │   │   ├── template.vue                     
│   │   ├── Ticket                                    // 报障
│   │   │   ├── data.js                    
│   │   │   ├── detail.vue                   
│   │   │   ├── new.vue                    
│   │   │   ├── jpushDetail.vue                 
│   │   │   ├── template.vue                     
│   │   ├── Feedback                                // 反馈
│   │   │   └── template.vue                  
│   │   ├── Setting                                // 设置
│   │   │   └── template.vue                  
│   │   └── layout
│   │   |   └── drawer.vue                        // 左侧导航
│   │   |    └── popover.vue                        // 头部popover公共组件
│   │   ├── Auth.vue                              // 认证
│   │   ├── Config.vue                              // socket配置
│   │   ├── Error.vue                              // 出错信息组件
│   │   ├── Error404.vue                              // 404页面
│   │   ├── Index.vue                              // 首页
│   │   ├── login.vue                              // 登录
│   ├── config                                  // 基本配置
│   │   ├── vuex                                  // vuex状态集
│   │   ├── date.js                            // 时间格式
│   │   ├── echarts.js                            // echart图表
│   │   ├── feathers-config.js                     // feathers连接socket
│   │   ├── filtes.js                            // filter过滤方法
│   │   ├── storage.js                           // 本地存储
│   │   └── toast.js                              // toast弹出信息
│   ├── statics                                  // 静态图标
│   ├── themes                                  // 主题样式
│   ├── App.vue                                 // 页面入口文件
│   ├── index.html                                 // 入口html文件
│   ├── jpush.js                                 // 极光推送
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
│   ├── router.js                                 // 路由
├── templates                                   // quasar模板
.

```
