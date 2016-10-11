let router = require('koa-router')();
var path = require('path');
var baseModel=require('../model/baseModel');
let carList = path.resolve(__dirname + '/../views/modules/saleList/carList.ejs');
function carModelList(){
	return [
		{"name": "全部", modelTypeId: "carType"},
		{name: "SUV", modelTypeId: "0"},
		{name: "跑车", modelTypeId: "1"},
		{name: "轿车", modelTypeId: "2"},
		{name: "MPV", modelTypeId: "3"},
		{name: "新能源", modelTypeId: "4"}
	];
}
function priceList(){
	return [
		{minPrice: 50000, maxPrice: 100000},
		{minPrice: 100000, maxPrice: 150000},
		{minPrice: 150000, maxPrice: 200000},
		{minPrice: 250000, maxPrice: 300000},
		{minPrice: 300000, maxPrice: 400000},
		{minPrice: 400000, maxPrice: 500000},
		{minPrice: 500000, maxPrice: 800000},
		{minPrice: 800000, maxPrice: -1}
	];
}
router.get('/:carBrand/:carType/:minPrice/:maxPrice/:descType', function *(next) {
	//品牌列表
	var cityCode="310000";
	var brandUrl='/ware/ds/car/brand'+cityCode+'?';
	var brandList=yield baseModel.get('/ware/ds/car/brand/'+cityCode,{});

	//直销车搜索列表
	var modelBrandId = this.params.carBrand == "carBrand" ? "noparameter" : this.params.carBrand;
	var modelTypeId = this.params.carType == "carType" ? "noparameter" : this.params.carType;
	var modelMinPrice =this.params.minPrice == "minPrice" ? 0 : this.params.minPrice;
	var modelMaxPrice =this.params.maxPrice == "maxPrice" ? -1 : this.params.maxPrice;
	var desc_type = this.params.descType == "descType" ? 1 :this.params.descType;
	var searchListData = {
		"modelBrandId":modelBrandId,
		"modelTypeId":modelTypeId,
		"page": 1,
		"modelMinPrice": modelMinPrice,
		"modelMaxPrice":modelMaxPrice,
		"descType": desc_type
	}
	var searchListUrl='/ware/ds/'+cityCode+'/car';
	var searchList=yield baseModel.get(searchListUrl,searchListData);

	//banner 广告列表
	var advertType="0";
	var advertPageType="1";
	var adUrl='/advert/'+cityCode+'/'+advertType+'/'+advertPageType;
	var bannerList=yield baseModel.get(adUrl,{});

	//render 渲染数据
	var modelBrandId=modelBrandId=="noparameter"?'carBrand':modelBrandId;
	var modelTypeId=modelTypeId=="noparameter"?'carType':modelTypeId;
	yield this.render('/direct_sale_list', {
		template: {
			"saleList": require('fs').readFileSync(carList, 'utf-8'),
		},
		saleList: searchList.data,
		brandList: brandList.data,
		carModelList: carModelList(),
		priceList: priceList(),
		modelBrandId: modelBrandId,
		modelTypeId: modelTypeId,
		modelMinPrice: modelMinPrice,
		modelMaxPrice: modelMaxPrice,
		desc_type: desc_type,
		topBanner: bannerList.data
	})
});
module.exports = router;








