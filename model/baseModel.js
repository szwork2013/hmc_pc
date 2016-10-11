/**
 * Created by leafrontye on 16/8/24.
 */
var request = require('request');
var qureystring=require('querystring');
var config=require('../config');
var apiServerUrl=config.apiServerUrl;
module.exports={
	get:function *(url,data){
			data.time=new Date().getTime();
			data.source="101";
			var requestData=qureystring.stringify(data);
	  	console.log( apiServerUrl + url+'?'+requestData)
			let [response,body]= yield function(callback){
				request({
					method: 'GET',
					url: apiServerUrl + url+'?'+requestData,
				},callback);
			}
		  if(response &&response.statusCode==200){
				var res=JSON.parse(body);
				if(res.status=="1"){
					return res;
				}
			}else{

			}
	},
	post:function *(url,data){
		data.time=new Date().getTime();
		data.source="101";
		let [response,body]= yield function(callback){
			request({
				method: 'POST',
				url: config + url,
				body:JSON.stringify(data)
			},callback);
		}
		if(response &&response.statusCode==200){
			return JSON.parse(body);
		}else{

		}
	}
}