var mongoose = require("mongoose");

var crypto = require("crypto");//加密模块

var userSchema = mongoose.Schema({
    yonghuming:String,
    mima:String,
})
var Student = mongoose.model("student",userSchema);

exports.findUserName = function (yonghuming,callback) {
    Student.findOne({"yonghuming":yonghuming},function (err,doc) {
        callback(err,doc)
    })
}

//添加用户
exports.adduser = function(yonghuming,mima,callback){
    var jianmimima = crypto.createHmac("sha256",mima).digest("hex");
    Student.create({"yonghuming":yonghuming,"mima":jianmimima},function (err,doc) {
        callback(err,doc)
    })
}