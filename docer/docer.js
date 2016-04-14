"use strict"

var http = require('http')
var Promise = require('bluebird')




const kAppId = "mb_website"
const kAppKey = "86c68376cee4ogy"

function _promiseSigPost(paramDic, opt) {
	return new Promise(function(resolve, reject){
		let body = ""
		let req = http.request(opt, function(res){
			res.on("data", function(d){
				body+=d
			}).on("end", function() {
				resolve(body)
			})
		}).on("error", function(err){
			reject(err)
		})
		let postData = ""
		for (let key in paramDic) {
			postData += key + "=" + paramDic[key] + "&"
		}
		postData += "sig=" + generate_sig(paramDic, kAppKey)
		req.write(postData)
		req.end()	
	})
	
}

const kDocerMbTypeCommon = "1"  //普通模板，免费
const kDocerMbTypeVip = "3"     //VIP模板，收费
module.exports.setInfo = function(id, state, author, author_id, price){
	let opt = {
		host:"api.docer.wps.cn",
		port:"80",
		method:"POST",
		path:"/mb.php/meta/set",
		headers:{
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}
	var type = (price == "0") ? kDocerMbTypeCommon : kDocerMbTypeVip
	let paramDic = {
		"app_id": kAppId,
		"mb_platform": "32",
		"id": id,
		"state": state,
		"author": author,
		"author_id": author_id,
		"price": price,
		"type": type
	}	
	console.log("dic", paramDic)
	return _promiseSigPost(paramDic, opt)
}

function generate_sig(dataDic, app_key) {
	let keyArr = new Array()
	for (let key in dataDic) {
		keyArr.push(key)
	}
	keyArr.sort()

	let str = ""
	for (let i = 0; i < keyArr.length; i ++) {
		str += keyArr[i] + "=" + dataDic[keyArr[i]]
	}
	str += app_key

	return md5(str)

}

function md5(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex");
}