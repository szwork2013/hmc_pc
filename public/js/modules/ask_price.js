var markAnima=null;
var userArea='';
var map_btn_tag=true;
var areaTree=null;
$(function(){
	window.history.forward(1);
	cnnzzHotPoint(30,'到地图页');

setTimeout(function(){
	$('#suggestId').val($('#suggestId').attr("initText")).addClass("text_init");
	$("#suggestId").focus();
}, 1000);
var suggestIdTag=false;
//$('#suggestId').keydown(function(e){
//	if(!suggestIdTag){
//		suggestIdTag=true;
//		cnnzzHotPoint(31,'输入地址');
//	}
//	var v=$(this).val();
//	if(e.keyCode==13){
//		if(v==''||v==null||v==$(this).attr("initText")){
//			alert("请输入地址！");
//			return;
//		}
//		$("#tipMark").hide();
//		myValue=v;
//		userArea=myValue;
//		setCookie("suggestVal",v,100000);
//		setPlace();
//	}else if(v==$(this).attr("initText")){
//		$(this).val('').removeClass("text_init");
//	}
//
//});
//$('#suggestId').live("dblclick",function(){
//	var v=getCookie("suggestVal");
//	$(this).val(v);
//});
//$(".suggestId_btn").live("click",function(){
//	var v=$('#suggestId').val();
//	if(v==''||v==null||v==$('#suggestId').attr("initText")){
//		alert("请输入地址！");
//		return;
//	}
//	myValue=v;
//	userArea=myValue;
//	$("#tipMark").hide();
//	setPlace();
//});

//$('#suggestId').click(function(){
//	if($(this).val()==$(this).attr("initText")){
//		$(this).val('').removeClass("text_init");
//	}
//
//}).blur(function(){
//	var v=$(this).val();
//	if(v==''||v==null){
//		$(this).val($(this).attr("initText"));
//		$(this).addClass("text_init");
//	}
//});

/*$("#tipMark").click(function(){
$(this).hide();
});*/

	init();

});

var markFonts=["A","B","C","D","E","F","G","H","I","J","K","L","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","A1","B1","C1","D1","E1","F1","G1","H1","I1","J1","K1","L1","L1","M1","N1","O1","P1","Q1","R1","S1","T1","U1","V1","W1","X1","Y1","Z1"];




}

//上一步
function go_back(){
	$("#fsForm").attr("action","/askPrice/chooseModel/");
	$("#fsForm").submit();
}



/*map.addEventListener("click",function(e){
	if(e.overlay==null&&mapClick){
		myPoint=e.point;
		setPlace();
	}else{
		mapClick=true;
	}

	});
	/*
	var ac = new BMap.Autocomplete(   //建立一个自动完成的对象
			{"input" : "suggestId"
			,"location" : '上海'
		});
	ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
		var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if (e.fromitem.index > -1) {
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			}
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

			value = "";
			if (e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
			var dis=_value.district;
			if(dis.length>2){
				$("#cityArea").val(dis.substr(0,2));
			}

			}
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			G("searchResultPanel").innerHTML = str;
		});
	ac.addEventListener("onconfirm", function(e) {   //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +_value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		setPlace();
		$("#tipMark").hide();
		setCookie("suggestVal",myValue,100000);
		userArea='';
		if(_value.district!=''){
			userArea+=_value.district +","
		}
		if(_value.street!=''){
			userArea+=_value.street +","
		}
		if(_value.business!=''){
			userArea+=_value.business;
		}
	});
	*/

//myValue='上海市虹口区广中路水电路-公交车站';
//setPlace();
