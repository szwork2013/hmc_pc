let koa = require('koa');
let app = koa();
let path = require('path');
let serve = require('koa-static');
let render = require('koa-ejs');
let Router = require('koa-router')();
let index = require('./routes/index');
let carParityDetail = require('./routes/car_parity_detail');
let login = require('./routes/login');
let userCenter = require('./routes/user_center');
let userCenterOrderCompare = require('./routes/user_center_order_compare');
let directSaleDetail = require('./routes/direct_sale_detail');
let directSaleList = require('./routes/direct_sale_list');
let price = require('./routes/price');
let priceCurve = require('./routes/price_curve');


const send = require('koa-send');

app.use(serve(__dirname + '/public'));

//set ejs default
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: true
});

Router.use('/', index.routes());
Router.use('/login', login.routes());
Router.use('/car_parity_detail', carParityDetail.routes());
Router.use('/user_center', userCenter.routes());
Router.use('/user_center_order_compare',userCenterOrderCompare.routes());
Router.use('/direct_sale_detail',directSaleDetail.routes());
Router.use('/direct_sale_list',directSaleList.routes());
Router.use('/price',price.routes());

Router.use('/price_curve', priceCurve.routes());

app.use(Router.routes());

app.listen(3000);
