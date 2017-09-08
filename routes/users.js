var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/dbconfig');
var userSQL = require('../db/usersql');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据
var responseJSON = function (res, ret) {
  // console.log(ret)
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

//查询所有用户
// 添加用户
router.get('/selectUsers', function (req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;

    console.log(param);
    // 建立连接 增加一个用户信息 
    var currentPage = param.currentPage;
    var pageNumber = param.pageNumber;

    var sql = userSQL.queryAll + ' limit ' + (currentPage - 1) * pageNumber + ',' + pageNumber;

    console.log(sql)

    var actorNum;

    connection.query(userSQL.selectAllNum, function(err, num){
      console.log(num);

      if(num){
        actorNum = num[0].num;
      }      
    })

    connection.query(sql, function (err, result) {
      // console.log(result);
      console.log(actorNum)
      if (result && actorNum) {
        result = {
          code: 200,
          msg: '查询成功',
          actorNum: actorNum,
          users: result
        };
      }

      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);

      // 释放连接  
      connection.release();

    });
  });
});

module.exports = router;
