require(['config/main'], function() {
  require(['domReady', 'jquery', 'map', 'fotorama', 'fresco', 'jssor'], function(domReady, $, mapObject) {
    domReady(function(){

      var carParityDetail = {

        tab: function() {
          //点击切换tab
          $(document).on('click', '.car_details_tabs ul li', function() {
            var $this = $(this),
                index = $this.index() + 1;
            $this.addClass('active').siblings().removeClass('active');
            $('.item' + index).removeClass('hide').siblings().addClass('hide');
          });
        },
        showSlide: function() {
          //显示图片slides
          var jssor_1_SlideshowTransitions = [
            {$Duration:1200,$Zoom:1,$Easing:{$Zoom:$Jease$.$InCubic,$Opacity:$Jease$.$OutQuad},$Opacity:2},
            {$Duration:1000,$Zoom:11,$SlideOut:true,$Easing:{$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear},$Opacity:2},
            {$Duration:1200,$Zoom:1,$Rotate:1,$During:{$Zoom:[0.2,0.8],$Rotate:[0.2,0.8]},$Easing:{$Zoom:$Jease$.$Swing,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$Swing},$Opacity:2,$Round:{$Rotate:0.5}},
            {$Duration:1000,$Zoom:11,$Rotate:1,$SlideOut:true,$Easing:{$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$InExpo},$Opacity:2,$Round:{$Rotate:0.8}},
            {$Duration:1200,x:0.5,$Cols:2,$Zoom:1,$Assembly:2049,$ChessMode:{$Column:15},$Easing:{$Left:$Jease$.$InCubic,$Zoom:$Jease$.$InCubic,$Opacity:$Jease$.$Linear},$Opacity:2},
            {$Duration:1200,x:4,$Cols:2,$Zoom:11,$SlideOut:true,$Assembly:2049,$ChessMode:{$Column:15},$Easing:{$Left:$Jease$.$InExpo,$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear},$Opacity:2},
            {$Duration:1200,x:0.6,$Zoom:1,$Rotate:1,$During:{$Left:[0.2,0.8],$Zoom:[0.2,0.8],$Rotate:[0.2,0.8]},$Easing:{$Left:$Jease$.$Swing,$Zoom:$Jease$.$Swing,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$Swing},$Opacity:2,$Round:{$Rotate:0.5}},
            {$Duration:1000,x:-4,$Zoom:11,$Rotate:1,$SlideOut:true,$Easing:{$Left:$Jease$.$InExpo,$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$InExpo},$Opacity:2,$Round:{$Rotate:0.8}},
            {$Duration:1200,x:-0.6,$Zoom:1,$Rotate:1,$During:{$Left:[0.2,0.8],$Zoom:[0.2,0.8],$Rotate:[0.2,0.8]},$Easing:{$Left:$Jease$.$Swing,$Zoom:$Jease$.$Swing,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$Swing},$Opacity:2,$Round:{$Rotate:0.5}},
            {$Duration:1000,x:4,$Zoom:11,$Rotate:1,$SlideOut:true,$Easing:{$Left:$Jease$.$InExpo,$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$InExpo},$Opacity:2,$Round:{$Rotate:0.8}},
            {$Duration:1200,x:0.5,y:0.3,$Cols:2,$Zoom:1,$Rotate:1,$Assembly:2049,$ChessMode:{$Column:15},$Easing:{$Left:$Jease$.$InCubic,$Top:$Jease$.$InCubic,$Zoom:$Jease$.$InCubic,$Opacity:$Jease$.$OutQuad,$Rotate:$Jease$.$InCubic},$Opacity:2,$Round:{$Rotate:0.7}},
            {$Duration:1000,x:0.5,y:0.3,$Cols:2,$Zoom:1,$Rotate:1,$SlideOut:true,$Assembly:2049,$ChessMode:{$Column:15},$Easing:{$Left:$Jease$.$InExpo,$Top:$Jease$.$InExpo,$Zoom:$Jease$.$InExpo,$Opacity:$Jease$.$Linear,$Rotate:$Jease$.$InExpo},$Opacity:2,$Round:{$Rotate:0.7}},
            {$Duration:1200,x:-4,y:2,$Rows:2,$Zoom:11,$Rotate:1,$Assembly:2049,$ChessMode:{$Row:28},$Easing:{$Left:$Jease$.$InCubic,$Top:$Jease$.$InCubic,$Zoom:$Jease$.$InCubic,$Opacity:$Jease$.$OutQuad,$Rotate:$Jease$.$InCubic},$Opacity:2,$Round:{$Rotate:0.7}},
            {$Duration:1200,x:1,y:2,$Cols:2,$Zoom:11,$Rotate:1,$Assembly:2049,$ChessMode:{$Column:19},$Easing:{$Left:$Jease$.$InCubic,$Top:$Jease$.$InCubic,$Zoom:$Jease$.$InCubic,$Opacity:$Jease$.$OutQuad,$Rotate:$Jease$.$InCubic},$Opacity:2,$Round:{$Rotate:0.8}}
          ];

          var jssor_1_options = {
            $AutoPlay: true,
            $SlideshowOptions: {
              $Class: $JssorSlideshowRunner$,
              $Transitions: jssor_1_SlideshowTransitions,
              $TransitionsOrder: 1
            },
            $ArrowNavigatorOptions: {
              $Class: $JssorArrowNavigator$
            },
            $ThumbnailNavigatorOptions: {
              $Class: $JssorThumbnailNavigator$,
              $Rows: 3,
              $Cols: 5,
              $SpacingX: 14,
              $SpacingY: 12,
              $Orientation: 2,
              $Align: 156
            }
          };

          var carImagesDetailsSlides = new $JssorSlider$("car_images_details_slides", jssor_1_options);
          var totalCount = carImagesDetailsSlides.$SlidesCount();

          function ScaleSlider() {
              var refSize = carImagesDetailsSlides.$Elmt.parentNode.clientWidth;
              if (refSize) {
                  refSize = Math.min(refSize, 1110);
                  refSize = Math.max(refSize, 300);
                  carImagesDetailsSlides.$ScaleWidth(refSize);
              }
              else {
                  window.setTimeout(ScaleSlider, 30);
              }
          }
          ScaleSlider();
          $(window).bind("load", ScaleSlider);
          $(window).bind("resize", ScaleSlider);
          $(window).bind("orientationchange", ScaleSlider);

          carImagesDetailsSlides.$On($JssorSlider$.$EVT_PARK, function(currendIndex) {
            $('.slides_count span').html((currendIndex + 1) + '/' + totalCount);
          });
        },
        map: function() {
          var mapObj = new mapObject.Map();
          var timer = null;
          //var map_btnTag = false;
          console.log(mapObj);

          mapObj.init();

          //点击显示选择区域框
          $(document).on('click', '.search', function() {
          	$('.search_area_list').removeClass('hide');
            $('.map_fs_con').addClass('hide');
          	$('.area_l span:first').trigger('mouseover');
          });

          //鼠标悬停切换热点区域
          $(document).on('mouseover', '.area_l span', function() {
            var $this = $(this);
            var key = $this.text();
            mapObj.findByArea(key);
            $this.addClass('active').siblings().removeClass('active');
          });

          //点击热点区域更新4s店列表和地图
          $(document).on('click', '.area_r span', function() {
            var $this = $(this);
          	var area = $('.area_l .active').text();
            var p = $this.attr('point').split(',');
          	var point = new BMap.Point(p[0], p[1]);
          	mapObj.userArea = area + ',' + $this.text();
            mapObj.myPoint = point;
          	mapObj.map.setZoom(14);
          	mapObj.setPlace();
          	$(".search_area_list").addClass('hide');
            $('.map_fs_con').removeClass('hide');
            //$("#tipMark").hide();
            console.log(mapObj);
          });

          $(document).on('mouseover', '.area_r span', function() {
            $(this).addClass('active');
          });
          $(document).on('mouseout', '.area_r span', function() {
            $(this).removeClass('active');
          });

          $(document).on('click', '.map_fs_con .fs_td', function() {
        		var p = $(this).parent().find('input').attr('point').split(',');
        		var point = new BMap.Point(p[0], p[1]);
        		mapObj.mPanTo(point);
        	});

          //点击选择4s店
        	$(document).on('click', '.chockBoxCls_UI', function() {
            var askpFsTag = false;
            var $this = $(this);
            var $td = $this.parents('td');
            var $b = $td.find('b'), $em = $td.find('em'), $span = $td.find('span');
        		var _input = $this.parent().parent().find('.chockBoxCls');

        		$('.fs_title_bg').remove();
            timer && clearTimeout(timer);

        		if (!askpFsTag) {
        			askpFsTag = true;
        		}

        		if ($b.is('.fs_seled')) {
        			$b.removeClass('fs_seled');
              $em.removeClass('fs_seled');
              $span.removeClass('fs_seled');
        			_input.prop('checked', false);
        		} else {
              $b.addClass('fs_seled');
              $em.addClass('fs_seled');
              $span.addClass('fs_seled');
        			_input.prop('checked', true);
        		}

        		var fsl = $('input[name="askpFs"]:checked');

        		if (fsl !== null && fsl.length > 3) {
        			$('.map_fs_con').append('<span class="fs_title_bg">一次最多只能选择3家4S店哦~请先去掉1家</span>');
              $b.removeClass('fs_seled');
              $em.removeClass('fs_seled');
              $span.removeClass('fs_seled');
        			_input.prop('checked', false);
        		} else {
        			var p = _input.attr('point').split(',');
        			var point = new BMap.Point(p[0], p[1]);
              var n = $('.fs_seled').length / 3;

        			if (_input.attr('checked') == 'checked') {
        				mapObj.mCheckPanTo(point, true);
        			} else {
        				mapObj.mCheckPanTo(point, false);
        			}

        			$('.map_fs_con').append('<span class="fs_title_bg">已选<i>' + n + '</i>家，还可以选<b>' + (3 - n) + '</b>家</span>');
        		}
            timer = setTimeout(function() {
              $('.fs_title_bg').remove();
            }, 2000);
        	});



          $(".m_center").on("click",function(){
          	if(buyAreaMarker!=null){
          		map.panTo(buyAreaMarker.getPosition());
          	}
          });

        	var map_btn2Tag = false;
        	$(".map_btn2").on('click',function() {
        		if (!map_btn2Tag) {
        			cnnzzHotPoint(34,'列表下一步');
        			map_btn2Tag = true;
        		}
        		mapNext();
        	});

        	$(".map_btn1").on("click", function() {
        		if (!map_btnTag) {
        			cnnzzHotPoint(33, '地图下一步');
        			map_btnTag = true;
        		}
        		mapNext();
        	});

          $(".fs_area_box").on("mouseleave",function() {
          	if ($("#tipMark").css("display") == 'none') {
          	   area_boxTime = setTimeout(function(){$(".fs_area_box").hide()}, 3000);
          	}
          });

          $(".info_win_close").on('click',function(e){
          	$(this).parent().hide();
          });

        }
      }

      $(function() {
        carParityDetail.tab();
        carParityDetail.showSlide();
        carParityDetail.map();

        $(".comparePricePopup").on("click",function(){
          $(".purchaseDemand").show()
        })

        $(".close").on("click",function(){
          $(".purchaseDemand").hide()
        })

        $(".direct_sale_recommend_list li").eq(0).addClass("first")
        $(".direct_sale_recommend_list li").eq(3).addClass("last")

        var taxPolicy = {
          full:"全额交税",
          minus:"减税",
          zero:"免税"
        }

        var taxPolicyList = $(".taxPolicy")

        for(i = 0;i < taxPolicyList.length; i++){
          switch(taxPolicyList[i].innerHTML){
            case "1":
              taxPolicyList[i].innerHTML = taxPolicy.full
              break;
            case "2":
              taxPolicyList[i].innerHTML = taxPolicy.minus
              break;
            case "3":
              taxPolicyList[i].innerHTML = taxPolicy.zero
              break;
          }
        }



        var subsidy = {
          no:"",
          yes:"补贴"
        }

        var subsidyList = $(".subSidy")

        for(i = 0;i < subsidyList.length; i++){
          switch(subsidyList[i].innerHTML){
            case "0":
              subsidyList.hide()
              break;
            case "1":
              subsidyList[i].innerHTML = subsidy.yes
              break;
          }
        }



        var historyPriceListLi = $(".history_price_list ul li")

        historyPriceListLi.eq(0).addClass('first')
        historyPriceListLi.eq(1).addClass('middle')
        historyPriceListLi.eq(2).addClass('last')

        var historyOrederButton = historyPriceListLi.eq(1).find("button").eq(1).removeClass('pay_btn').addClass('parity_btn comparePricePopup')
        historyOrederButton[0].innerHTML = "我也想去比价>"



        var historyOrderPriceDesc = {
          low:"报价过低",
          proper:"报价合理",
          high:"报价过高"
        }

        var historyPriceListDesc = $(".history_price_list ul li .content_item p b")

        for(i = 0;i < historyPriceListDesc.length; i++){
          switch(historyPriceListDesc[i].innerHTML){
            case "1":
              historyPriceListDesc[i].innerHTML = historyOrderPriceDesc.low;
              break;
            case "2":
              historyPriceListDesc[i].innerHTML = historyOrderPriceDesc.proper;
              break;
            case "3":
              historyPriceListDesc[i].innerHTML = historyOrderPriceDesc.high;
              break;
          }
          
        }



        var hasDsCar = {
          no:"",
          yes:"自营直销车"
        }

        var hasDsCarList = $(".hasDsCar")

        for(i = 0;i < hasDsCarList.length; i++){
          switch(hasDsCarList[i].innerHTML){
            case "0":
              hasDsCarList.hide()
              break;
            case "1":
              hasDsCarList[i].innerHTML = hasDsCar.yes;
              break;
          }
        }

      });

    });
  });
});
