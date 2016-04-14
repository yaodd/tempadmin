var express = require('express');
var router = express.Router();

var dao = require('.././dao/dao')
var docer = require('.././docer/docer')

var kStateDic = {
        "on": "1",
        undefined: "2"
      }

router.post('/', function(req, res, next) {

  console.log("body", req.body)

  var state =kStateDic[req.body.status]

  var tidsStr = req.body.tids
  var tids
  if (tidsStr == ""){
      tids = []
  } else {
      tids = tidsStr.split(":")
  }

  dao.setInfos(tids, req.body.author, req.body.authorId, req.body.price, state)
  .then(function(sql_res){

      for (var i = 0; i < tids.length; i ++){
          dao.fetchIds(req.body.tid)
          .then(function(rows){
              var ids = []
              for (var j = 0; j < rows.length; j ++){
                if (j == 0){
                    ids.push(rows[j].tid)
                    ids.push(rows[j].mid)
                }
                ids.push(rows[j].id)
              }
              for (var j = 0; j < ids.length; j ++){
                docer.setInfo(ids[j], state, req.body.author, req.body.authorId, req.body.price)
                .then(function(body){
                    
                })
                .catch(function(err){
                
                    res.send({
                      "result": "error",
                      "msg": err.message
                    })
                })    
              }
              
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
  
});

module.exports = router;
