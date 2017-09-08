var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var multer = require('multer')
var storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    console.log(file)

    var index = file.originalname.lastIndexOf('.');
    var suffix = file.originalname.substring(index)
    var prefix = file.originalname.substring(0, index);

    cb(null, prefix + '.' + Date.now() + suffix)
  }
})

var upload = multer({
  storage: storage
});

var index = require('./routes/index');
var users = require('./routes/users');
var birds = require('./routes/birds');


var app = express();

// view engine setup 模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public'), {
  etag: true,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}));


// app.post('/upload', upload.single('logo'), function (req, res, next) {
//   res.send('上传成功！');
// })

// app.post('/upload', upload.array('test', 5),function(req, res, next){
//   res.send('上传成功！');
// })

var cpupload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'test', maxCount: 5 }])
app.post('/upload', cpupload, function (req, res, next) {
  res.send('上传成功！');
})


// 解决跨域问题
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})

app.use('/', index);
app.use('/users', users);
app.use('/birds', birds);

// app.all('/', function (req, res, next) {
//   next();
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler 错误中间件，必须是4个参数，否则会被认为常规中间件
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
