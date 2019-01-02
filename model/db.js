/**
 * Created by prettyRain on 2018/12/10.
 */

 var mongoClient = require('mongodb').MongoClient;
 var settings = require('../settings.js');
 
 var dburl = settings.dburl;
 var dbname = settings.dbname;

/**
 * 连接数据库
 * @param callback
 */
function clientmongodb(callback){
    mongoClient.connect(dburl,function(err,client){
         callback(err,client);
     })
 }

/**
 * 插入一条数据
 * @param collectionName
 * @param paramJSON
 * @param callback
 */
exports.insertOne = function(collectionName,paramJSON,callback){
    clientmongodb(function(err,client){
        if(err){
            callback(err,null);
            return;
        }
        var db = client.db(dbname);
        db.collection(collectionName).insertOne(paramJSON,function(err,result){
            callback(err,result);
            client.close();
        })
    })
}
/**
 * 插入多条数据
 * @param collectionName 集合名称
 * @param paramArray json数组
 * @param callback  回调函数
 */
exports.insertMany = function(collectionName,paramArray,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).insertMany(paramArray,function(err,result){
            callback(err,result);
            client.close();
        })
    })
}
/**
 * 修改一条数据
 * @param collectionName 集合名称
 * @param whereJSON  修改条件
 * @param paramJSON  修改内容
 * @param callback   回调函数
 */
exports.updateOne = function(collectionName,whereJSON,paramJSON,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).updateOne(whereJSON,paramJSON,function(err,result){
             callback(err,result);
            client.close();
        })
    })
}
/**
 * 修改多条数据
 * @param collectionName 集合名称
 * @param whereJSON  修改条件
 * @param paramJSON  修改内容
 * @param callback   回调函数
 */
exports.updateMany = function(collectionName,whereJSON,paramJSON,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).updateMany(whereJSON,paramJSON,function(err,result){
            callback(err,result);
            client.close();
        })
    })
}
/**
 * 删除一条数据
 * @param collectionName 集合名称
 * @param whereJSON 条件
 * @param callback  回调函数
 */
exports.deleteOne = function(collectionName,whereJSON,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).deleteOne(whereJSON,function(err,result){
            callback(err,result);
            client.close();
        })
    })
}

/**
 * 删除多条数据
 * @param collectionName 集合名称
 * @param whereJSON 条件
 * @param callback  回调函数
 */
exports.deleteMany = function(collectionName,whereJSON,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).deleteMany(whereJSON,function(err,result){
            callback(err,result);
            client.close();
        })
    })
}

/**
 * 查询
 * @param collectionName
 * @param whereStr
 * @param B
 * @param C
 */
exports.find = function(collectionName,whereStr,B,C) {
    if (arguments.length == 3) {
        var callback = B;
        clientmongodb(function (err, client) {
            var db = client.db(dbname);
            db.collection(collectionName).find(whereStr).toArray(function (err, result) {
                callback(err, result);
                client.close();
            })
        })
    } else {
        var callback = C;
        var paramJSON = B;
        clientmongodb(function (err, client) {
            var sort = (!paramJSON.sort) ? {} : paramJSON.sort;
            var end = (!paramJSON.end) ? 0 : paramJSON.end;
            var start = (!paramJSON.start) ? 0 : paramJSON.start;
            var db = client.db(dbname);
            db.collection(collectionName).find(whereStr).sort(sort).skip(start).limit(end).toArray(function (err, result) {
                callback(err, result);
                client.close;
            })
        })
    }
}
/**
 * 删除集合
 * @param collectionName
 * @param callback
 */
exports.drop = function(collectionName,callback){
   clientmongodb(function(err,client){
       var db = client.db(dbname);
       db.collection(collectionName).drop(function(err,result){
           callback(err,result);
           client.close();
       });
   })
}

/**
 * 查询总条数
 * @param collectionName
 * @param whereStr
 * @param callback
 */
exports.count = function(collectionName,whereStr,callback){
    clientmongodb(function(err,client){
        var db = client.db(dbname);
        db.collection(collectionName).find(whereStr).count(function(err,result){
            callback(err,result);
            client.close();
        })
    })
}



