/**
 * Created by leafrontye on 16/7/29.
 */
var router = require('koa-router')();
var querystring=require('querystring');
var path=require('path');
var baseModel=require('../model/baseModel');
function FormatNumberWithComma(priceNumber){
	let numberSplitArray = String.prototype.split.call(priceNumber,'')
	let formatedNumber = ''

	for(let i = numberSplitArray.length - 1 , commaIndex = 3; i >= 0; i--){
		if(commaIndex === 0){
			formatedNumber = ',' + formatedNumber
			commaIndex = 3;
		}
		commaIndex--
		formatedNumber = numberSplitArray[i] + formatedNumber
	}
	return formatedNumber
}
router.get('/:modelId', function *(next) {
	var modelId=this.params.modelId;
	var params=querystring.parse(this.req._parsedUrl.query);
	var color=params.color;
	var license=parseInt(params.license);  //是(牌照类型,1沪牌 2外牌)
	var buyWay=params.buyWay;
	var cityCode='310000';
	var url='/ware/ds/car/purintent/'+modelId+'/'+license+'/'+cityCode;
	var data=yield baseModel.get(url,{});
	var getIntent=data.data;
	var dsCarModel=getIntent.dsCarModelPrientVo;
	dsCarModel.color=color,
	dsCarModel.license=license;
	dsCarModel.buyWay=buyWay;
	var dsrp=getIntent.dsCarModelPrientVo.dsrp //直销价
	var msrp=getIntent.dsCarModelPrientVo.msrp //指导价

	getIntent.loanScheme=loanScheme();
	getIntent.purchaseTax=FormatNumberWithComma(purchaseTax());
	getIntent.premiums=FormatNumberWithComma(premiums());
	getIntent.floorPrice=floorPrice();
	getIntent.savePrice=savePrice();

	//贷款方案
	function loanScheme(){
		var month=[12,24,36];
		var percent=[0.3,0.4,0.5,0.6,0.7];
		var result=[];
		for(var i=0;i<percent.length;i++){
			for(var j=0;j<month.length;j++){
				var obj={};
				obj.percent=percent[i]*100+'%'; //百分比例
				obj.stage=month[j];  //分期数
				obj.loan=FormatNumberWithComma(parseInt(dsrp*(1-percent[i]).toFixed(1)));  //贷款金额
				obj.interest=FormatNumberWithComma(parseInt(dsrp*(1-percent[i]).toFixed(1)*(1+(month[j]/12)*0.04)/month[j]));  //月供利息
				obj.firstPayment=FormatNumberWithComma(parseInt(dsrp*percent[i]));
				result.push(obj);
			}
		}
		return result;
	}
	//购置税
	function purchaseTax(){
		var purchaseTax;
		var modelTaxPolicy=getIntent.modelTaxPolicy;
		if(modelTaxPolicy=="1"){
			purchaseTax=parseInt(dsrp/11.7);
		}else if(modelTaxPolicy=="2"){
			purchaseTax=parseInt(dsrp/11.7/2);
		}else if(modelTaxPolicy=="3"){
			purchaseTax=0;
		}
		return purchaseTax
	}
	//保险费
	function premiums(){
		var insurance=950;//交强险
		var carDamage=593+dsrp*0.0141;//车损险
		var thirdPartyInsurance =1516;//第三方责任险
		var premiums=parseInt((insurance+((carDamage+thirdPartyInsurance)*1.15)*0.855)*1.1);
		return premiums;
	}
	function floorPrice(){
		getIntent.licenses[0].locations[0].price=4500;
		var totalPrice=getIntent.licenses[0].locations[0].price+1000+purchaseTax()+premiums()+dsrp;
		if(buyWay=="贷款" || buyWay=="贷款+置换"){
			totalPrice=parseInt(totalPrice+dsrp*(1-0.3)*(1*0.04));
		}
		return FormatNumberWithComma(totalPrice);
	}
	function savePrice(){
			var totalPrice=50+4598;
		 return FormatNumberWithComma(msrp-dsrp+totalPrice)
	}
	yield this.render('/price', {
		getIntent:getIntent
	});
});
module.exports = router;
