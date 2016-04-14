"use strict"

var express = require('express');
var router = express.Router();

var dao = require('.././dao/dao')

var kPageNum = 20

router.get('/', function(req, res, next) {
  var statusDict = {
    undefined:"",
    "0":"",
    "1":"0",
    "2":"1"
  }
  var catDict = {
    undefined:"",
    "0":"",
    "1":"custom",
    "2":"diagram",
    "3":"preset",
    "4":"blank"
  }
  var aspDict = {
    undefined:"",
    "0":"",
    "1":"4:3",
    "2":"16:9",
    "3":"9:16"
  }
  let status = statusDict[req.query.sts]
  let category = catDict[req.query.cat]
  let aspectRatio = aspDict[req.query.asp]
  let tdx = (req.query.tdx===undefined) ? "" : req.query.tdx
  let name = (req.query.name===undefined) ? "" : req.query.name

  let page = 0

  if (req.query.page === undefined) {
    page = 0
  } else {
    page = (new Number(req.query.page)) - 1
  }
  console.log(page)
  dao.queryTempInfos(tdx, name, category, aspectRatio, status)
  .then(function(rows){

    let totalPage = Math.ceil(rows.length / kPageNum)
    let curPage = page + 1
    let firstPage = 1
    let lastPage = 5
    if ((curPage - 2) > 1) {
      if ((curPage + 2 > totalPage) && totalPage - 5 > 0) {
        firstPage = totalPage - 4
      } else if ((curPage + 2 >= totalPage) && totalPage - 5 < 0) {
        firstPage = 1
      } else {
        firstPage = curPage - 2
      }
    } else {
      firstPage = 1
    }
    if ((curPage + 2) < totalPage){
      if ((curPage <= 2) && totalPage > 5) {
        lastPage = 5
      } else if ((curPage <= 2) && totalPage <= 5) {
        lastPage = totalPage
      } else {
        lastPage = curPage + 2
      }
      
    } else {
      lastPage = totalPage
    }
	  
    var disRows
    disRows = rows.slice(page * kPageNum, (page + 1) * kPageNum)

	  res.render('index',{ title: "一键美化模板管理系统", 
      rows: disRows, 
      pageNum: kPageNum, 
      totalPage: totalPage, 
      curPage: page + 1, 
      firstPage: firstPage, 
      lastPage: lastPage,
      cat: ((req.query.cat===undefined) ? "0" : req.query.cat),
      tdx: (req.query.tdx===undefined) ? "" : req.query.tdx,
      name: (req.query.name===undefined) ? "" : req.query.name,
      sts: (req.query.sts===undefined) ? "0" : req.query.sts,
      asp: ((req.query.asp===undefined) ? "0" : req.query.asp)
    })
  })
  .catch(function(err){
  	console.log(err)
  	res.send(err)
  })
  
})

module.exports = router
