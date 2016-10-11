/**
 * Created by leafrontye on 16/8/1.
 */
require(['config/main'], function () {
	require(['jquery','polyfill','ejs','config','purchase'], function ($,polyfill,ejs,config,purchase) {
		var page=1;
		var self;
		var cityCode='310000';
		var SaleList=function(){
			self=this;
			this.init();
			purchase.init('.purchasing_btn');
		}
		SaleList.prototype = {
			constructor:'SaleList',
			init:function(){
				this.selectActive();
				this.banner('.banner_list','.banner_btn');
				this.banner('.bot_banner_list','.bot_banner_btn');
				$('.carList_more').click(function(){
					page++;
					self.carListMore();
				})
			},
			//品牌选中效果和车型价格
			selectActive:function(){
				$('#brandMenu li,#modelMenu li,#priceMenu li').click(function(e){
					$(this).addClass('active').siblings().removeClass('active');
				})
				var carListTop=$('.carList_cont').offset().top;
				if(parseInt($('.carList').css('height'))>580){
					$(window).scroll(function(){
							var scrollTop=$(this).scrollTop();
							var elemTop=$(document).height()-$(window).height()-494;
							var posTop=$(document).height()-$(window).height()-scrollTop;
							if(scrollTop>=elemTop){
								$('.carList_cont').css({'position':'fixed',bottom:494-posTop,top:'auto'});
								return;
							}
						if(scrollTop>carListTop){
							$('.carList_cont').css({'position':'fixed','top':0});
						}else{
							$('.carList_cont').css({'position':'static'});
						}
					})
				}
			},
			banner:function(banner,aBtn){
				var timer=null;
				var i=0;
				var $bannerList=$(banner);
				var $aLi=$(banner).find('li');
				$bannerList.css('width',100*$aLi.length+'%');
				$aLi.css('width',100/$aLi.length+'%');
				var $menuLi=$(aBtn).find('a');
				$menuLi.click(function(){
					var index=$(this).index();
					togglePic(index);
				})
				function togglePic(index){
					$bannerList.animate({'left':-$aLi.outerWidth(true)*index},600);
					$menuLi.eq(index).addClass('active').siblings().removeClass('active');
				}
				$('.banner_close').click(function(){
					$('.banner').hide();
				})
			},

			//加载更多车型
			carListMore:function(){
				var pathName=location.pathname.split('/');
				var modelBrandId=pathName[2]=="carBrand" ? "noparameter":pathName[2];
				var modelTypeId=pathName[3]=="carType" ? "noparameter":pathName[3];
				var modelMinPrice=pathName[4]=="minPrice" ? 0: pathName[4];
				var modelMaxPrice=pathName[5]=="maxPrice" ? -1:pathName[5];
				var desc_type=pathName[6]=="descType" ? 1 : pathName[6];
				$.ajax({
					type:"GET",
					url:config+'/ware/ds/'+cityCode+'/car',
					dataType:'json',
					data:{
						"time":new Date().getTime(),
						"source":"101",
						"page":page,
						"modelBrandId":modelBrandId,
						"modelTypeId":modelTypeId,
						"modelMinPrice":modelMinPrice,
						"modelMaxPrice":modelMaxPrice,
						"descType":desc_type
					},
					success:function(data){
						if(data.status=="1"){
							if(data.data.recordList.length>0){
								var html = ejs.render(template.saleList, {"saleList": data.data});
								$('#carListModel').append(html);
							}else{
								$('.carList_more').hide();
								$('.carList_empty').show();
							}
						}else{

						}
					},
					error:function(){

					}
				})
			}
		}
		new SaleList();
	});
});
