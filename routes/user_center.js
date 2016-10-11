var router = require('koa-router')();

router.prefix('/:userName');

//check token here
//if not correct redirect
//

router.get('/order_compare/:orderNumber', function *(next) {
  // console.log(this.params)
  //get data order detail by orderNumber
  yield this.render('user_center_order_compare', {
    orderInfo:{
      carName: 'Volvo S90',
      msrp: 120000,
      carImageLink: 'http://static.haomaiche.com/common/images/type/20e7d1020e0f42f79657a59316fa8519.png',
      discount: 1000,
      taxType: 0,
      upgradePrice: 10000,
      upgradeParts: [
        '玻璃板',
        '天窗',
        '发动机3号'
      ],
      comment : '到店更多优惠',
      shopInfo:{
        shopName: '上汽通用别克吴中路店',
        shopSalesMan: '王某某 销售经理',
        shopPhoneNumber: 18645456565
      }
    }
  });
});

router.get('/my_info', function *(next) {
  yield this.render('user_center', {
    currentMenu:'my_info'
  });
});

router.get('/my_subscription', function *(next) {
  yield this.render('user_center', {
    currentMenu:'my_subscription'
  });
});

router.get('/my_favorite', function *(next) {
  //get data my_favorite list

  yield this.render('user_center', {
    currentMenu:'my_favorite',
    myFavoriteList:[
      {
        carName: '大众 Polo',
        carModelInfo: '2014款 1.6 手自一体 舒适版（上海指导价)',
        carImageLink: 'http://static.haomaiche.com/common/images/type/20e7d1020e0f42f79657a59316fa8519.png',
        isDirectSale: false,
        carTypeTag: [
          '可售全国',
          '可售全国',
          '可售全国'
        ],
        discount: '7.8',
        msrp: '15.35',
        isAvailable: false
      },
      {
        carName: 'BMW 135i',
        carModelInfo: '2017款 2.0 手自一体 舒适版（上海指导价)',
        carImageLink: 'http://static.haomaiche.com/common/images/type/20e7d1020e0f42f79657a59316fa8519.png',
        isDirectSale: true,
        carTypeTag: [
          '可售全国',
          '可售全国'
        ],
        discount: '7.8',
        msrp: '13.35',
        isAvailable: true
      }
    ]
  });
});

router.get('/my_inquire_list', function *(next) {
  yield this.render('user_center', {
    currentMenu:'my_inquire_list',
    myInquireList: [
      {
        carName: 'BMW 135i',
        carModelInfo: '2015款 218i 1.5T 手自一体 运动设计套装 Gran Tourer ',
        carColorName: '弗拉门戈高原红',
        licenseType: '外牌',
        licenseArea: '湖北-武汉',
        payMethod: '全款+购置',
        buyTime: '三个月后'
      }
    ]
  });
});

router.get('/', function *(next) {
  yield this.render('user_center', {
    currentMenu:'my_direct_sale_list'
  });
});

module.exports = router;
