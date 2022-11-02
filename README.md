
# About
此项目是 vue 2 + element-ui 构建的后台管理系统，用于巩固学习vue2.0相关的知识点。所以为了使这个项目更加完整，项目中加入一个server服务，为前端提供数据来源，数据都是从服务器实时获取的真实数据，具有真实的登陆、管理数据、权限验证、角色权限变更等功能。  

在这里用了express（express 是一个基于 Node.js 平台的开发框架）和mysql来进行编写数据存储的后端api，用于用户信息在数据库里存储和读取。使用JWT进行权限认证；axios拦截,配合路由钩子函数实现权限控制及动态路由。

# 技术栈
前端：vue2 + vuex + vue-router + webpack + ES6/7 + less + element-ui  
服务端：node + express + mysql
# 演示
demo地址 http://www.minorhan.top  
注意：

admin：拥有最高权限，可以查看所有的页面和按钮；
# 项目运行
#克隆到本地  
git clone https://github.com/Minor-Y/micro-mall.git

#打开一个终端，进入到micro-mall目录安装依赖包  
cd micro-mall

#安装依赖  
npm install

#进入server文件夹启动server服务（得先启动后台服务，否则前端页面没有数据），在server目录下执行以下命令 
node app.js

#开启本地服务器localhost:8081  
npm run serve

#发布环境  
npm run build
