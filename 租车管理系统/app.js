var express = require("express");
var mainctrl = require("./controllers/mainctrl.js");
var mongoose = require("mongoose")
var session = require("express-session");
mongoose.connect('mongodb://localhost/zuche');
var app = express();
app.set("view engine","ejs");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.get("/",mainctrl.showIndex);//登录页面
app.post("/jianyan",mainctrl.jianYanuser)//检验用户名
app.get("/index",mainctrl.showIdx)//检验用户名
app.get("/regsu",mainctrl.showReg)//注册
app.get("/checkuser",mainctrl.checkUser)//检测判断用户名
app.post("/zhuc",mainctrl.zhuc)//用户名注册

app.get("/query",mainctrl.showquery)//客人查询页
app.propfind('/student/:sid'	, mainctrl.check);		//Ajax接口检查用户名是否被占用
app.post    ('/student/:sid'	, mainctrl.updateStudent);	//Ajax接口，更改学生
app.delete  ('/student/:sid'	, mainctrl.deleteStudent);//删除
app.get     ('/student/:sid'	, mainctrl.showUpdate);		//呈递更改学生表单
app.post    ('/student'			, mainctrl.doAddStudent);	//Ajax接口保存表单
app.get     ('/student'			, mainctrl.getAllStudent);	//Ajax接口得到所有学生
app.patch ('/student/:sid', mainctrl.detailStudent);//详情


app.get("/lease",mainctrl.showlease);//租凭登记

app.get("/category",mainctrl.showcategory)//类别管理
app.propfind('/leibie/:sid'	, mainctrl.qicheleicheck);		//Ajax接口检查行号名是否被占用
app.delete  ('/leibie/:sid'	, mainctrl.deleteqichelei);//删除
app.post    ('/leibie'			, mainctrl.doAddqichelei);	//Ajax接口保存表单
app.get     ('/leibie'			, mainctrl.getAllqichelei);	//Ajax接口得到所有汽车类别


app.get("/carfiles",mainctrl.showcarfiles);//汽车档案
app.propfind('/dangan/:sid'	, mainctrl.dangancheck);		//Ajax接口检查行号是否被占用
app.post    ('/dangan/:sid'	, mainctrl.updateDangan);	//Ajax接口，更改学生
app.delete  ('/dangan/:sid'	, mainctrl.deleteDangan);//删除
app.get     ('/dangan/:sid'	, mainctrl.showDanganUpdate);		//呈递更改学生表单
app.post    ('/dangan'			, mainctrl.doAddDangan);	//Ajax接口保存表单
app.get     ('/dangan'			, mainctrl.getAllDangan);	//Ajax接口得到所有汽车档案


app.get("/alldata",mainctrl.getAllAdta)//租赁里
app.get("/qicleibie",mainctrl.getAllleibie)//汽车类别
app.post('/zupingdengji/:sid',mainctrl.tijiaoZuPing);
app.get("/yizu/:sid"      ,mainctrl.jia);
app.get("/return",mainctrl.showReturn)//归还页
app.get('/getzupinxinxi',mainctrl.getZuPingXinXi);
app.get('/delguihuan',mainctrl.delZuPingXinXi);


//统计页
app.get("/statistics",mainctrl.tongji)//页面
app.get("/rentCar",mainctrl.rentCar);//统计分析的租出
app.get("/checkType",mainctrl.checkType);///开始搜索类型
app.get("/guihuansuoyou",mainctrl.guihuansuoyou);//
app.use(express.static("static"));
app.listen(3008)
