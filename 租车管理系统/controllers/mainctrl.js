var formidable = require("formidable");
var url = require("url");
var fs = require("fs");
var Student = require("../mondels/Student.js")
var post = require("../mondels/post.js")
var zsgc = require("../mondels/zsgc.js")//客户
var Leibie = require("../mondels/leibie.js")//类别管理
var dangan = require("../mondels/dangan.js")//汽车档案
var yizu = require("../mondels/yizu.js")
var zp = require("../mondels/zupingxinxi.js")

var crypto = require("crypto");//加密模块

exports.showIndex = function (req,res) {
    res.render("login")
}
//检验用户名
exports.jianYanuser = function (req,res) {
    var form = new formidable.IncomingForm;
    form.parse(req, function(err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        Student.findUserName(yonghuming,function(err,doc){
            if(!doc){
                res.json({"result":-1});
                return;
            }
            if(crypto.createHmac('sha256', mima).digest('hex') === doc.mima){
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result":1});
                return;
            }else{
                res.json({"result":-2});
                return;
            }
        });
    });
}

//注册
exports.showReg = function (req,res) {
    res.render("regsu")
}
//检测判断用户名
exports.checkUser = function (req,res) {
    var obj = url.parse(req.url,true).query;
    if (!obj.yonghuming){
        res.send("请提供yonghuming参数");
        return;
    }
    Student.findUserName(obj.yonghuming,function (err,doc) {
        if (doc){
            res.json({"result":-1})
        } else{
            res.json({"result":0})
        }
    })
}
//用户名的注册
exports.zhuc = function (req,res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        Student.findUserName(yonghuming,function (err,doc) {
            if (doc){
                res.json({"result":-1})
                return;
            }
            Student.adduser(yonghuming,mima,function (err,doc) {
                if (err){
                    res.json({"result":-2})
                    return;
                }
                req.session.login = 1;
                req.session.yonghuming = yonghuming;
                res.json({"result":1})
            })
        })
    })
}
//显示index
exports.showIdx = function (req,res) {
    res.render("index")
}

exports.showquery = function(req,res){
    res.render("query")
}
//执行添加
exports.doAddStudent = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        zsgc.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}

//检查用户名是否被占用
exports.check = function(req,res){
    var sid = req.params.sid;

    zsgc.checkSid(sid,function(torf){
        res.json({"result" : torf});
    });
}

//更改学生的Ajax接口，是post请求接口
exports.updateStudent = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        console.log( fields)
        zsgc.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }

            var thestudent = results[0];
            console.log( results[0])
            //更改属性
            thestudent.name = fields.name;
            thestudent.sex = fields.sex;
            thestudent.phone = fields.phone;
            thestudent.adres = fields.adres;
            thestudent.shenf = fields.shenf;
            thestudent.jiaz = fields.jiaz;
            //持久化
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
//删除学生
exports.deleteStudent = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //寻找这个学号的学生
    zsgc.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//Ajax接口，得到所有学生
exports.getAllStudent = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 3;
    //寻找条目总数
    zsgc.count({},function(err,count){
        zsgc.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}

//呈递更改学生的表单
exports.showUpdate = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    zsgc.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;

        }

        //呈递页面
        res.json({"result":results[0]})
        // res.render("index",{
        //     info : results[0]
        // });
    });
}

//详情
exports.detailStudent = function (req,res) {
    var id = req.params.sid;
    zsgc.find({"sid" : id},function(err,results){
        console.log(results.length)
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        //呈递页面
        res.json({
            info : results[0]
        });
    });
}


//租凭登记
exports.showlease =function (req,res) {
    res.render("lease")
}


exports.showcategory = function(req,res){
    res.render("category")
}
//添加汽车类别
exports.doAddqichelei = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        Leibie.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}

//检查行号是否被占用
exports.qicheleicheck = function(req,res){
    var sid = req.params.sid;

    Leibie.checkSid(sid,function(torf){
        res.json({"result" : torf});
    });
}
//删除汽车类别
exports.deleteqichelei = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //寻找这个学号的学生
    Leibie.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//Ajax接口，得到所有起汽车
exports.getAllqichelei = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 3;
    //寻找条目总数
    Leibie.count({},function(err,count){
        Leibie.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}



//汽车档案
exports.showcarfiles = function (req,res) {
    res.render("carfiles")
}
//执行添加
exports.doAddDangan = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        dangan.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}

//检查用户名是否被占用
exports.dangancheck = function(req,res){
    var sid = req.params.sid;

    dangan.checkSid(sid,function(torf){
        res.json({"result" : torf});
    });
}

//更改学生的Ajax接口，是post请求接口
exports.updateDangan = function(req,res){
    var sid = req.params.sid;
    if(!sid){
        return;
    }

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        console.log( fields)
        dangan.find({"sid" : sid},function(err,results){
            if(results.length == 0){
                res.json({"result" : -1});
                return;
            }

            var thestudent = results[0];
            console.log( results[0])
            //更改属性
            thestudent.name = fields.name;
            thestudent.sex = fields.sex;
            thestudent.leix = fields.leix;
            thestudent.num = fields.num;
            thestudent.danwei = fields.danwei;
            thestudent.ztai = fields.ztai
            //持久化
            thestudent.save(function(err){
                if(err){
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
//删除学生
exports.deleteDangan = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //寻找这个学号的学生
    dangan.find({"sid" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
//Ajax接口，得到所有学生
exports.getAllDangan = function(req,res){
    //读取page参数
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 3;
    //寻找条目总数
    dangan.count({},function(err,count){
        dangan.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}

//呈递更改学生的表单
exports.showDanganUpdate = function(req,res){
    //拿到学号
    var sid = req.params.sid;

    //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    dangan.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;

        }

        //呈递页面
        res.json({"result":results[0]})
        // res.render("index",{
        //     info : results[0]
        // });
    });
}


//租赁内汽车详情接口
exports.getAllAdta = function (req,res) {
    dangan.count({},function(err,count){
        dangan.find({}).exec(function(err,results){
            res.json({
                "results" : results,
                "login":req.session.yonghuming
            });
        });
    });
}

exports.tijiaoZuPing = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        zp.addStudent(fields,function(result){
            res.json({"result" : 1});
            dangan.find({"sid":sid}).exec(function(err,results){
                // console.log(results)
                var ass = results[0];
                ass.ztai = true;
                ass.cishu = ass.cishu+1;
                ass.save()
            });
        });

    });
}

exports.jia = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //数据库持久
        yizu.addalls(fields,function(result){
            res.json({"result" : 1});
        });
    });
}

//汽车类别
exports.getAllleibie = function(req,res){
    Leibie.count({},function(err,count){
        Leibie.find({}).exec(function(err,results){
            res.json({
                "results" : results
            });
        });
    });

}

//归还
exports.showReturn = function (req,res) {
    res.render("return")
}
exports.getZuPingXinXi = function(req,res){
    zp.find({},function (err,result) {
        console.log(result)
        res.json({"result":result});

    })
}
exports.delZuPingXinXi = function(req,res){
    // var sid = req.params.sid;
    var sid = url.parse(req.url,true).query.sid;
    console.log(sid)
    zp.find({"sid":sid},function (err,result) {
        // console.log(result)
        if(result.length == 1){
            result[0].remove(function () {
                res.json({"result":1})
                dangan.find({"sid":sid}).exec(function(err,results){
                    // console.log(ass)
                    var ass = results[0];
                    ass.ztai = false;
                    ass.guihuan = ass.guihuan+1;
                    ass.save()
                });
            })
        }

    })
}

//统计
//开始统计分析
exports.tongji=function (req,res,next) {
    res.render("statistics")
}
//统计分析的租出
exports.rentCar=function (req,res,next) {
    dangan.find({},function(err,results){
        // console.log(results);
        res.json({"results":results})
    });
}
//开始搜索类型
exports.checkType=function (req,res,next) {
    var name = url.parse(req.url,true).query.name;
    // console.log(name);
    dangan.find({"pwd":name},function(err,results){
        // console.log(results);
        res.json({"results":results})
    });
}

exports.guihuansuoyou = function (req, res) {
    dangan.find({},function(err,results){
        // console.log(results);
        res.json({"results":results})
    });
}