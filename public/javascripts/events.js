
function prePage(curPage) {
    if ((curPage - 1) == 0){
  
    } else {
        document.getElementById("page").value = curPage - 1
        document.getElementById("fetchform").submit()
    }
}
function nextPage(curPage, totalPage) {
    if ((curPage + 1) > totalPage){
        
    } else {
        document.getElementById("page").value = curPage + 1
        document.getElementById("fetchform").submit()
    }
}
function choosePage(curPage) {
    document.getElementById("page").value = curPage
    document.getElementById("fetchform").submit()
}

// function activePage(page) {
//     document.getElementById(page).class = "active"
// }
const kCatNameNolimit = "不限"
const kCatNameCustom = "成套模板"
const kCatNameDiagram = "图示库模板"
const kCatNamePreset = "预设板式"
const kCatNameBlank = "万能板式"
function selCat(index) {
    var catName
    if (index == 0){
        catName = kCatNameNolimit
    } else if(index==1){
        catName = kCatNameCustom
    } else if(index == 2) {
        catName = kCatNameDiagram
    } else if(index == 3) {
        catName = kCatNamePreset
    } else if(index == 4) {
        catName = kCatNameBlank
    }
    document.getElementById("category").value = index
    document.getElementById("catBtn").innerText = catName
}

const kAspNameNolimit = "不限"
const kAspName43 = "标准4:3"
const kAspName169 = "宽屏16:9"
const kAspName916 = "竖屏9:16"
function selAsp(index) {
    var aspName
    if (index == 0) {
        aspName = kAspNameNolimit
    } else if (index == 1) {
        aspName = kAspName43
    } else if (index == 2){
        aspName = kAspName169
    } else {
        aspName = kAspName916
    }
    document.getElementById("aspectRatio").value = index
    document.getElementById("aspBtn").innerText = aspName
}

const kStatusNameNolimit = "不限"
const kStatusNameReviewed = "已审核"
const kStatusNameNoReviewed = "未审核"
function selStatus(index){
    var statusName
    if (index == 0){
        statusName = kStatusNameNolimit
    } else if (index == 1) {
        statusName = kStatusNameNoReviewed
    } else {
        statusName = kStatusNameReviewed
    }
    document.getElementById("status").value = index
    document.getElementById("stsBtn").innerText = statusName
}

Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
} 
Array.prototype.indexOf = function(el){
 for (var i=0,n=this.length; i<n; i++){
  if (this[i] === el){
   return i;
  }
 }
 return -1;
}

function SuccessTipsShow(msg) {
    $("#success-alert").fadeIn()
    $("body").oneTime("1s",function(){
        $("#success-alert").fadeOut()
    })
}

function FailedTipsShow(msg) {
    $("#failed-alert").html(msg)
    $("#failed-alert").fadeIn()
    $("body").oneTime("4s",function(){
        $("#failed-alert").fadeOut()
    })
}

$(document).ready(function(){
    $("#infotable form").ajaxForm(function(res){
        if (res.result == "ok"){
            var msg = "设置模板信息成功！"
            SuccessTipsShow(msg)

        } else {
            var msg = "设置模板信息失败！" + res.msg
            FailedTipsShow(msg)
        }
    })

    $("#batch-set-info-form").ajaxForm(function(res){
        if (res.result == "ok"){
            var msg = "设置模板信息成功！"
            SuccessTipsShow(msg)
            location.reload()
        } else {
            var msg = "设置模板信息失败！" + res.msg
            FailedTipsShow(msg)
        }

    })

    $("#all-choose-cb").change(function(){
        var checks = $(".choose-check")
        var authorInputs = $("#infotable input[name='author']")
        var authorIdInputs = $("#infotable input[name='authorId']")
        var priceInputs = $("#infotable input[name='price']")

        var value = $("#batch-form-tids").attr("value")
        var arr
        if (value == ""){
            arr = []
        } else {
            arr = value.split(":")
        }   

        if ($(this).is(":checked")){
            checks.prop("checked", true)
            var author
            var authorId
            var price
            var authorChanged, authorIdChanged, priceChanged = false
            for (var i = 0; i < checks.length; i ++){

                var cpId = checks[i].getAttribute("id")
                var fileId = fileIdByCpId(cpId)
                arr.push(fileId)

                var curAuthor = authorInputs[i].value
                var curAuthorId = authorIdInputs[i].value
                var curPrice = priceInputs[i].value
                if (i == 0) {
                    author = curAuthor
                    authorId = curAuthorId
                    price = curPrice
                } else {
                    if (author != curAuthor) {
                        authorChanged = true
                    }
                    if (authorId != curAuthorId){
                        authorIdChanged = true
                    }
                    if (price != curPrice) {
                        priceChanged = true
                    }
                }
            }
            if ($("#batch-form-author").attr("value") == "") {
                if (authorChanged == true) {
                    $("#batch-form-author").attr("placeholder", "多值")
                } else {
                    $("#batch-form-author").attr("value", author)
                }
            }
            
        } else {
            checks.prop("checked", false)
            for (var i = 0; i < checks.length; i ++){
                var cpId = checks[i].getAttribute("id")
                var fileId = fileIdByCpId(cpId)
                arr.remove(arr.indexOf(fileId))
            }
        }
        $("#batch-form-tids").attr("value", arr.join(":"))
    })

    $(".choose-check").change(function(){
        var checkboxs = $(".choose-check")
        var trueCount = 0
        for (var i = 0; i < checkboxs.length; i ++){
            if (checkboxs[i].checked){
                trueCount++
            }
        }
        if (trueCount == checkboxs.length){
            $("#all-choose-cb").prop("checked", true)
        } else {
            $("#all-choose-cb").prop("checked", false)
        }

        var cpId = $(this).attr("id")
        var fileId = fileIdByCpId(cpId)
        value = $("#batch-form-tids").attr("value")
        var arr
        if (value == ""){
            arr = []
        } else {
            arr = value.split(":")
        }
        
        if ($(this).is(":checked")){
            arr.push(fileId)
        } else {
            arr.remove(arr.indexOf(fileId))
        }
        $("#batch-form-tids").attr("value", arr.join(":"))
    })
})
function fileIdByCpId(cpId){
    return cpId.replace("set_","").replace("_cb","")
}

function setInfoVerify(sender){

    var inputs = sender.getElementsByTagName("input")
    var authorId 
    var price
    var status
    for (var i = 0; i < inputs.length; i ++){
        switch(inputs[i].getAttribute("name")){
        case "authorId":
            authorId = inputs[i].value
        case "price":
            price = inputs[i].value
        case "status":
            status = inputs[i].checked
        }
    }
    if (price != "0"){
        if (authorId == "" && status == true){
            var msg = "审核失败！收费模板设计师不能为空！"
            FailedTipsShow(msg)
            return false
        }
    }
    if (sender.id == "batch-set-info-form") {

        if (!$(".choose-check").is(":checked")){
            var msg = "批量设置请先至少勾选一个模板！"
            FailedTipsShow(msg)
            return false
        }
    }
    return true
}

