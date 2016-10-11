let router = require('koa-router')();
let path = require('path');
// let url = path.resolve(__dirname + '/../views/modules/demo.ejs');
let _request = require('request');
let querystring = require('querystring');

function request(options) {
  return function thunk(cb) {
    _request(options, cb);
  };
}

function *getParityTopInfo(cityCode , qsData , carTypeId){
  const uri = 'http://10.0.0.100:20010/ware/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '/car-type/' + carTypeId + '?' + qsData
  });


  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }
}

function *getParityHistoryOrder(cityCode , qsData , carTypeId){
  const uri = 'http://10.0.0.100:20010/respond/show/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '/' + carTypeId + '?' + qsData
  });


  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }
}

function *getParityCarTypeList(cityCode , qsData , carTypeId){
  const uri = 'http://10.0.0.100:20010/ware/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '/car-type/' + carTypeId + '/car-model/ask?' + qsData
  });


  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }
}

function *getParityImgList(cityCode , qsData , carTypeId){
  const uri = 'http://10.0.0.100:20010/ware/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '/car-type/' + carTypeId + '/pic?' + qsData
  });


  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }
}

function *getDsCarRecommendList(cityCode , qsData){
  const uri = 'http://10.0.0.100:20010/ware/ds/car/recommend/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '?' + qsData
  });

  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }

}

function *getDsCarAdBanner(cityCode , qsData){
  const uri = 'http://10.0.0.100:20010/advert/';
  const advertType = '0';
  const advertPageType = '3';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + '/' + advertType + '/' + advertPageType + '?' + qsData
  });

  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }

}

function *getDsCarOldUser(cityCode , qsData , dsCarTypeId){
  const uri = 'http://10.0.0.100:20010/user/member/timeline/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + cityCode + "?typeId=" + dsCarTypeId + "&" + qsData
  });


  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }

}

router.get('/:carTypeId', function *(next) {
  let qsData = querystring.stringify({
    time: new Date().getTime(),
    source: '101'
  })

  let carTypeId = this.params.carTypeId
  let cityCode = "310000"

  const parityTopInfoData = yield getParityTopInfo(cityCode , qsData , carTypeId)
  const parityHistoryOrderData = yield getParityHistoryOrder(cityCode , qsData , carTypeId)
  const parityCarTypeListData = yield getParityCarTypeList(cityCode , qsData , carTypeId)
  const parityImgListData = yield getParityImgList(cityCode , qsData , carTypeId)
  const dsCarRecommendListData = yield getDsCarRecommendList(cityCode , qsData)
  const dsCarAdBannerData = yield getDsCarAdBanner(cityCode , qsData)
  const dsCarOldUserData = yield getDsCarOldUser(cityCode , qsData , carTypeId)


  yield this.render('car_parity_detail', {
    parityTopInfo: parityTopInfoData.data,
    parityHistoryOrder: parityHistoryOrderData.data,
    parityCarTypeList: parityCarTypeListData.data,
    parityImgList: parityImgListData.data,
  	dsCarRecommendList: dsCarRecommendListData.data,
  	dsCarAdBanner: dsCarAdBannerData.data,
    dsCarOldUser: dsCarOldUserData.data
  });
});

module.exports = router;
