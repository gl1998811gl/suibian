var mongoose = require('mongoose');


var zupingSchema = new mongoose.Schema({
    xuan:String,
    qichemingchen: String,
    zupingshichang: String,
    zujin:String,
    zong:String,
    kerenzhifu:String,
    zhuangtai:Boolean,
    cishu:Number,
    sid:Number

});

//静态方法，增加学生
zupingSchema.statics.addStudent = function(json,callback){
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
var ZuPing = mongoose.model("zupingxinxi",zupingSchema);

//暴露
module.exports = ZuPing;