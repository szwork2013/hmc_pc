var router = require('koa-router')();
var path=require('path');
var brandLogo=require('../model/brandLogo.json');
var baseModel=require('../model/baseModel');
var path = require('path');
var send = require('koa-send');
let request = require('../helpers/request_with_yield');
let selectCar = path.resolve(__dirname + '/../views/modules/carModel/select_brand.ejs');
let carList = path.resolve(__dirname + '/../views/modules/carModel/select_carModel.ejs');
let hotCar = path.resolve(__dirname + '/../views/modules/carModel/select_hotCar.ejs');

let shareOrder=path.resolve(__dirname + '/../views/modules/index/shareOrder.ejs');
let userInfo=path.resolve(__dirname + '/../views/modules/index/userInfo.ejs');
router.get('/', function *(next) {
	var cityCode = "310000";
	var url = '/ware/car/hot-car/' + cityCode;
	var data = {
		"cityCode": "310000",
		"pageSize": "8"
	};
	var hotCarList = yield baseModel.get(url, data);
	yield this.render('index', {
		hotCarList:hotCarList.data,
		brandLogo: brandLogo,
		templates: {
			brandList: require('fs').readFileSync(selectCar, 'utf-8'),
			carList: require('fs').readFileSync(carList, 'utf-8'),
			hotCar: require('fs').readFileSync(hotCar, 'utf-8'),
			shareOrder: require('fs').readFileSync(shareOrder, 'utf-8'),
			userInfo: require('fs').readFileSync(userInfo, 'utf-8')
		}
	});
})
module.exports = router;
