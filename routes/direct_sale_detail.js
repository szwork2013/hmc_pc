var router = require('koa-router')();
var path = require('path');
let _request = require('request');
let querystring = require('querystring');


function request(options) {
  return function thunk(cb) {
    _request(options, cb);
  };
}

function *getDsCarSlideImg(dsCarTypeId , qsData){
  const uri = 'http://10.0.0.100:20010/ware/ds/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + dsCarTypeId + '/photo?' + qsData
  });

  if(response.statusCode == 200){
    let data = JSON.parse(body);
    return data;
  }else{

  }
}

function *getDsCarDetail(dsCarTypeId , qsData){
  const uri = 'http://10.0.0.100:20010/ware/ds/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + dsCarTypeId + '?' + qsData
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

function *getDsCarImgList(dsCarTypeId , qsData){
  const uri = 'http://10.0.0.100:20010/ware/ds/car/';

  let [response, body] = yield request({
    method: 'GET',
    url: uri + dsCarTypeId + '/textPic?' + qsData
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


router.get('/:carTypeId/:modelId', function *(next) {
  
  let qsData = querystring.stringify({
    time: new Date().getTime(),
    source: '101'
  })

  let dsCarTypeId = this.params.carTypeId
  let cityCode = "310000"

  const dsCarSlideImgData = yield getDsCarSlideImg(dsCarTypeId , qsData)
  const dsCarDetailData = yield getDsCarDetail(dsCarTypeId , qsData)
  const dsCarRecommendListData = yield getDsCarRecommendList(cityCode , qsData)
  const dsCarAdBannerData = yield getDsCarAdBanner(cityCode , qsData)
  const dsCarImgListData = yield getDsCarImgList(dsCarTypeId , qsData)
  const dsCarOldUserData = yield getDsCarOldUser(cityCode , qsData , dsCarTypeId)




  for(let i = 0 ; i < dsCarDetailData.data.length ; i++){
    modelColorNameArray = dsCarDetailData.data[i].modelColorName.split("#")
    modelPurcahseWayArray = dsCarDetailData.data[i].modelPaymentOption.split("#")
    modelLicenseArray = dsCarDetailData.data[i].modelLicenseOption.split("#")

    dsCarDetailData.data[i].modelColorName = modelColorNameArray
    dsCarDetailData.data[i].modelPaymentOption = modelPurcahseWayArray
    dsCarDetailData.data[i].modelLicenseOption = modelLicenseArray
  }


  yield this.render('direct_sale_detail', {
    dsCarModelId: this.params.modelId,

    dsCarSlideImg: dsCarSlideImgData.data,
    dsCarDetail: dsCarDetailData.data,
    dsCarRecommendList: dsCarRecommendListData.data,
    dsCarAdBanner: dsCarAdBannerData.data,
    dsCarImgList: dsCarImgListData.data,
    dsCarOldUser: dsCarOldUserData.data
  });

});



module.exports = router;
