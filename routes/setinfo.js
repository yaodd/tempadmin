var express = require('express');
var router = express.Router();

var dao = require('.././dao/dao')
var docer = require('.././docer/docer')

var kStateDic = {
        "on": "1",
        undefined: "2"
      }

router.post('/', function(req, res, next) {

  console.log("statussssss",req.body.status)
  var state =kStateDic[req.body.status]

  dao.setInfo(req.body.tid, req.body.author, req.body.authorId, req.body.price, state)
  .then(function(sql_res){
	    
      dao.fetchIds(req.body.tid)
      .then(function(rows){
          var ids = []
          for (var i = 0; i < rows.length; i ++) {
              if (i == 0){
                  ids.push(rows[i].tid)
                  ids.push(rows[i].mid)
              }
              ids.push(rows[i].id)
          }
          for (var i = 0; i < ids.length; i ++) {
              docer.setInfo(ids[i], state, req.body.author, req.body.authorId, req.body.price)
              .then(function(body){
                  
              })
              .catch(function(err){    
                  res.send({
                      "result": "error",
                      "msg": err.message
                  })
              })
          }
          res.send({
              "result": "ok"
          })
      })
      .catch(function(err){
          res.send({
            "result": "error",
            "msg": err.message
          })
      })
      
  })
  .catch(function(err){
  	  
      res.send({
        "result": "error",
        "msg": err.message
      })
  })
  
});

module.exports = router;
