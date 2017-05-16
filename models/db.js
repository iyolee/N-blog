const MongoClient = require('mongodb').MongoClient;
const settings = require('../settings.js');

function _connectDB(callback) {
    let url = settings.DBurl;

    MongoClient.connect(url, (err, db) => {
        try {
            callback(err, db);
        } catch (err) {
            callback(err, null);
            return;
        }
    });
}

init();

function init(){
    //对数据库进行一个初始化
    _connectDB(function(err, db){
        if (err) {
            console.log(err);
            return;
        }
        db.collection('users').createIndex(
            { "username": 1},
            null,
            function(err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("索引建立成功");
            }
        );
    });
}

//查找数据
exports.find = function (collectionName, json, C, D) {
    var result = [];    
    if (arguments.length == 3) {
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    } else if (arguments.length == 4) {
        var args = C;
        var callback = D;
        var skipnumber = args.pageamount * args.page || 0;
        var limit = args.pageamount || 0;
        var sort = args.sort || {};
    } else {
        throw new Error("error");
    }

    //连接数据库，连接之后查找所有
    _connectDB(function (err, db) {
        var cursor = db.collection(collectionName).find(json).skip(skipnumber).limit(limit).sort(sort);
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                db.close(); //关闭数据库
                return;
            }
            if (doc != null) {
                result.push(doc);   //放入结果数组
            } else {
                //遍历结束，没有更多的文档了
                callback(null, result);
                db.close(); //关闭数据库
            }
        });
    });
}

//插入数据
exports.insertOne = (collectionName, json, callback) => {
    _connectDB((err, db) => {
        db.collection(collectionName).insertOne(json, (err, result) => {
            callback(err, result);
            db.close();
        });
    });
}

//删除数据
exports.deleteMany = (collectionName, json, callback) => {
    _connectDB((err, db) => {
        db.collection(collectionName).deleteMany(
            json,
            (err, result) => {
                callback(err, result);
                db.close();
            }
        );
    });
}

//更新数据
exports.updateMany = (collectionName, json1, json2, callback) => {
    _connectDB((err, db) => {
        db.collection(collectionName).updateMany(
            json1,
            json2,
            (err, result) => {
                callback(err, result);
                db.close();
            });
    });
}

//统计总数
exports.getAllCount = (collectionName, callback) => {
    _connectDB((err, db) => {
        db.collection(collectionName).count({}).then((count) => {
            callback(count);
            db.close();
        });
    });
}