var mongoose = require('mongoose');


var zupingSchema = new mongoose.Schema({
    zujin:String,
    zong:String,
    kerenzhifu:String,
    xuan:String,
    zupingshichang: String,
    qichemingchen: String,
    zhuangtai:Boolean,
    cishu:Number,
    sid:Number
});

//静态方法，增加学生
zupingSchema.statics.addalls = function(json,callback){
    var s = new ZuPing(json);
    s.save(function(err){
        if(err){
            console.log(err);
            callback(-2);  //服务器错误
            return;
        }
        //发回1这个状态
        callback(1);
    });

}

//验证学号是否存在
zupingSchema.statics.checkSid = function(sid,callback){
    this.find({"sid" : sid} , function(err,results){
        //如果没有相同的id，返回true
        //如果有相同的id返回false
        callback(results.length == 0);
    });
}

//类
var yizu = mongoose.model("yizu",zupingSchema);

//暴露
module.exports = yizu;