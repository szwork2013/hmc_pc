require(['config/main'], function () {
	require(['carModel','polyfill','ejs','config'], function (carModel,polyfill,ejs,config) {
		var self;
		var cityCode='310000';
		var inputSearch=$('.header_search');
		var searchList=$('.search_list');
		var Home=function(){
			self=this;
			this.init();
		}
		Home.prototype={
			constructor:'Home',
			init: function () {
				carModel.showPopupBrand('.brandLogo-item');
				this.selectMap();
				this.firstUse();
				this.navBrand();
				this.shareOrder();
				this.singleOrder();
				this.selectCity();
				this.shopCart();
				this.mySearch();
				//this.orderPic();
			},
			selectMap: function () {
				var mapMenu = $('#mapMenu li');
				mapMenu.click(function (){
					var index = $(this).index();
					mapMenu.eq(index).find('.map-arrow').toggleClass('map-arrow-active');
					$('.map-tab').eq(index).toggle().siblings('.map-tab').hide();
				})
			},
			//订单预览
			orderPic:function(){
				var orderPic=$('#orderPic');
				var popupOrder=$('.popup_order');
				var popupOrderPic=$('.popup_orderPic');
				orderPic.click(function(){
					popupOrder.toggleClass('active');
					popupOrderPic.toggleClass('active');
				})
				$('.popupOrder_close,.popup_order').click(function(){
					popupOrder.toggleClass('active');
					popupOrderPic.toggleClass('active');
					$('body').removeClass('overflow');
				})
				popupOrderPic.scroll(function(){
					$('body').addClass('overflow');
				})
			},
			//选择城市
			selectCity:function(){
				$('#cityList').click(function(e){
					e.stopPropagation();
					$(this).toggleClass('active');
					$('.header_city_cat').toggleClass('active');
				})
				$('.home-banner').click(function(){
					$('.header_city_cat').removeClass('active');
					$('.carModel_list').removeClass('active');
					searchList.removeClass('active');
					inputSearch.removeClass('list_active');
				})
			},
			//我的购物车
			shopCart:function(){
				$('.carList_ico').click(function(e){
					e.stopPropagation();
					$('.carModel_list').toggleClass('active');
				})
			},
			//我的搜索
			mySearch:function(){
				if(navigator.userAgent.indexOf('MSIE')>0){
					//ie
					document.getElementsByClassName('header_search')[0].onpropertychange=self.searchResult();
				}else{
					document.getElementsByClassName("header_search")[0].addEventListener("input", self.searchResult, false);
				}
				inputSearch.keydown(function(e){
					if(e.keyCode==13){
						self.searchResult();
					}
				})

			},
			//搜索结果
			searchResult:function(){
				var searchWord=$.trim(inputSearch.val());
				$.ajax({
					type:"GET",
					url:config+'/ware/car/'+cityCode+'/car-type',
					dataType:"json",
					contentType:"application/x-www-form-urlencoded",
					data:{
						"time":new Date().getTime(),
						"source":"101",
						"queryMsg":searchWord
					},
					success:function(data){
						if(data.status==1){
							if(data.data!==null){
								var searchTpl='\
									<%for(var i=0;i<brandList.length;i++){%>\
										<li><a href="/car_parity_detail/<%-brandList[i].typeId%>"><%-brandList[i].brandName%><%-brandList[i].typeName%></a></li>\
									<%}%>';
								var html=ejs.render(searchTpl,{brandList:data.data})
								searchList.html(html);
								searchList.addClass('active');
								inputSearch.addClass('list_active');
							}else{
								searchList.html('<li><a href="javascript:;">没有搜索到相关结果</a></li>');
							}
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
			//初次使用
			firstUse: function () {
				var firstUse = $('.first_use');
				$('#firstOpen').click(function () {
					firstUse.show();
					$('#header').css('position','static');
				})
				$('.firstUser_close,.select_car_btn').click(function () {
					firstUse.hide();
					$('#header').css('position','fixed');
				})
				var headerHeight=$('#header').height();
				$(window).on('scroll.firstUse',self.throttle(function () {
					$('.header_city_cat').removeClass('active');
					$('.carModel_list').removeClass('active');
					$('#header').css('position','fixed');
					searchList.removeClass('active');
					inputSearch.removeClass('list_active');
					var scrollTop = $(window).scrollTop();
					if (scrollTop >= 580 && parseInt(firstUse.css('height')) == 580) {
						firstUse.hide();
					}
					if(scrollTop>headerHeight){
						$('.header_mask').css({'opacity':0.85});
					}else{
						$('.header_mask').css({'opacity':0.2});
					}
				},100,200));
			},
			//导航品牌切换
			navBrand:function(){
				var oUl=$('.brand-list-menu');
				var aEle=oUl.find('li');
				var oPrev=$('.brand-prev');
				var oNext=$('.brand-next');
				var iW=$('.brandLogo-item').outerWidth(true);
				var iNum=10;
				var i=0;
				oUl.css({ width:iW * aEle.length});
				function next(){
					if(i<=0){
						i=0;
					}
					else if(i>=aEle.length-iNum){
						i=aEle.length-iNum;
					}
					oUl.animate({ left:-iW * i},500);
				}
				oPrev.click(function(){
					i=i-10;
					next();
				});

				oNext.click(function(){
					i=i+10;
					next();
				});
			},
			//处理时间方法
			getDate:function(){
				return function(time){
					return new Date(time).toLocaleString().slice(0,9).replace(/\-/gm,'/')
				}
			},
			//单条用户分享晒单
			singleOrder:function(){
				$('.member-list').on('click','.member-list-menu li',function(){
					var userId=$(this).data('userid');
					$(this).addClass('active').siblings().removeClass('active');
					$.ajax({
						type: "GET",
						url: config+'/user/member/timeline/'+cityCode,
						contentType: "application/json",
						dataType: 'json',
						async: false,
						data: {
							"time":new Date().getTime(),
							"source":"101",
							"userId":userId
						},
						success: function (data) {
							var data=data.data;
							if (data.status == "1" && $.isEmptyObject(data)) {
									var html = ejs.render(templates.shareOrder, {"userInfo": data, getDate: self.getDate()});
									$('.track_records').html(html);
							}else{
								$('.member-list').hide();
							}
						},
						error: function () {
						}
					})
				})
			},
			scrollLoad:function(scrollTop,memberListTop){
				if (scrollTop > memberListTop) {
					$(window).off('scroll.order');
					$.ajax({
						type: "GET",
						url: config+'/user/member/timeline-users/'+cityCode,
						contentType: "application/json",
						dataType: 'json',
						async: false,
						data: {
							"time":new Date().getTime(),
							"source":"101"
						},
						success: function (data) {
							var data=data.data;
							if (data.status == "1" && $.isEmptyObject(data.data)) {
									var userInfoTpl = ejs.render(templates.userInfo, {"userInfo": data});
									var shareTpl = ejs.render(templates.shareOrder, {"userInfo": data, getDate: self.getDate()});
									$('.member-list').html(userInfoTpl+'<div class="track_records">'+shareTpl+'</div>')
							}else{
								$('.member-list').hide();
							}
						},
						error: function () {

						}
					})
				}
			},
			//分享晒单
			shareOrder:function() {
				var data={};
				var winScrollTop=$(window).scrollTop();
				var memberListTop = $('.member-info').offset().top - $(window).height();
				self.scrollLoad(winScrollTop,memberListTop);
				$(window).on('scroll.order',function () {
					var scrollTop = $(this).scrollTop();
					self.scrollLoad(scrollTop,memberListTop);
				})
			}
		}
		new Home();
	});
});


