/**
 * Created by leafrontye on 16/8/1.
 */
require(['config/main'], function () {
	require(['jquery','ejs','config','pingpp'], function ($,ejs,config,pingpp) {
		//var config='http://10.0.1.20:8080';
		var self;
		var popup=$('#popup');
		var paySuccess=$('.pay_success');
		var payInfo=$('.pay_info');
		var popupPrice=$('.popup_price');
		var percent=0.3;
		var carModel=getIntent.dsCarModelPrientVo;
		var cityCode="310000"
		var dsrp=carModel.dsrp //直销价
		var msrp=carModel.dsrp //官方指导价
		var orderId;
		var stage=1;
		var accessToken = "NGM0MjY5N2RjMWU4NDdlOGJhMzZhMGI0ZTAxNTNkMjkjMTAxI0FUI0MlKCUzUHBe";
		var userId="4c42697dc1e847e8ba36a0b4e0153d29";
		var subject="直销车订金";
		var time=new Date().getTime();
		var source="101";
		var Price=function(){
			self=this;
			this.init();
		}
		Price.prototype = {
			constructor:'Price',
			init:function(){
				this.insurancePopup();
				this.payInfo();
				this.showLicense();
				this.payOrder();
				this.payDeposit();
				//this.payVoucher();
			},
			FormatNumberWithComma:function (priceNumber){
				var numberSplitArray = String.prototype.split.call(priceNumber,'')
				var formatedNumber = ''
				for(var i = numberSplitArray.length - 1 , commaIndex = 3; i >= 0; i--){
					if(commaIndex === 0){
						formatedNumber = ',' + formatedNumber
						commaIndex = 3;
					}
					commaIndex--
					formatedNumber = numberSplitArray[i] + formatedNumber
				}
				return formatedNumber
			},
			payInfo:function(){
				var payBtn=$('#payBtn');
				payBtn.click(function(){
					popup.addClass('active');
					payInfo.addClass('active');
				})
				$('#popup,.popup_close').click(function(){
					popup.removeClass('active');
					payInfo.removeClass('active');
					paySuccess.removeClass('active');
				})
			},
			floorPrice:function(percent,stage){//计算落地价格
				var purchaseTax=parseInt(this.getNumber(getIntent.purchaseTax));	//购置税
				var premiums=parseInt(this.getNumber(getIntent.premiums));//保险费
				var licensePrice; //牌照费用
				$('.license_list').each(function(){
					if($(this).css('display')=='block'){
						licensePrice=parseInt($(this).find('.license_price').text());
					}
				})
				//1000服务费
				var totalPrice=1000+licensePrice+purchaseTax+premiums+dsrp;
				if(carModel.buyWay=="贷款" || carModel.buyWay=="贷款+置换"){
					totalPrice=parseInt(totalPrice+dsrp*(1-percent)*(stage*0.04));
				}
				return self.FormatNumberWithComma(totalPrice);
			},
			showLicense:function(){	//显示贷款方案信息
				$('.loan_interestBtn').click(function(e){
					e.stopPropagation();
					$(this).toggleClass('active');
					$('.loan_interest_list').toggle();
				})
				//点击贷款方案显示不同
				$('.loan_interest_list li').click(function(e){
					e.stopPropagation();
					var text=$(this).html();
					var _percent=$(this).data('percent');
					var _stage=$(this).data('stage');
					stage=_stage/12;
					$(this).parent().prev('.loan_interestBtn').html(text).toggleClass('active')
					$(this).parent().prev('.loan_interestBtn').data({'percent':_percent,'stage':_stage});
					$(this).parent().toggle();
					//计算贷款手续费
					//$('#loanMoney').html(stageFeel);
					percent=(_percent.slice(0,-1)/100);
					var savePrice=parseInt(self.getNumber(getIntent.savePrice));
					savePrice=self.FormatNumberWithComma(savePrice);
					//计算节约价格
					$('#savePrice').html(savePrice);
					//计算算总价

					var floorPrice=self.floorPrice(percent,stage);
					$('#floorPrice').html(floorPrice);

					//计算首付金额
					var firstpayment=self.FormatNumberWithComma(parseInt(dsrp*percent));
					$('#paymentAmount').html(firstpayment);
				})
				$('.js_license_item').click(function(e){
					e.stopPropagation();
					var priceFeel=$(this).data('price');
					var index=$(this).index();
					$(this).addClass('active').siblings().removeClass('active');
					$('.license_list').hide();
					$('.license_list').eq(index).show();
					$('.license_list').eq(index).find('.license_price').html('<em>'+priceFeel+'</em>'+'元');
					var floorPrice=self.floorPrice(percent,stage);
					$('#floorPrice').html(floorPrice);
				})
				$('.license_select').click(function(e){
					e.stopPropagation();
					$(this).next('.license_carModel_list').toggle();
					$(this).toggleClass('active');
				})
				$('.license_carModel_list li').click(function(e){
					e.stopPropagation();
					var text=$(this).text();
					$(this).parent().prev('.license_select').html(text).toggleClass('active');
					var priceLicense=$(this).data('price');
					$('.license_price').html('<em>'+priceLicense+'</em>'+'元');
					$(this).parent().toggle();
					$('.js_license_item').each(function(){
						if($(this).hasClass('active')){
							$(this).data('price',priceLicense);
						}
					})
					var floorPrice=self.floorPrice(percent,stage);
					$('#floorPrice').html(floorPrice);
				})

				//选择银行和选择中国人保
				$('.loan_payment_list li,.insurance_money_list li').click(function(e){
					e.stopPropagation();
					var text=$(this).text();
					$(this).parent().prev('.loan_blank,.car_insurance').html(text).toggleClass('active');
					$(this).parent().toggle();
				})
				$(document).click(function(){
					$('.loan_payment_list,.loan_interest_list,.license_carModel_list,.insurance_money_list').hide();
				})
				$('.loan_blank,.car_insurance').click(function(e){
					e.stopPropagation();
					$(this).toggleClass('active');
					$(this).next('.loan_payment_list,.insurance_money_list').toggle();
				})

			},
			//把分隔符数字转换为数字
			getNumber:function(number){
				return number.replace(/\,/gm,'');
			},
			//显示了解弹出层
			insurancePopup:function(){
				$('.know_insurance').click(function(e){
					popupPrice.addClass('active');
					popup.addClass('active');
				})
				$('#popup,.popup_close').click(function(e){
					popupPrice.removeClass('active');
					popup.removeClass('active');
				})
				$('.popup_price_menu li').click(function(){
					var index=$(this).index();
					$(this).addClass('active').siblings().removeClass('active');
					$('.popup_price_tab').eq(index).show().siblings('.popup_price_tab').hide();
				})
			},
			//提交订单
			payOrder:function(){
				var data={};
				data.time=time;
				data.source=source;
				var addPurchaseintent={};
				$('#payStore,#payBtn').click(function(){
					var licenseLocation; //上牌地点
					$('.license_list').each(function(){
						if($(this).css('display')=='block'){
							licenseLocation=$(this).find('.license_select').text();
						}
					})
					addPurchaseintent.licenseLocation=licenseLocation;
					addPurchaseintent.carModelId=carModel.modelId; //款型id
					var piHuKou="0"; //是否是本地户口
					if($('.js_license_item.active').html()=='上海籍上外牌'){
						piHuKou="1";
					}
					addPurchaseintent.piHukou=piHuKou;
					addPurchaseintent.downpaymentPercent=$('.loan_interestBtn').data('percent'); //首付比例
					addPurchaseintent.loanInstallmentNum=String($('.loan_interestBtn').data('stage')/12) || null;      //贷款年限
					var piLoan="0"; //是否贷款
					if(carModel.buyWay=="贷款+置换" || carModel.buyWay=="贷款"){
						piLoan="1";
					}
					addPurchaseintent.piLoan=piLoan
					addPurchaseintent.loanBankId="0";  //贷款银行id
					addPurchaseintent.loanBankName=$('.loan_blank').text() //贷款银行名称
					addPurchaseintent.carInsuranceOption="1"; //保险组合(默认)
					addPurchaseintent.carInsuranceCompanyId="0"; //保险公司序号(默认)
					addPurchaseintent.carInsuranceCompanyName=$('.car_insurance').text();  //保险公司名称
					addPurchaseintent.carInsurancePrice=$.trim($('#premiums').text()); //保险费用
					addPurchaseintent.licensePrice=parseInt($('#licensePrice').text());  //牌照价格
					addPurchaseintent.servicePrice=parseInt(self.getNumber($('#servicePrice').text()));   //服务费
					addPurchaseintent.taxPrice=$('#purchaseTax_money').text() //购置税
					addPurchaseintent.dsrp=dsrp;  //直销价
					addPurchaseintent.msrp=msrp;  //官方指导价
					addPurchaseintent.sumPrice=$('#floorPrice').text().slice(0,-1);  //总价
					addPurchaseintent.piSaveMoney=$.trim($('#savePrice').text());  //总节省金额
					addPurchaseintent.piColorName=carModel.color;  //款型颜色名称
					//	addPurchaseintent.autoReplaceCar=$('.displace_car').val();
					var isPay=0; //	是否支付，0-否（暂存），1-是（下订）
					if($(this).data('ispay')==1){
						isPay=1;
					}
					addPurchaseintent.isPay=isPay;
					addPurchaseintent.cityCode=cityCode; //城市编码
					data.data=addPurchaseintent;
					$.ajax({
						type: "POST",
						url:config+'/ds/trade/purchaseintent',
						beforeSend:function(xhr){
							xhr.setRequestHeader('accessToken',accessToken);
						},
						contentType: "application/json",
						dataType: 'json',
						async:false,
						data: JSON.stringify(data),
						success: function (data) {
							if (data.status=="1"){
								orderId=data.data;
								if(isPay==0){
									//进入个人中心订单
									window.location.href='/user_center/123/my_direct_sale_list';
								}
							} else {

							}
						},
						error: function () {

						}
					})
				})
			},
			//支付订金
			payDeposit:function(){
				var data={};
				var payData={};
				data.time=time;
				data.source=source;
				payData.userId=userId;
				$('.pay_submit').click(function(){
					payData.order_no=orderId;
					var userName=$.trim($('.pay_user').val());
					var userPhone=$.trim($('.pay_tel').val());
					payData.amount=500;
					payData.subject=subject;
					payData.channel="alipay_pc_direct";//channel // alipay_pc_direct alipay_wap
					payData.body=carModel.modelBrandName+carModel.modelTypeName+carModel.modelName; //商品描述
					payData.time_expire=30;
					payData.successUrl="http://www.haomaiche.com";  //url 地址
					payData.cancelUrl="http://www.haomaiche.com";
					data.data=payData;
					$.ajax({
						type: "POST",
						url: config+'/pay/before',
						beforeSend:function(xhr){
							xhr.setRequestHeader('accessToken',accessToken);
						},
						contentType: "application/json",
						dataType: 'json',
						async:false,
						data: JSON.stringify(data),
						success:function(data){
							if(data.status=="1"){
								//支付,使用ping++
								pingpp.createPayment(data.data, function(result, err){
								})
							}else{

							}
						},
						error:function(){

						}
					})
				})
			},
			querystring :function (queryString) {
				var args = new Object();
				var query = location.search.substring(1); // Get query string
				var pairs = query.split("&"); // Break at ampersand
				for (var i = 0; i < pairs.length; i++) {
					var pos = pairs[i].indexOf('='); // Look for "name=value"
					if (pos == -1) continue; // If not found, skip
					var argname = pairs[i].substring(0, pos); // Extract the name
					var value = pairs[i].substring(pos + 1); // Extract the value
					value = decodeURIComponent(value); // Decode it, if needed
					args[argname] = value; // Store as a property
				}
				return args[queryString]; // Return the object

			},
			//支付凭证
			payVoucher:function(){
				var isorderId=this.querystring('orderId');
				if(isorderId){
					var data= {
						"amount": 500,
						"sourceSum": 125023,
						"askpCode": "X160303181947357",
						"phone": "185****7679",
						"orderPayTime": "2016/08/26 06:27",
						"payer": "刘测试",
						"payee": "好买车(上海轩言网络信息科技有限公司)",
						"payWay": "在线支付",
						"transactionNo": "2016030321001004700284798952"
					};
					$.ajax({
						type:"GET",
						dataType:"json",
						async:false,
						contentType:"application/x-www-form-urlencoded",
						url:config+'/pay/proof/'+subject+'/'+orderId,
						data:{
							source:source,
							time:time
						},
						success:function(data){
							if(data.status=="1"){
							}else{

							}
						},
						error:function(){

						}
					})
					var html=ejs.render(paySuccessTpl,{"payInfo":data});
					$('.pay_success_top').html(html);
					popup.addClass('active');
					payInfo.toggleClass('active');
					paySuccess.addClass('active');
				}
			}
		}
		new Price();
	});
});
