/**
 * Created by prettyRain on 2018/12/10.
 */

var express = require('express');
var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');
var router = require('./router/router.js');

//加载静态文件
app.use(express.static('./public'));
app.use(express.static('./avatar'));
//ejs模板
app.set("view engine",'ejs');

app.use(session({
    secret: '12345',
    name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 800000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));

//路由
app.get('/',router.showIndex);
//注册
app.get('/regist',router.showRegist);
app.post('/doRegist',router.doRegist);
//登录
app.get('/login',router.showLogin);
app.post('/doLogin',router.doLogin);

app.get('/avatar',router.showAvatar);
app.post('/doAvatar',router.doAvatar);
app.post('/setAvatar',router.setAvatar);

//添加说说
app.post("/addPost",router.addPost);
app.get("/AllPosts",router.AllPosts);
//成员列表
app.get("/userlist",router.userlist);
app.get("/user/:username",router.user);
app.listen(3000);





