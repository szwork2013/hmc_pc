define(['jquery', 'text!../data/baidu_map_config.json'], function($, baiduMapConfigJson) {

  var buyAreaMarker = null;
  var myValue;
  var myGeo = new BMap.Geocoder();
  var point;
  var mapClick = true;
  var myInfoWin = null;

  /**************** 自定义缩放控件 ************/

  //定义一个控件类,即function
  function ZoomControl() {
    //默认停靠位置和偏移量
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    this.defaultOffset = new BMap.Size(10, 10);
  }

  //通过JavaScript的prototype属性继承于BMap.Control
  ZoomControl.prototype = new BMap.Control();

  //自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
  //在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
  ZoomControl.prototype.initialize = function(map) {
    var div = document.createElement('div');
    var spanPlus = document.createElement('span');
    var spanMinus = document.createElement('span');

    spanPlus.appendChild(document.createTextNode('＋'));
    spanMinus.appendChild(document.createTextNode('－'));
    div.appendChild(spanPlus);
    div.appendChild(spanMinus);
    //设置类名
    div.className = 'custom_zoom_control';
    spanPlus.className = 'plus';
    spanMinus.className = 'minus';
    //绑定事件,点击一次放大或缩小一级
    spanPlus.onclick = function(e) {
      map.setZoom(map.getZoom() + 1);
    }
    spanMinus.onclick = function(e) {
      map.setZoom(map.getZoom() - 1);
    }
    //添加DOM元素到地图中
    map.getContainer().appendChild(div);
    //将DOM元素返回
    return div;
  }

  /**************** 自定义缩放控件 结束 ************/


  /****************自定义窗口************/

  function InfoWin(center, w, h, content) {
    this._center = center;
    this._width = w;
    this._height = h;
    this._content = content;
    this.offSetx = 50;
    this.offSety = 40;
  }

  //继承API的BMap.Overlay
  InfoWin.prototype = new BMap.Overlay();

  //实现初始化方法
  InfoWin.prototype.initialize = function(map) {
  	//保存map对象实例
    this._map = map;
    //创建div元素，作为自定义覆盖物的容器
    var div = document.createElement('div');
    div.style.position = 'absolute';
    //可以根据参数设置元素外观
    if (this.w != 'auto') {
      div.style.width = this._width + 'px';
    }
    if (this.h != 'auto') {
      div.style.height = this._height + 'px';
    }
  	//将div添加到覆盖物容器中
    div.className = 'info_win_box';
    var inDiv = '<div class="info_win_close"></div>' +
  			'<div class="info_win_con">' + this._content + '</div>' +
  			'<div class="info_win_bottom"></div>';

    div.innerHTML = inDiv;
    map.getPanes().floatPane.appendChild(div);

  	//保存div实例
    this._div = div;
    return div;
  }

	InfoWin.prototype.setPosition = function(point) {
		this._center = point;
	}

	InfoWin.prototype.getPosition = function(point) {
		return this._center;
	}

  InfoWin.prototype.setOffset = function(x, y) {
  	this.offSetx = x;
  	this.offSety = y;
  }

  InfoWin.prototype.setContent = function(content) {
  	this.content = content;
  }

  //实现绘制方法
  InfoWin.prototype.draw = function() {
    //根据地理坐标转换为像素坐标，并设置给容器
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = (position.x - this.offSetx) + 'px';
    this._div.style.top = position.y - this._height - this.offSety + 'px';
  }

  InfoWin.prototype.addEventListener = function(event, fun) {
    this._div['on' + event] = fun;
  }

  /****************自定义窗口 结束************/


  /**************** 百度地图调用类  ************/

  function Map(city, carTypeId) {
    this.index = 0;
    this.markIndex = 0;
    this.markAnima = null;
    this.city = city || '上海';
    this.carTypeId = carTypeId || '';
    this.areaTree = null;
    this.userArea = null,
    this.myPoint = null;
    this.map = null;
    this.local = null;
    this.adds = [];  //4s店数组
  }

  //地图类初始化
  Map.prototype.init = function() {
    this.mapHandle();

    this.changePosition();
    $(window).on('load', this.changePosition);
    $(window).on('resize', this.changePosition);
    $(window).on('orientationchange', this.changePosition);

  	//this.getFs(this.CarTypeId);
  	this.getAreaList();
  	$('area_l span').eq(0).trigger('mouseover');
  }

  //获取区域列表
  Map.prototype.getAreaList = function() {
    var that = this, area = '';
  	$.ajax({
  		type: 'get',
  		url: '/data/areaData.js',
  		data: '',
  		success: function(data) {
    		data = eval('(' + data + ')');
    		that.areaTree = data[0];
    		for (var j in data[0]) {
    			area += '<span>' + j + '</span>';
    		}
    		$('.area_l').html(area);
    	}
  	});
  }

  //通过区域获取热门列表
  Map.prototype.findByArea = function(area) {
  	var data = this.areaTree, item = '';
  	for (var i in data) {
  		pdo = data[i];
  		var tag = false;

  		if (pdo.name == area) {
  			//区层
  			var subPdo = pdo.sub;
  			for (var j in subPdo) {
  				//key层
  				var tsubPdo = subPdo[j].sub;
  				 item += '<dl>' +
  			    '<dt>' + subPdo[j].key + '</dt>' +
  			    '<dd>';
  				var ts_text = '';
  				for (var k in tsubPdo) {
  					//块层
  					ts_text += '<span point="' + tsubPdo[k].point + '">' + tsubPdo[k].plate + '</span>';
  				}
  				item += ts_text + '</dd></dl>';
  			}
  			break;
  		}
  	}
  	$('.area_r').html(item);
  }

  //根据车型查4s店
  Map.prototype.getFs = function(typeId) {
  	$.ajax({
  		type: 'GET',
  		url: '/dealer/getCartTypFs',
  		data: 'carTypeId=' + typeId,
  		success: function(data) {
  			data = eval('(' + data + ')');
  			$(".map_fs_con ul").empty();
  				var li = '';
  				$.each(data, function(i, e) {
  					var point = null;
  					if (e.fsPoint != undefined && e.fsPoint != 'undefined' && e.fsPoint !=null && e.fsPoint != 0 && e.fsPoint != '') {
  						point=e.fsPoint;
  					}
  					var e = {"id":""+e.fsId+"","adds":""+e.fsAddress+"","name":""+e.fsAbbrname+"","configName":""+e.configName+"","point":""+point+"","fsPic":""+e.fsPic+"","fsIssign":""+e.fsIssign+""};
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
  				     e.key = markFonts[i];

  				});

  				$("#map_fs").show();
  				this.mapHandle();
  		}
  	});
  }

  //地图处理
  Map.prototype.mapHandle = function() {
  	this.mapInit();
  	$("#loading").hide();
  	this.bdGEO();
  }

  //初始化百度地图
  Map.prototype.mapInit = function() {
    var that = this,
        map = new BMap.Map("shop_map"), //创建Map实例
        point = new BMap.Point(121.481503, 31.239159),
        myZoomCtrl = new ZoomControl(); //创建自定义缩放控件实例

    this.map = map;
    map.centerAndZoom(point, 14); //初始化地图,设置中心点坐标和地图级别
    map.addControl(myZoomCtrl);
    map.setMapStyle({styleJson: JSON.parse(baiduMapConfigJson)});
    map.disableDragging();  //禁止拖拽
  	setTimeout(function(){
  	   map.enableDragging(); //两秒后开启拖拽
  	   map.enableInertialDragging(); //两秒后开启惯性拖拽
       //that.setPlace();
  	}, 2000);
    map.setCurrentCity(this.city);
  }

  //
  Map.prototype.bdGEO =  function() {
  	var add = this.adds[this.index];
  	this.geocodeSearch(add, this.index);
  	this.index++;
  }

  //
  Map.prototype.geocodeSearch = function(add, i) {
  	if (i < this.adds.length) {
  		setTimeout(window.bdGEO, 0);
  	} else {
  		$("#loading").hide();
  		return;
  	}
  	var fsPoint = add.point;
  	var name = add.adds;
  	if (fsPoint != null && fsPoint != "null" && fsPoint != undefined && fsPoint != "undefined" && fsPoint != 0) {
  		var point = fsPoint.split(",");
  		var address = new BMap.Point(point[0], point[1]);
  		add.point = address;
  		var sContent =
  			"<img src='/" + add.fsPic + "' width='170' height='113'/>" +
  			"<h4 style='margin:0 0 5px 0;padding:0.2em 0;font-size:14px;'>" + add.name + "</h4>" +
  			"<p style='margin:0;font-size:12px;'>" + add.adds + "</p>" +
  			//"<input type='button' value='选TA比价'style='float:right'fsId="+add.id+" onclick='infoBtn(this);'/>"+
  			"</div>";
  		var label = new BMap.Label(add.name, {offset:new BMap.Size(30,0)});
  		label.setStyle({
  			  border:"1px solid #67b0fd",
  				fontSize : "12px",
  				color:"#fff",
  				background:"#67b0fd",
  				padding:"10px"
  		 });
       this.addMarker(address, label, sContent, add, i);
  	} else {
    	myGeo.getPoint(name, function(point) {
    		if (point) {
    			add.point = point;
    			//$("input[name='askpFs'][fsId='"+add.id+"']").attr("point",point.lng+","+point.lat);
    			var address = new BMap.Point(point.lng, point.lat);
    			var sContent =
    				"<img src='/" + add.fsPic + "' width='170' height='113'/>"+
    				"<h4 style='margin:0 0 5px 0;padding:0.2em 0;font-size:14px;'>"+add.name+"</h4>" +
    				"<p style='margin:0;font-size:12px;'>"+add.adds+"</p>" +
    				//"<input type='button' value='选TA比价'style='float:right'fsId="+add.id+" onclick='infoBtn(this);'/>"+
    				"</div>";
    			var label = new BMap.Label(add.name, {offset: new BMap.Size(30,0)});
    			label.setStyle({
    				 border: "1px solid #67b0fd",
    				 borderRadius: "5px",
    				 fontSize : "12px",
    				 color: "#fff",
    				 background: "#67b0fd",
    				 padding: "10px"
    			 });
    				this.addMarker(address, label, sContent, add, i);
    				this.updatePoint(add.id, point.lng + ',' + point.lat);
    		}
    	}, "上海市");
    }
  }

  //
  Map.prototype.addMarker = function(point, label, content, add, aIndex) {
  	var i = aIndex;//markIndex++;
  	var marker = new BMap.Marker(point);
  	var myIcon = new BMap.Icon("/resources/images/mapIcon/" + add.key + '.png', new BMap.Size(26, 38));
  	marker.setIcon(myIcon);
  	this.map.addOverlay(marker);
  	//label.setContent(markFonts[i]);

    var mySquare = new InfoWin(point, 170, content);
  	this.map.addOverlay(mySquare);
  	mySquare.addEventListener('click', function(e) {
  		mapClick = false;
  	});
  	mySquare.hide();
  	marker.addEventListener('click', function(e) {
      mySquare.show();
    });

	 var mySquare = new BMap.InfoWindow(content, {
			offset: new BMap.Size(2, -10),
			enableMessage: false
		});  // 创建信息窗口对象

	 mySquare.disableCloseOnClick();
   marker.addEventListener('click', function(e) {
     this.map.openInfoWindow(mySquare,point); //开启信息窗口
   });

   add.infoWin = mySquare;
   add.marker = marker;
 }

  //更新4s店经纬度
  Map.prototype.updatePoint = function(fsId, point) {
  	$.ajax({
  		type: 'post',
  		url: '/dealer/updatePoint',
  		async: true,
  		data: "fsId=" + fsId + "&point=" + point,
  		success: function(data){
  			//data = eval('(' + data + ')');
  		}
  	});
  }

  //更新4s店列表和地图
  Map.prototype.setPlace = function() {
    var that = this, v_con = '';

  	if (this.index == 0) {
  		this.bdGEO();
  		//$("#tipMark").hide();
  	}

    function doneSetPlace() {
      var pp, poi = '', myIcon = null;
      if (that.myPoint != null) {
        that.map.removeOverlay(buyAreaMarker);    //清除地图上覆盖物
        pp = that.myPoint;
        //myPoint = null;
        that.map.setCenter(pp);
      } else {
        var poi = that.local.getResults().getPoi(0);
        if (poi == 'undefined' || poi == undefined) {
          $("#tipMark").hide();
          if (buyAreaMarker == null) {
            $("#tipMark").show();
          }
          alert("无效地址，请重新输入！");
          return;
        }
        that.map.removeOverlay(buyAreaMarker);    //清除地图上覆盖物
        pp = poi.point;    //获取第一个智能搜索的结果
        that.map.centerAndZoom(pp, 13);
      }

      myIcon = new BMap.Icon('/images/map_icon/current_position_icon.png', new BMap.Size(80, 80));
      myIcon.setAnchor(new BMap.Size(15, 58));
      myIcon.setImageSize(new BMap.Size(80, 80));
      var marker = new BMap.Marker(pp, {icon: myIcon});
      that.map.addOverlay(marker);    //添加标注
      marker.enableDragging();
      var v = that.userArea;
      var head = '<div class="current_position_popup"><b>已为您找到<span class="num">3家最近的</span>4S店</b>';
      var v_con = '<br/><span class="address" title="' + v + '">您的地址：' + v + '</span><span class="my4S"></span>';
      $('.text_input').val(v);
      var foot = '<br/><input type="button" value="下一步&nbsp;&gt;" class="map_btn map_btn1" /></div>';
      if (myInfoWin != null) {
        that.map.removeOverlay(myInfoWin);
      }
      myInfoWin = new InfoWin(marker.getPosition(), 188, 80, head + v_con + foot);
      myInfoWin.setOffset(130, 160);
      that.map.addOverlay(myInfoWin);
      marker.addEventListener('dragend', function(e) {
        that.myPoint = e.point;
        myGeo.getLocation(that.myPoint, function(rs) {
          var addComp = rs.addressComponents;
          v = addComp.district;
          userArea = '';
          if (addComp.district != '') {
            userArea = addComp.district;
          }
          if (addComp.street != '') {
            v += addComp.street;
            userArea += "," + addComp.street;
          }
          if (addComp.streetNumber != '') {
            v += addComp.streetNumber;
            userArea += "," + addComp.streetNumber;
          }
          var v_con = '<br/><span class="address" title="' + v + '">您的地址：'+ v + '</span><span class="my4S"></span>';
          $('.text_input').val(v);
          that.map.removeOverlay(myInfoWin);
          myInfoWin = new InfoWin(that.myPoint, 188, 80, head + v_con + foot);
          myInfoWin.setOffset(130, 160);
          that.map.addOverlay(myInfoWin);
          that.map.centerAndZoom(that.myPoint, 13);
          that.getDistance();
        });
      });

      marker.addEventListener('click', function(e) {
        //map.openInfoWindow(myInfoWin,e.target.point);
        myInfoWin.show();
      });

      buyAreaMarker = marker;
      that.getDistance();
    }

  	that.local = new BMap.LocalSearch(that.map, { //智能搜索
  	  onSearchComplete: doneSetPlace
  	});
  	that.local.search(this.myValue);
    console.log(that.local, that.myValue);
  }

  //
  Map.prototype.getDistance = function() {
  	if (this.adds != null && buyAreaMarker != null) {
  		var pointB = buyAreaMarker.getPosition();
  		var polyline = null,label = null;
  		for (var i = 0; i < this.adds.length; i++) {
  			var add = this.adds[i];
  			var pointA = add.point;
  			var distance = parseInt(map.getDistance(pointA, pointB));
  			add.distance = distance;
  			polyline = add.polyline;
  			if (polyline != null) {
  				polyline.setPath([pointA, pointB]);
  			} else {
  				polyline = new BMap.Polyline([pointA,pointB], {strokeColor:"#3070bd", strokeWeight:3, strokeOpacity:1.0, strokeStyle: "dashed"});  //定义折线
  			    map.addOverlay(polyline);
  			    polyline.setPositionAt(10, add.point);
  			}
  			polyline.hide();
  			add.polyline = polyline;
  		}
  	}
  	this.selectMinDisFs();
  }

  //默认选择最近的3家4s店
  Map.prototype.selectMinDisFs = function() {
    var selectedAdds = [];
 	  for (var i = 0; i < this.adds.length; i++) {
      //内层循环，找到第i大的元素，并将其和第i个元素交换
      for (var j = i; j < this.adds.length; j++) {
        if (parseInt(this.adds[i].distance) > parseInt(this.adds[j].distance)) {
          //交换两个元素的位置
          var temp = adds[i];
          adds[i] = adds[j];
          adds[j] = temp;
        }
      }
    }
 	  $(".map_fs_con ul").empty();
 	  $(".my4S").empty();
 	  var li = '';
 	  var m = 0;
 	  if (selectedAdds.length > 0) {
 		  for( var i = 0; i < selectedAdds.length; i++) {
 			  if (selectedAdds[i].marker != null) {
 				  selectedAdds[i].marker.setIcon(new BMap.Icon("/resources/images/mapIcon/"+selectedAdds[i].key + ".png", new BMap.Size(26, 38)));
 			  }
 		  }
 	  }
 		$.each(this.adds, function(i, e) {
      if (e.marker.getLabel() != null) {
        e.marker.getLabel().hide();
        e.polyline.hide();
      }

      var label = new BMap.Label("", {offset: new BMap.Size(30,0)});
   		label.setStyle({
        border:"1px solid #67b0fd",
        borderRadius:"5px",
        fontSize : "12px",
        color:"#fff",
        background:"#67b0fd",
        padding:"10px"
      });
      label.setContent(e.name + "<br/>距离:" + (e.distance / 1000).toFixed(2) + "km");
      e.marker.setLabel(label);
 			li = '<li>'+
 			       '<table>'+
 	         '<tr>';
 			if (i <= 2) {
        li += '<td class="fs_td_img"><img src="/'+e.fsPic+'" class="fs_img"/></td>';

        li +=
 	          '<td class="fs_td" style="padding-right: 12px;">'+
 		          '<b class="fs_seled">'+e.key+'：'+e.name+'</b>';
        li += '<i>' + e.adds +
 	        '<br/>'+e.configName+' / '+(e.distance/1000).toFixed(2)+'km</i>'+(e.fsIssign=='1'?'<strong class="recommend"><em>品质</em><em class="color">商家</em></strong>':'')+
 	          '</td>';
 	      li += '<td><span class="chockBoxCls_UI chockBoxCls_UI_ed"></span><input class="chockBoxCls" type="checkbox" name="askpFs" fsName="'+e.name+'" fsId="'+e.id +'" value="'+e.id +'" point="'+e.point.lng +','+e.point.lat +'" checked="checked"/></td>';

 	      li += '</tr>'+
 	       '</table>'+
 	     '</li>';
       e.marker.setIcon(new BMap.Icon("/resources/images/mapIcon/lan/" + e.key + ".png", new BMap.Size(26, 38)));
       e.polyline.show();
       e.marker.getLabel().show();
       selectedAdds[i] = e;
 			} else {
 				 li += '<td class="fs_td_img"><img src="/'+e.fsPic+'" class="fs_img"/></td>';
 		        li +=
 		          '<td class="fs_td" style="padding-right: 12px;">'+
 			          '<b>'+e.key+'：'+e.name+'</b>';
 		        li += '<i>'+e.adds+
 		        '<br/>' + e.configName + ' / ' + (e.distance/1000).toFixed(2) + 'km</i>' + (e.fsIssign=='1' ? '<strong class="recommend"><em>品质</em><em class="color">商家</em></strong>':'')+
 		          '</td>';
 		        li += '<td><span class="chockBoxCls_UI"></span><input class="chockBoxCls" type="checkbox" name="askpFs" fsName="'+e.name+'" fsId="'+e.id +'" value="'+e.id +'" point="'+e.point.lng +','+e.point.lat +'" /></td>';

 		        li += '</tr>'+
 		       '</table>'+
 		     '</li>';

         e.polyline.hide();
         e.marker.getLabel().hide();
 			}
      e.infoWin.hide();
 			$(".map_fs_con ul").append(li);
 		});

   	$(".map_fs_t").html('<i class="map_fs_t1">已匹配最近的4S店，也可自由选择</i>');
   	$("#map_fs").show();
  }

  Map.prototype.addArea = function(adds) {
  	// 将地址解析结果显示在地图上,并调整地图视野
  	myGeo.getPoint(adds, function(point) {
  		if (point) {
  			map.panTo(point);
  		}
  	}, "上海市");
  }

  //
  Map.prototype.mPanTo = function(point) {
  	this.map.panTo(point);
  	this.map.setZoom(13);
  	if (this.markAnima != null) {
  		this.markAnima.setAnimation(null);
  	}
  	for (i = 0; i < this.adds.length; i++) {
  		var add = this.adds[i];
  		add.infoWin.hide();
  		var marker = add.marker;
  		var mp = marker.getPosition();
  		if (mp.lng == point.lng && mp.lat == point.lat) {
  			//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
  			this.markAnima = marker;
  			//add.infoWin.show();
  			this.map.openInfoWindow(add.infoWin, add.point);
  		}
  	}
  }

  //
  Map.prototype.mCheckPanTo = function(point, tag){
  	this.map.panTo(point);
  	if (this.markAnima != null) {
  		this.markAnima.setAnimation(null);
  	}
		for( var i = 0; i < this.adds.length; i++) {
			var add = this.adds[i];
			var marker = add.marker;
			var polyline = add.polyline;
			var mp = marker.getPosition();
			if (mp.lng == point.lng && mp.lat == point.lat) {
				//marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
				if (tag) {
					//选中
					marker.setIcon(new BMap.Icon("/resources/images/mapIcon/lan/"+add.key+".png",new BMap.Size(26,38)));
					marker.getLabel().show();
				    polyline.show();
				} else {
					//未选中
					marker.setIcon(new BMap.Icon("/resources/images/mapIcon/"+add.key+".png",new BMap.Size(26,38)));
					marker.getLabel().hide();
					//add.infoWin.hide();
					polyline.hide();
				}
				var n = $(".fs_seled").length;
				$(".inContcs .num").html(n + "家最近的");
				//$(".map_fs_t").html('<i class="map_fs_t1">已匹配最近的4S店，也可自由选择</i>');
				markAnima = marker;
				break;
			}
		}
  }

  //
  Map.prototype.validataAllow = function(modelId, askFs) {
  	var isFlag = false;
  	$.ajax({
  		type: 'get',
  		url: '/askPrice/isAllowAsk',
  		async: false,
  		data: 'modelId=' + modelId + '&askFs=' + askFs,
  		success: function(data) {
  			data = eval("(" + data + ")");
  			if (data != null && data.flag) {
  				isFlag = true;
  			} else {
  				alert(data.msg);
  			}
  		}
  	});
  	return isFlag;
  }

  //根据
  Map.prototype.searchPoint = function(value) {
  	map.setZoom(13);
  	myValue = value;
  	setPlace();
  }

  //
  Map.prototype.mapNext = function() {
  	var fsl = $("input[name='askpFs']:checked");
  	if (fsl.length <= 0) {
  		alert("请选择4S店");
  		return;
  	} else {
  		if (!map_btn_tag) {
  			alert("系统正在处理中请稍候！");
  			return false;
  		}
  		var v = '';
  		var fsName = '';
  		for (var i = 0; i < fsl.length; i++) {
  			if (!isNullStr(v)) {
  				v += ",";
  			}
  			v += fsl[i].value;
  			if (!isNullStr(fsName)) {
  				fsName += ";";
  			}
  			fsName += $(fsl[i]).attr("fsname");
  		}
  		$("#askFs").val(v);
  		$("#askpFsname").val(fsName);
  		$("#askpUserArea").val(userArea);
  		var askpUser = $("#askpUser").val();
  		if (!isNullStr(askpUser)) {
  			var askpModel = $("#askpModel").val();
  			if (!validataAllow(askpModel, v)) {
  				window.location.href = '/webUser/askPriceList';
  			} else {
  					map_btn_tag = false;
  					$("#fsForm").attr("action", "/askPrice/addAskPrice");
  					$("#fsForm").submit();
  			}
  		} else {
  			map_btn_tag = false;
  			//window.open('','_self');
  			//setTimeout(function(){window.open('','_self'); window.close();},10);
  			$("#fsForm").submit();

  		}
  	}
  }

  //
  Map.prototype.openInfo = function(content, e) {
  	var p = e.target;
  	var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
  	var infoWindow = new BMap.InfoWindow(content, {
  		enableMessage: false
  	});  // 创建信息窗口对象
  	map.openInfoWindow(infoWindow, point); //开启信息窗口
  }

  //
  Map.prototype.infoBtn = function(obj) {
  	$("input[name='askpFs'][fsId='" + obj.attributes["fsId"].nodeValue + "']").attr("checked", true);
  }

  //改变选择4s店浮层位置
  Map.prototype.changePosition = function () {
    var target = $('#map_fs');
    var winWidth = $(window).width();

    if (winWidth > 1170) {
      target.css('left', (winWidth - 1170) / 2);
    } else {
      target.css('left', 30);
    }
  }

  /**************** 百度地图调用类 结束 ************/

  return {
    Map: Map
  };

});
