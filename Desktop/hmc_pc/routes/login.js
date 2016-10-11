var router = require('koa-router')();



router.get('/', function *(next) {
  yield this.render('/login', {
  	
  });
});

// router.get('/:fromPage', function *(next) {
//   this.body = 'Login ' + this.params.fromPage;
// });

module.exports = router;

