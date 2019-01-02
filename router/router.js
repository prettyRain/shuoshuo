/**
 * Created by prettyRain on 2018/12/10.
 */
var db = require('../model/db.js');
var md5 = require('../model/md5');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var gm = require('gm');

/**
 * 首页
 * @param req
 * @param res
 */
exports.showIndex = function(req,res){
    console.log(req.session.login);
  if(req.session.login=='1'){
      db.find("users",{username:req.session.username},function(err,result){
          if(!err){
              res.render('index',{login:"1",username:req.session.username,avatar:result[0].avatar,active:"全部说说"})
          }
      });
      
  }else{
      res.render('index',{login:"-1",active:"全部说说"});
  }
   
}
/**
 * 注册页面
 * @param req
 * @param res
 */
exports.showRegist = function(req,res){
    if(req.session.login=='1'){
        res.render('regist',{login:"1",username:req.session.username,avatar:req.session.avatar,active:"全部说说"})
    }else{
        res.render('regist',{login:"-2",active:"全部说说"});
    }
}

/**
 * 注册
 * @param req
 * @param res
 */
exports.doRegist = function(req,res){
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {
        
        console.log(util.inspect({fields: fields, files: files}));
        var username = fields.username;
        var password = md5(fields.password);
        db.find("users",{username:username},{"end":1},function(err,result){
            if(err){
                res.send("-1");
                return;
            }
            if(result.length > 0){
                if(password == result[0].password){
                    res.send("-2")
                    return;
                }
            }
            db.insertOne("users",{username:username,password:password,avatar:"headphoto.jpg"},function(err,result){
                if(err){
                    res.send("-1");
                    return;
                }
                req.session.username = username;
                req.session.login = "1";
                res.send("1");
            });
            
        })
        
    });
}

/**
 * 登录页面
 * @param req
 * @param res
 */
exports.showLogin = function(req,res){
    res.render('login',{login:"-3",active:"全部说说"});
}
/**
 * 登录
 * @param req
 * @param res
 */
exports.doLogin = function(req,res){
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {
        var username = fields.username;
        var password = md5(fields.password);
        db.find('users',{username:username},function(err,result){
            if(err){
                res.send("-1");
                return;
            }
            if(result.length > 0){
                if(password == result[0].password){
                    req.session.login = '1';
                    req.session.username = username;
                    req.session.avatar = result[0].avatar;
                    res.send("1");
                }else{
                    //用户名密码不匹配
                    res.send("-3");
                };
            }else{
                //用户名不存在
                res.send("-2")
            }
        })
    })
}
/**
 * 上传图片页面
 * @param req
 * @param res
 */
exports.showAvatar = function(req,res){
    if(req.session.login == "1"){
        res.render('avatar',{login:'1',username:req.session.username,active:"全部说说"});
    }else{
        res.render('avatar',{login:'-1',active:"全部说说"});
    }
}
/**
 * 上传图片
 * @param req
 * @param res
 */
exports.doAvatar = function(req,res){
    if(req.session.login != "1"){
        res.send("-2");
        return;
    }
    var form = new formidable.IncomingForm();
    form.uploadDir = "./avatar";
    form.parse(req, function(err, fields, files) {
       var oldpath = "./"+files.tupian.path;
       var newpath = "./avatar/"+req.session.username+".jpg";
       fs.rename(oldpath,newpath,function(err){
           if(err){
               res.send("-1");
               return;
           }
           //压缩图片
           gm(newpath)
            .resize(500, 500, '!')
            .noProfile()
            .write(newpath, function (err) {
            if (err) {
            console.log(err);
            res.send("-1");
            return;
            }
                res.send({username:req.session.username});
            });
       })
    })
}

/**
 * 裁切图片
 * @param req
 * @param res
 */
exports.setAvatar = function(req,res){
    if(req.session.login != "1"){
        res.send("-2");
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
       var x = fields.x;
       var y = fields.y;
       var w = fields.w;
       var h = fields.h;
       console.log(fields);
        //裁切图片
        gm("./avatar/"+req.session.username+".jpg")
         //裁剪参数(w,h,x,y)
         .crop(w,h,x,y)
         .write("./avatar/"+req.session.username+".jpg",function(err){
         if(!err) {
             console.log(1)
             db.updateOne("users",{username:req.session.username},{$set: {avatar:req.session.username+".jpg"} },function(err,result){
                 if(err){
                     console.log(err);
                     res.send("-1");
                     return;
                 }
                 console.log("done");
                 res.send("1");
             })
         }
         })
    })
}
/**
 * 添加说说
 * @param req
 * @param res
 * @param next
 */
exports.addPost = function(req,res,next){
    if(req.session.login=='1') {
    
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var username = fields.username;
            var content = fields.content;
            db.insertOne("posts", {username: username, content: content, creatTime:new Date()}, function (err, reuslt) {
                if (err) {
                    res.send("-2");
                    return;
                }
                res.send("1");
            })
        })
    }else{
        res.send("-1");
    }
}
/**
 * 查询所有说说
 * @param req
 * @param res
 * @param next
 * @constructor
 */
exports.AllPosts = function(req,res,next){
    var currentPage = parseInt(req.query.currentPage);
    var pageSize = parseInt(req.query.pageSize);
    var start = (currentPage-1)*pageSize;
    var end = pageSize;
    db.find('posts',{},{start:start,end:end,sort:{creatTime:-1}},function(err,result){
        if(err){
            res.send("");
            return;
        }
        db.count('posts',{},function(err,result1){
            if(err){
                res.send("");
                return;
            }
            var totalPage = result1%pageSize==0?result1/pageSize:(result1/pageSize + 1);
            (function itempost(i){
                if(!result.length || result.length == i){
                    res.send({list:result,totalPage:parseInt(totalPage),currentPage:currentPage});
                    return;
                }
                db.find('users',{username:result[i].username},function(err,result2){
                    if(err){
                        console.log(err);
                        return;
                    }
                    result[i].avatar = result2[0].avatar;
                    i++;
                    itempost(i);
                });
            })(0)
        })
    })
}
/**
 * 成员列表
 * @param req
 * @param res
 * @param next
 */
exports.userlist = function(req,res,next){
    if(req.session.login=='1'){
        db.find("users",{username:req.session.username},function(err,result){
            if(!err){
                db.find("users",{},function(err,results){
                    if(!err){
                        res.render('userlist',{login:"1",username:req.session.username,avatar:result[0].avatar,active:"成员列表",users:results})
                    }
                })
            }
        });
    }else{
        db.find("users",{},function(err,result){
            if(!err){
                res.render('userlist',{login:"-1",active:"成员列表",users:result});
            }
        })
       
    }
}
/**
 * 某个人的说说
 * @param req
 * @param res
 * @param next
 */
exports.user = function(req,res,next){
    var user = req.params.username;
    if(req.session.login=='1'){
        db.find("users",{username:req.session.username},function(err,result){
            if(!err){
                db.find("users",{username:user},function(err,result1){
                    if(!err){
                        db.find('posts',{username:user},function(err,result2){
                            for(var i in result2){
                                result2[i].avatar = result1[0].avatar;
                            }
                            console.log(result2);
                            res.render('user',{login:"1",username:req.session.username,avatar:result[0].avatar,active:"我的说说",userposts:result2});
                        })
                        
                    }
                })
            }
        });
    }else{
        db.find("users",{username:user},function(err,result1){
            if(!err){
                db.find('posts',{username:user},function(err,result2){
                    for(var i in result2){
                        result2[i].avatar = result1[0].avatar;
                    }
                    console.log(result2);
                    res.render('user',{login:"-1",active:"我的说说",userposts:result2});
                })
            
            }
        })
        
    }
}
/*exports.queryUserByUsername = function(req,res,next){
    var username = req.query.username;
    console.log(username);
    db.find('users',{username:username},function(err,result){
        if(err){
            console.log(err);
            res.send("");
            return;
        }
        res.send(result[0]);
    })
}*/
