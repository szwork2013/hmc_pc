/**
 * Created by leafrontye on 16/8/24.
 */
define(['jquery','config','ejs'],function($,config,ejs){
	var self;
	var cityCode="310000";
	var popupBuy=$('#popupBuy');
	var popupBuyCar=$('.popup_buyCar');
	var popupSuccess=$('.popup_buySuccess')
	var purchase={
		init:function(ele){
			self=this;
			this.showPopup(ele);
			this.purchaseSubmit();
		},
		//代购显示弹窗
		showPopup:function(ele){
			var purchaseBtn=$(ele);
			purchaseBtn.click(function(){
				popupBuy.addClass('active');
				popupBuyCar.addClass('active');
			})
			$('#popupBuy,.popup_close,.popup_success_submit').click(function(){
				popupBuy.removeClass('active');
				popupBuyCar.removeClass('active');
				popupSuccess.removeClass('active');
			})
			$('.popup_buy_info').click(function(){
				$('.popup_brandList').removeClass('active');
			})
			var popupBuyList=$('#popupBuyList li');
			popupBuyList.click(function(e){
				e.stopPropagation();
				var index=$(this).index();
				$(this).toggleClass('active');
				$(this).siblings().find('.popup_brandList').removeClass('active');
				$(this).find('.popup_brandList').toggleClass('active');
			})
			$('.brandList').click(function(){
				self.getBrandList();
			})
		},
		////显示下拉菜单
		showMenu:function(){
			var brandMenu=$('.popup_brandMenu');
			brandMenu.each(function(i){
				var $this=$(this);
				$(this).find('dt,dd').click(function(e){
					e.stopPropagation();
					var carName=$(this).index()==0?$(this).text().slice(1):$(this).text();
					$this.parent().siblings().html(carName);
					$this.parent().removeClass('active');
				})
			})
			$('#brandList').find('dt,dd').click(function(){
				var brandId=$(this).data('brandid');
				$('#brandList').siblings().data('brandid',brandId);
				self.getCarType(brandId);
				$('.typeName').html('请选择车型')
			})
			$('#carTypeList').find('dt,dd').click(function(){
				var typeId=$(this).data('typeid');
				$('#carTypeList').siblings().data('typeid',typeId);
				self.getCarModel(typeId);
				$('.modelName').html('请选择款型');
			})
			$('#carModelList').find('dt,dd').click(function(){
				var modelId=$(this).data('modelid');
				$('#carModelList').siblings().data('modelid',modelId);
			})
	  },
		//获得品牌列表
		getBrandList:function(){
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
				success:function(data){
					if(data.status=="1"){
						var brandTpl='\
                <% for(var i=0;i<brandList.length;i++){%>\
                    <dl class="popup_brandMenu">\
                        <dt data-brandid="<%-brandList[i].list[0].topBrandId%>"><i class="brand_spell"><%-brandList[i].spell%></i><a href="javascript:;"><%-brandList[i].list[0].brandName%></a></dt>\
                       <% for(var j=1;j<brandList[i].list.length;j++){%>\
                        <dd data-brandid="<%-brandList[i].list[j].topBrandId%>"><a href="javascript:;"><%-brandList[i].list[j].brandName%></a></dd>\
                      <%}%>\
                    </dl>\
						    <%}%>';
						var brandHtml = ejs.render(brandTpl,{"brandList":data.data});
					  $('#brandList').html(brandHtml);
						self.showMenu();
					}else{

					}
				},
				error:function(){

				}
			})
		},
		//获取车型信息
		getCarType:function(brandId){
			var request={
				"time":new Date().getTime(),
				"source":"101"
			};
			$.ajax({
				type:"GET",
				url:config+'/ware/car/'+cityCode+'/'+brandId+'/car-type',
				contentType:"application/x-www-form-urlencoded",
				dataType:'json',
				data:request,
				success:function(data){
					if(data.status=="1"){
						var carTypeTpl='\
                <% var list=carType.carTypeList;for(var i=0;i<list.length;i++){%>\
                    <dl class="popup_brandMenu">\
												 <% for(var m=0;m<list[i].typeList.length;m++){%>\
													<dd data-typeid="<%-list[i].typeList[m].typeId%>"><a href="javascript:;"><%-list[i].typeList[m].typeName%></a></dd>\
                    	<%}%>\
                    </dl>\
						    <%}%>';
						var carTypeHtml = ejs.render(carTypeTpl,{"carType":data.data});
						$('#carTypeList').html(carTypeHtml);
						self.showMenu();
					}else{

					}
				},
				error:function(){

				}
			})
		},
		getCarModel:function(typeId){
			var request={
				"time":new Date().getTime(),
				"source":"101"
			};
			$.ajax({
				type:"GET",
				url:config+'/ware/car/'+cityCode+'/car-type/'+typeId+'/car-model',
				contentType:"application/x-www-form-urlencoded",
				dataType:'json',
				data:request,
				success:function(data){
					if(data.status=="1"){
						if(data.data!==null){
							var carModelTpl='\
                    <dl class="popup_brandMenu">\
                    <%if(carModel){%>\
											<%for(var i=0;i<carModel.length;i++){%>\
													<dd data-modelid="<%-carModel[i].modelId%>"><a href="javascript:;"><%-carModel[i].modelName%></a></dd>\
                    	<%}%>\
										<%}%>\
                    </dl>';
							var carModelHtml = ejs.render(carModelTpl,{"carModel":data.data});
							$('#carModelList').html(carModelHtml);
							self.showMenu();
						}else{
							$('#carModelList').html("");
							self.showToast('没有找到相关款型车');
						}
					}else{

					}
				},
				error:function(){

				}
			})
		},
		showToast:function(text){
			var tpl='<div class="attention_message"> <p class="message_box">'+text+'</p></div>';
			$('body').append(tpl);
			setTimeout(function(){
				$('.attention_message').remove();
			},1500);
		},
		//添加代购
		purchaseSubmit:function(){
			$('.popup_buy_submit').click(function(e){
				e.stopPropagation();
				var brandName=$.trim($('.brandName').text());
				var brandId=$('.brandName').data('brandid');
				var typeName=$.trim($('.typeName').text());
				var typeId=$('.typeName').data('typeid');
				var modelName=$.trim($('.modelName').text());
				var modelId=$('.modelName').data('modelid');
				var phone=$.trim($('.popup_tel').val());
				var userName=$.trim($('.popup_user').val());
				var phoneReg=/^(1[34578][0-9])\d{8}$/;
				if(brandName=="" || brandName=="请选择品牌"){
					self.showToast('品牌不能为空');
					return false;
				}
				if(typeName=="" || typeName=="请选择车型"){
					self.showToast('车型不能为空');
					return false;
				}
				if(modelName=="" || modelName=="请选择款型"){
					self.showToast('款型不能为空');
					return false;
				}
				if(phone==""){
					self.showToast('请输入手机号码');
					return false;
				}
				if(!phoneReg.test(phone)){
					self.showToast('请输入正确的手机号码');
					return false;
				}
				if(userName==""){
					self.showToast('请输入您的称呼');
					return false;
				}
				$.ajax({
					type:"POST",
					url:config+'/user/member/purchase/'+cityCode,
					dataType:'json',
					contentType:"application/x-www-form-urlencoded",
					data:JSON.stringify({
						time:new Date().getTime(),
						source:"101",
					  data:{
							purchaseUserPhone:phone,
							purchaseUserName:userName,
							purchaseBrandId:brandId,
							purchaseBrandName:brandName,
							purchaseTypeId:typeId,
							purchaseTypeName:typeName,
							purchaseModelId:modelId,
							purchaseModelName:modelName
						}
					}),
					success:function(data){
						if(data.status==1){
							popupBuyCar.toggleClass('active');
							popupSuccess.toggleClass('active');
						}else if(data.errorCode="U-0010"){
							self.showToast(data.msg);
						}else{
						}
					},
					error:function(){

					}
				})
			})
		}
	}
	return purchase;
})