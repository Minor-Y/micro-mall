
# About
此项目是 vue 2 + element-ui 构建的后台管理系统，数据都是从服务器实时获取的真实数据，具有真实的登陆、管理数据、权限验证、角色权限变更等功能。
# 技术栈
前端：vue2 + vuex + vue-router + webpack + ES6/7 + less + element-ui  
服务端：node + express + mysql
# 项目运行
#克隆到本地  
git clone https://github.com/bailicangdu/vue2-happyfri.git

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
