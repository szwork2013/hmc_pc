var config = {
  apiServerUrl: 'http://api-test.easybuycar.com',
  getApiRelatedCode:function(){
    return {
			source:'101',
			time:new Date().getTime()
		}
  }
}
module.exports = config;
