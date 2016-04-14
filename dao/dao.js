"use strict"

var util = require('util')
var mysql = require('mysql')
var Promise = require('bluebird')

var pool = mysql.createPool({
	connectionLimite : 32,
			host : "localhost",
			user : "root",
			password : "yaodun",
			port : "3306",
			database : "testMH",
})



function _promiseQuery(sql_sen) {
	return new Promise(function(resolve, reject){

		pool.getConnection(function(err, conn){
			if (err) {
				reject(err)
			}

			conn.query(sql_sen,function(err, res){
				if (err) {
					reject(err)
				}
				conn.release()
				resolve(res)

			})
		})	
	})
}

module.exports.testFunc = function(){
	console.log("test log")
	confirm("test confirm")
}

module.exports.queryTempInfos = function(tdx, name, category, aspectRatio, status){
	let tdxSen = (tdx === "") ? "" : " AND serialNo = " + tdx
	let nameSen = (name === "") ? "" : " AND name LIKE '%" + name + "%'"
	let catSen = (category === "") ? "" : " AND category = '" + category + "'"
	let aspSen = (aspectRatio === "") ? "" : " AND aspectRatio = '" + aspectRatio + "'"
	let statusSen = (status === "") ? "" : " AND status = " + status
	let sql_sen = "SELECT id, serialNo, category, name, aspectRatio, author, authorId, groupTag, price, status FROM template WHERE 1" + tdxSen + catSen + aspSen + statusSen + nameSen
	console.log(sql_sen)

	return _promiseQuery(sql_sen)
}

module.exports.setInfo = function(tid, author, authorId, price, status) {
	// throw new Error("test")
	console.log("price", price)
	let sql_sen = mysql.format('UPDATE template SET author = ?, authorId = ?, price = ?, status = ? WHERE id = ?', [author, authorId, price, status, tid])
	console.log("sql", sql_sen)
	return _promiseQuery(sql_sen)
}
const kNoChangeValue = "MUTIBLE_CHANGE_TAG"
module.exports.setInfos = function(tids, author, authorId, price, status) {
	let authorSen = (author == kNoChangeValue) ? "" : ", author = '" + author + "'"
	let authorIdSen = (author == kNoChangeValue) ? "" : ", authorId = '" + authorId + "'"
	let priceSen = (price == kNoChangeValue) ? "" : ", price = '" + price + "'"
	let sql_sen = "UPDATE template SET status = " + status + authorSen + authorIdSen + priceSen + " WHERE"
	if (tids.length == 0){
		sql_sen += " FALSE"
	} else {
		for (let i = 0; i < tids.length; i ++){
			if (i == tids.length - 1){
				sql_sen += " id = " + tids[i]
			} else {
				sql_sen += " id = " + tids[i] + " OR"
			}
		}
	}
	console.log("sql", sql_sen)
	return _promiseQuery(sql_sen)
}

module.exports.fetchIds = function(tid) {
	let sql_sen = mysql.format("SELECT tid, mid, id FROM slide WHERE tid = ?", [tid])
	return _promiseQuery(sql_sen)
}