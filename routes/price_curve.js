let router = require('koa-router')();
let koaBody = require('koa-body')();

router.post('/', koaBody , function *(next) {

  let modelId = this.request.body.modelId;

  //get car info by car model id

  //send car info
  this.body = {
    "status": 1,
    "data": {
      "price": {
        "min": 130000,
        "max": 141000,
        "firstQuantile": 133000,
        "sencondQuantile": 136000,
        "thridQuantile": 140000,
        "factory": 132000,
        "average": 136000,
        "hmcEstimate": 135000,
        "msrp": 138500
      },
      "chart": [
        {
          "deal": 2,"rang": [130000,131000]
        },
        {
          "deal": 3,"rang": [131000,132000]
        },
        {
          "deal": 0,"rang": [132000,133000]
        },
        {
          "deal": 7,"rang": [133000,134000]
        },
        {
          "deal": 3,"rang": [134000,145000]
        },
        {
          "deal": 0,"rang": [135000,146000]
        },
        {
          "deal": 3,"rang": [136000,147000]
        },
        {
          "deal": 6,"rang": [137000,138000]
        },
        {
          "deal": 7,"rang": [138000,139000]
        },
        {
          "deal": 5,"rang": [139000,140000]
        },
        {
          "deal": 6,"rang": [140000,141000]
        },
        {
          "deal": 3,"rang": [141000,142000]
        },
        {
          "deal": 3,"rang": [142000,143000]
        },
        {
          "deal": 0,"rang": [143000,144000]
        },
        {
          "deal": 0,"rang": [144000,145000]
        },
        {
          "deal": 2,"rang": [145000,146000]
        },
        {
          "deal": 3,"rang": [146000,147000]
        }
      ]
    },
    "msg": "操作成功"
  };
});

module.exports = router;
