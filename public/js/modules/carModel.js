define(['jquery','polyfill','ejs','config'], function($,polyfill,ejs,config) {
	var $chooseCar=$('.chooseCar');
	var $popupBrand=$('#popup-brand');
	var $popupClose=$('#popupClose');
	var $popupCont=$('.home-popup-cont');
	var brandId=null;
	var self;
	var cityCode="310000";
	var SelectCarType=function(){
		self=this;
	}
	SelectCarType.prototype = {
		constructor:'SelectCarType',
		showCar:function(ele){
			$popupBrand.addClass('active');
			$popupCont.addClass('active');
			this.showBrand();
		},
		showPopupBrand: function(ele) {//显示弹出层
			//点击显示
			this.carTypeListLink(ele);
			$chooseCar.click(function(){
				self.showCar(ele);
				self.hotCarList();
			});
			$(".home-popup-menu").on('click','.brand-cat-item',function(){
				brandId=$(this).data('brandid');
				self.showCarModel(ele);
			})
			$(ele).click(function(){
				self.showCar();
				brandId=$(this).data('brandid');
				$('.brand-cat-item').each(function(i) {
					var brandCatId = $(this).data('brandid');
					if (brandId == brandCatId) {
						$(this).addClass('active').parent().parent().addClass('active');
					}
				})
				self.showCarModel(ele);
			})
			//点击关闭
			$('#popup-brand,#popupClose').click(function(){
				$popupBrand.removeClass('active');
				$popupCont.removeClass('active');
				$('body').removeClass('overflow');
			})
		},
		//显示车型列表滚动
		carTypeListLink:function(ele){
			$('.home-popup-cont').on('click','.carType_menu li',function(){
				$(this).addClass('active').siblings().removeClass('active');
				var index=$(this).index();
				document.getElementsByClassName('home-brand-pic')[index].scrollIntoView();
			})
		},
		clickActive:function(){
			$('.brand-cat').each(function(i){
				$(this).find('dd').click(function(){
					$('.brand-cat').eq(i).addClass('active').siblings('.brand-cat').removeClass('active');
				})
				$(this).find('.brand-cat-item').click(function(){
					var index=$(this).index();
					$('.brand-cat-item').removeClass('active');
					$(this).addClass('active')
				})
			})
		},
		showBrand:function(){//显示品牌
			var request={
				"time":new Date().getTime(),
				"source":"101"
			};
			$.ajax({
				type:"GET",
				url:config+'/ware/car/car-brand/'+cityCode,
				dataType:'json',
				contentType:"application/x-www-form-urlencoded",
				data:request,
				async:false,
				success:function(data){
					if(data.status=="1"){
						var html = ejs.render(templates.brandList,{"brandList":data.data});
						$('.home-popup-menu').html(html);
						self.clickActive();
					}else{

					}
				},
				error:function(){

				}
			})
		},
		//显示热门车型
		hotCarList:function(){
			var request={
				"time":new Date().getTime(),
				"source":"101",
				"cityCode":"310000"
			};
			$.ajax({
				type:"GET",
				url:config+'/ware/car/hot-car/'+cityCode,
				dataType:'json',
				contentType:"application/x-www-form-urlencoded",
				data:request,
				success:function(data){
					if(data.status=="1"){
						var html = ejs.render(templates.hotCar, {"hotCar": data.data});
						$('.home-popup-pic').html(html);
						$('.home-brand-img').on('scroll',self.throttle(function(){
							$('body').addClass('overflow');
						},500,1000))
					}else{

					}
				},
				error:function(){

				}
			})
		},
		throttle:function	(func, wait, mustRun) {
			var timeout,
				startTime = new Date();
			return function() {
				var context = this,
					args = arguments,
					curTime = new Date();
				clearTimeout(timeout);
				// 如果达到了规定的触发时间间隔，触发 handler
				if(curTime - startTime >= mustRun){
					func.apply(context,args);
					startTime = curTime;
					// 没达到触发间隔，重新设定定时器
				}else{
					timeout = setTimeout(func, wait);
				}
			};
		},
		carModelScroll:function(){
			var eleHeight=[];
			$('.home-brand-pic').each(function(i){
				var eleTop=$(this).offset().top;
				if(i==0){
					eleHeight.push(eleTop);
				}
				else{
					eleHeight.push(eleTop);
				}
			})
			var homeBrandHeight=$('.home-brand-img').outerHeight(true);
			$('.home-brand-img').on('scroll',self.throttle(function(){
				$('body').addClass('overflow');
				var eleTop=$('.home-brand-img').scrollTop();
				for(var i=0;i<eleHeight.length;i++){
					if(eleTop>=0 && eleTop<eleHeight[i]){
						$('.carType_menu li').eq(i).addClass('active').siblings().removeClass('active');
						break;
					}
				}
			},200,500))
		},
		showCarModel:function(ele){//显示车型
			var request={
				"time":new Date().getTime(),
				"source":"101",
				"cityCode":"310000"
			};
			$.ajax({
				type:"GET",
				url:config+'/ware/car/'+cityCode+'/'+brandId+'/car-type',
				contentType:"application/x-www-form-urlencoded",
				dataType:'json',
				data:request,
				success:function(data){
					if(data.status=="1" && data.data){
						var html = ejs.render(templates.carList, {"carList": data.data});
						$('.home-popup-pic').html(html);
						self.carModelScroll();
					}else{
						$('.home-popup-pic').html('<p class="tips_txt">没有找到相关车型</p>');
					}
				},
				error:function(){

				}
			})
		}
	}
	return new SelectCarType;
});
