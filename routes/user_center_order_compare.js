var router = require('koa-router')();

router.get('/:userName/:orderNumber', function *(next) {
  yield this.render('user_center_order_compare', {
    
  });
});

module.exports = router;
