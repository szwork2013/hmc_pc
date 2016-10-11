var markAnima=null;
var userArea='';
var map_btn_tag=true;
var areaTree=null;
$(function(){
	window.history.forward(1); 
	cnnzzHotPoint(30,'到地图页');
	$(".map_fs_con .fs_td").live("click",function(){
		var p = $(this).parent().find("input").attr("point").split(",");
		var point=new BMap.Point(p[0],p[1]);
		mPanTo(point);
		
	});
	$(".map_fs_con .map_icon").live("click",function(){
		var p = $(this).parent().parent().find("input").attr("point").split(",");
		var point=new BMap.Point(p[0],p[1]);
		mPanTo(point);
	});
	$(".map_fs_con .map_icon2").live("click",function(){
		var p = $(this).parent().parent().find("input").attr("point").split(",");
		var point=new BMap.Point(p[0],p[1]);
		mPanTo(point);
	});
	var askpFsTag=false;
	
	//4s店列表 圆点
	$(".chockBoxCls_UI").live('click',function() {
		var _input=$(this).parent().find(".chockBoxCls");
		$(".fs_title_bg").remove();
		var _this=$(this);
		if(!askpFsTag){
			cnnzzHotPoint(32,'修改4S店');
			askpFsTag=true;
		}
		
		if(_this.is(".chockBoxCls_UI_ed")){
			_this.removeClass("chockBoxCls_UI_ed");
			_input.attr("checked",false);
		}else{
			_this.addClass("chockBoxCls_UI_ed");
			_input.attr("checked",true);
		}
		
		var fsl=$("input[name='askpFs']:checked");
		if(fsl!=null&&fsl.length>3){
			//alert("一次最多只能选择3家4S店进行询价，先取消一家4S店，才能重新选择！");
			_this.parents("li").append('<span class="fs_title_bg" style="background-position: -38px -132px;">一次最多可以选择3家，请先取消一家</span>');
			_this.removeClass("chockBoxCls_UI_ed");
			_input.attr("checked",false);
			return false;
		}else{
			var p = _input.attr("point").split(",");
			var point=new BMap.Point(p[0],p[1]);
			
			
			if(_input.attr("checked")=="checked"){
				_input.parent().prev().find("b").addClass("fs_seled");
				_input.parent().parent().find(".map_icon").addClass("map_icon2");
				mCheckPanTo(point,true);
			}else{
				_input.parent().prev().find("b").removeClass("fs_seled");
				_input.parent().parent().find(".map_icon2").removeClass("map_icon2").addClass("map_icon");
				mCheckPanTo(point,false)
			}
			var n=$(".chockBoxCls_UI_ed").length;
			_this.parents("li").append('<span class="fs_title_bg">已选<i>'+n+'</i>家，还可以选<b>'+(3-n)+'</b>家</span>');
			
			
			
			return true;
		}
	});
	
	$(".pay_back").click(function(event) {
		$(".pay_model").hide();
		$(".head_grey").hide();
	});
	
	var map_btn2Tag=false;
	$(".map_btn2").live('click',function(){
		if(!map_btn2Tag){
			cnnzzHotPoint(34,'列表下一步');
			map_btn2Tag=true;
		}
		mapNext();
	});
	var map_btnTag=false;
	$(".map_btn1").live("click",function(){
		if(!map_btnTag){
			cnnzzHotPoint(33,'地图下一步');
			map_btnTag=true;
		}
		mapNext();
	});
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
	

$("#cityArea").live("change",function(){
	myValue=$(this).val();
	setPlace();
});

$(".m_center").live("click",function(){
	if(buyAreaMarker!=null){
		map.panTo(buyAreaMarker.getPosition());
	}
});

/*$("#tipMark").click(function(){
$(this).hide();
});*/


$(".info_win_close").live('click',function(e){
	$(this).parent().hide();
});




$(".fs_area_l span").live("mouseover",function(){
	clearTimeout(area_boxTime);
	var _this = $(this);
	$(".fs_area_l_ed").removeClass("fs_area_l_ed");
	_this.addClass("fs_area_l_ed");
	var key =_this.text();
	$(".fs_area_r").html('');
	findByArea(key);
	
});

var area_boxTime=null;
$(".fs_area_box").live("mouseleave",function(){
	if($("#tipMark").css("display")=='none'){
	area_boxTime=setTimeout(function(){$(".fs_area_box").hide()}, 3000);
	}
});

$(".m_search").live("click",function(){
	clearTimeout(area_boxTime);
	$(".fs_area_box").show();
	$(".fs_area_l span:first").trigger("mouseover");
});


$(".fs_area_r span").live("click",function(){
	cnnzzHotPoint(31,'点击区域');
	var area=$(".fs_area_l_ed").text();
	userArea=area+","+$(this).text();
	var p=$(this).attr("point").split(",");
	var point=new BMap.Point(p[0],p[1]);
	myPoint=point;
	map.setZoom(13);
	setPlace();
	$("#tipMark").hide();
	$(".fs_area_box").hide();
	
	
});





	init();

});


function validataAllow(modelId,askFs){
	var isFlag=false;
	$.ajax({
		type:'get',
		url:'/askPrice/isAllowAsk',
		async: false,
		data:'modelId='+modelId+'&askFs='+askFs,
		success:function(data){
			data=eval("("+data+")");
			if(data!=null&&data.flag){
				isFlag=true;
			}else{
				alert(data.msg);
			}
		}
	});
	return isFlag;
}

function mCheckPanTo(point,tag){
	map.panTo(point);
	if(markAnima!=null){
		markAnima.setAnimation(null);
	}
		for(i=0;i<adds.length;i++){
			var add=adds[i];
			var marker=add.marker;
			var polyline=add.polyline;
			var mp=marker.getPosition();
			if(mp.lng==point.lng&&mp.lat==point.lat){
				//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				if(tag){
					//选中
					marker.setIcon(new BMap.Icon("/resources/images/mapIcon/lan/"+add.key+".png",new BMap.Size(26,38)));
					marker.getLabel().show();
				    polyline.show();
				   // var fsCon='<span fsId="'+add.id +'" class="fs_li">'+add.name +'<span>';
			        //$(".my4S").append(fsCon);
			       // add.infoWin.show();
				}else{
					//未选中
					marker.setIcon(new BMap.Icon("/resources/images/mapIcon/"+add.key+".png",new BMap.Size(26,38)));
					marker.getLabel().hide();
					//add.infoWin.hide();
					polyline.hide();
					//$(".my4S span[fsId='"+add.id+"']").remove();
				}
				var n=$(".fs_seled").length;
				$(".inContcs .num").html(n+"家最近的");
				//$(".map_fs_t").html('<i class="map_fs_t1">已匹配最近的4S店，也可自由选择</i>');
				markAnima=marker;
				break;
			}
		}
		
	
}


function mPanTo(point){
	map.panTo(point);
	map.setZoom(13);
	if(markAnima!=null){
		markAnima.setAnimation(null);
	}
	for(i=0;i<adds.length;i++){
		var add=adds[i];
		add.infoWin.hide();
		var marker=add.marker;
		var mp=marker.getPosition();
		if(mp.lng==point.lng&&mp.lat==point.lat){
			//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			markAnima=marker;
			//add.infoWin.show();
			map.openInfoWindow(add.infoWin,add.point)
		}
	}
}

function init(){
//	$("#tipMark").height($(window).height()-125);
	getFs(CarTypeId);
	$("#allmap").height($(window).height()*0.99-140);
	var h=$(window).height()*0.99-300;
	$("#map_fs ul").height(h);
	if(h<365){
		h=365;
	}
	$(".fs_area_box").height(h+75);
	//$(".my4S").html(fsCon);
	areaList();
	$(".fs_area_l span").eq(0).trigger("mouseover");
	var mt=(h+75)/2;
	$("#tipMark").css("height",$(window).height()*0.99-115+"px");
}
var markFonts=["A","B","C","D","E","F","G","H","I","J","K","L","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","A1","B1","C1","D1","E1","F1","G1","H1","I1","J1","K1","L1","L1","M1","N1","O1","P1","Q1","R1","S1","T1","U1","V1","W1","X1","Y1","Z1"];
//根据车型查4s店
function getFs(typeId){
	$.ajax({
		type:'GET',
		url:'/dealer/getCartTypFs',
		async: false,
		data:"carTypeId="+typeId,
		success:function(data){
			data = eval('(' + data + ')');
			$(".map_fs_con ul").empty();
				var li = '';
				$.each(data, function(i, e) {
					var point=null;
					if(e.fsPoint!=undefined&&e.fsPoint!='undefined'&&e.fsPoint!=null&&e.fsPoint!=0&&e.fsPoint!=''){
						point=e.fsPoint;
					}
					var e={"id":""+e.fsId+"","adds":""+e.fsAddress+"","name":""+e.fsAbbrname+"","configName":""+e.configName+"","point":""+point+"","fsPic":""+e.fsPic+"","fsIssign":""+e.fsIssign+""};
					adds.push(e);
					
					
					li='<li>'+'<table>'+'<tr>'+
					 '<td class="fs_td_img"><img src="/'+e.fsPic+'" class="fs_img"/></td>'+
				          '<td  class="fs_td" style="padding-right: 12px;">'+
					          '<b>'+markFonts[i]+'：'+e.name+'</b>';
				    li+='<i>'+e.adds+
				        '<br/>'+e.configName+'</i>'+
				          '</td>'+
				          '<td>';
							li+= '<span class="chockBoxCls_UI"></span><input class="chockBoxCls" type="checkbox" name="askpFs" fsName="'+e.name+'" fsId="'+e.id +'" value="'+e.id +'" point="'+point+'" />';
						    li+='</td>'+
				         '</tr>'+
				       '</table>'+
				     '</li>';
				     $(".map_fs_con ul").append(li);
				     e.key=markFonts[i];
					
				});
				
				//$(".map_fs_t .map_fs_t1").html("<i><span>"+data.length+"家</span>4S店</i>");
				$("#map_fs").show();
				mapHandle();
		}
	});
}
//地图处理
function mapHandle(){
	mapInit();
	$("#loading").hide();
	bdGEO();
}


function mapNext(){

	var fsl=$("input[name='askpFs']:checked");
	if(fsl.length<=0){
		alert("请选择4S店");
		return;
	}else{
		if(!map_btn_tag){
			alert("系统正在处理中请稍候！");
			return false;
		}
		var v='';
		var fsName='';
		for(i=0;i<fsl.length;i++){
			if(!isNullStr(v)){
				v+=",";
			}
			v+=fsl[i].value;
			if(!isNullStr(fsName)){
				fsName+=";";
			}
			fsName+=$(fsl[i]).attr("fsname");
		}
		$("#askFs").val(v);
		$("#askpFsname").val(fsName);
		$("#askpUserArea").val(userArea);
		var askpUser=$("#askpUser").val();
		if(!isNullStr(askpUser)){
			var askpModel=$("#askpModel").val();
			if(!validataAllow(askpModel,v)){
				window.location.href='/webUser/askPriceList';
			}else{
					map_btn_tag=false;
					$("#fsForm").attr("action","/askPrice/addAskPrice");
					$("#fsForm").submit();
			}
		}else{
			map_btn_tag=false;
			//window.open('','_self'); 
			//setTimeout(function(){window.open('','_self'); window.close();},10);
			$("#fsForm").submit();
			
		}
	}
	

}

//区域列表
function areaList(){
	$.ajax({
		type:'get',
		url:'/resources/js/areaData.js?v=1.2',
		async: false,
		data:'',
		success:function(data){
		data =eval('(' + data + ')');
		areaTree=data[0];
		var area='';
		for(j in areaTree){
			area+='<span>'+j+'</span>';
		}
		$(".fs_area_l").html(area);
		
	}

	});
	
}

function findByArea(area){
	var data=areaTree;
	var item='';
	for(i in data){
		pdo=data[i];
		var tag=false;
		
		if(pdo.name==area){
			//区层
			var subPdo=pdo.sub;
			for(j in subPdo){
				//key层
				var tsubPdo=subPdo[j].sub;
				 item+='<dl>'+
			    '<dt>'+subPdo[j].key+'</dt>'+
			    '<dd>';
				var ts_text='';
				for(k in tsubPdo){
					//块层
					ts_text+='<span point="'+tsubPdo[k].point+'">'+tsubPdo[k].plate+'</span>';
				}
				item+=ts_text+'</dd></dl>';
				
				
			}
			
			break;
		}
		
	}
	
	$(".fs_area_r").html(item);
	
}

//上一步
function go_back(){
	$("#fsForm").attr("action","/askPrice/chooseModel/");
	$("#fsForm").submit();
}
