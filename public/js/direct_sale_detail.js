require(['config/main'], function(main) {
  require(['domReady','jquery', 'priceCurve','fotorama','purchase'], function(domReady,$,priceCurve,fotorama,purchase) {
    //console.log($)
    domReady(function(){
			purchase.init('.purchasing_btn');
      // console.log(priceCurve)
      $(".price_curve").priceCurve({
        width: 1170,
        height: 420
      });
    	function animate(offsetLeft,slideContainer){
    	    offsetLeft = '+=' + offsetLeft;
    	    slideContainer.animate({'marginLeft': offsetLeft}, 300,function(){
    	    });
    	}

    	function showButton(index,buttons) {
    	    buttons.eq(index).addClass('on').siblings().removeClass('on');
    	}

        function showNumber(index){
            $(".smallImgContent li div").remove()
            $(".smallImgContent .active").append('<div>'+(index + 1) + '/' +smallImgs.length + '</div>')
        }
        
        function hideOtherOptions(){
            $('.dsDetailChosenPopup').hide()
            $(".detailSelect").find("tr").find("td").css("display","none");
        }

        $(".select").on("click","div",function(){
            var clickClassname = $(this)[0].className
            $(".dsDetailChosenPopup").show()
            switch(clickClassname){
                case "carModel":
                    $(".detailSelect .type").show()
                    break;
                case "appearance":
                    $(".detailSelect .color").css("display","block")
                    break;
                case "purchaseWay":
                    $(".detailSelect .payment").css("display","block")
                    break;
                case "license":
                    $(".detailSelect .license").css("display","block")
                    break;
            }
        })

        $(".direct_sale_recommend_list li").eq(0).addClass("first")
        $(".direct_sale_recommend_list li").eq(3).addClass("last")

        $(".type").on("click",function(){
            hideOtherOptions() 
        })
        

        $(".color").on("click",function(){
            $(".appearance p")[0].innerHTML = $(this)[0].innerHTML
            hideOtherOptions() 
        })

        $(".payment").on("click",function(){
            $(".purchaseWay p")[0].innerHTML = $(this)[0].innerHTML
            hideOtherOptions() 
        })

        $(".detailSelect .license").on("click",function(){
            $(".select .license p")[0].innerHTML = $(this)[0].innerHTML
            hideOtherOptions() 
        })

        var windowHref = window.location.href
        var index = windowHref .lastIndexOf("\/");  
        var dsCarModelId  = windowHref .substring(index + 1, windowHref .length);

        var licenseTypeNumber = {
            hupai:1,
            waipai:2
        }

        //var purchaseWayUrl =window.encodeURIComponent($(".purchaseWay p")[0].innerHTML);

        var licenseType = null;

        $(".landprice").on("click",function(){


           var typeofLicense = $(".select .license p")[0].innerHTML

           switch(typeofLicense){
               case "沪牌":
                   licenseType = licenseTypeNumber.hupai;
                   break;
               case "外牌":
                   licenseType = licenseTypeNumber.waipai;
                   break;
           }

           $(".landprice a").attr('href','/price/'+ dsCarModelId +'?color=' + $(".appearance p")[0].innerHTML + '&buyWay=' + purchaseWayUrl + '&license=' + licenseType)
 
        })

        for(i = 0; i < $(".track_time").length ; i++){
            $(".track_time")[i].innerHTML = $(".track_time").text().substr(0,10)
        }
        

        var trackRecords = $(".track_records .track_type")

        for(i = 0;i < trackRecords.length;i++){
            if(trackRecords[i].innerHTML == "签单" || trackRecords[i].innerHTML == "提车"){
                $(".track_records li div").eq(i).addClass("active")
            } 
        }


        for(i = 0;i < $(".track_records").length;i++){
            $(".track_records li:last-child").addClass("last")
        }

        
        
    	var index = 0;

    	var flowNumber = $('.flow li');
    	var flowContent = $('.middleContent div');
    	var middleContentContainer = $('.middleContent');
    	var leftArrow=$('.leftArrow');
    	var rightArrow=$(".rightArrow");
    	var blueLine=$(".blueLine");


    	for(var i = 0;i < flowNumber.length;i++){
    		flowNumber[i].id=i;
    		flowContent[i].id=i;
    	}

    	rightArrow.on('click',function(){

    		var width = blueLine[0].offsetWidth;
    		leftArrow.css("color","#666").css("cursor","pointer")

    		if(index == flowContent.length - 2){
    			return null;
    		}

            if(index == flowContent.length-3){
                rightArrow.css("color","#e2e2e2").css("cursor","default");
                blueLine.css("width",width);
            }


    		if(index == flowNumber.length-2){
    			blueLine.css("width",width + 70 + "px");
    		}else{
                if(index == flowNumber.length-1){
                    blueLine.css("width",width);
                }else{
                   blueLine.css("width",width + 140 + "px");
                }

    		}

    		index++;

    		var number=flowContent[index].id;
    		flowNumber.eq(number).find("p").css("color","#09afec");
    		flowNumber.eq(number).find("span").css("backgroundColor","#09afec");

    		animate('-1016px',middleContentContainer)
    	})


    	leftArrow.on('click',function(){

    		var width = blueLine[0].offsetWidth;
    		rightArrow.css("color","#666").css("cursor","pointer")

    		if(index==0){
    			return null;
    		}

    		if(index == 1){
    			leftArrow.css("color","#e2e2e2").css("cursor","default")
    		}

    		if(index == flowContent.length-1){
    			blueLine.css("width",width - 70 + "px")
    		}else{
    			blueLine.css("width",width - 140 + "px")
    		}


    		var number=flowContent[index].id;

    		index--;

    		flowNumber.eq(number).find("p").css("color","#c6c6c6")
    		flowNumber.eq(number).find("span").css("backgroundColor","#c6c6c6")



    		animate('1016px',middleContentContainer)
    	})



    	var smallImgContent=$(".smallImgContent")
    	var bigImgs=$(".bigImg img")
    	var smallImgs=$(".smallImgContent li")
    	var smallLeftArrow=$(".smallLeftArrow")
    	var smallRightArrow=$(".smallRightArrow")
        

    	for(var i = 0;i < smallImgs.length;i++){
    		smallImgs[i].id=i;
    		bigImgs[i].id=i;
    	}

        bigImgs.eq(0).addClass("active")
        smallImgs.eq(0).addClass("active")

        var number = parseInt(smallImgs[0].id);
        $(".smallImgContent .active").append('<div>'+(number + 1) + '/' +smallImgs.length + '</div>')
        

    	if(smallImgs.length <= 4){
    		smallLeftArrow.hide()
    		smallRightArrow.hide()
    	}

    	smallRightArrow.on("click",function(){

    		smallLeftArrow.css("color","#666").css("cursor","pointer")

    		if(number == smallImgs.length - 1 ){
    			return null;
    		}

    		if(number == smallImgs.length - 2 ){
    			smallRightArrow.css("color","#e2e2e2").css("cursor","default")
    		}

            if(smallImgs.eq(0)[0].offsetLeft < (smallImgs.length - 4) * (-83) ){
                animate('0',smallImgContent)
            }else{
                animate('-84px',smallImgContent)
            }

    		number++;

    		bigImgs.eq(number).addClass('active').siblings().removeClass('active');
    		smallImgs.eq(number).addClass('active').siblings().removeClass('active');

            showNumber(number)
  

    	})

    	smallLeftArrow.on("click",function(){

    		smallRightArrow.css("color","#666").css("cursor","pointer")

    		if(number == 0 ){
    			return null;
    		}

    		if(number == 1){
    			smallLeftArrow.css("color","#e2e2e2").css("cursor","default")
    		}


            if(smallImgs.eq(0)[0].offsetLeft > -80){
                animate('0',smallImgContent)
            }else{
                animate('84px',smallImgContent)
            }

    		number--;

    		bigImgs.eq(number).addClass('active').siblings().removeClass('active');
    		smallImgs.eq(number).addClass('active').siblings().removeClass('active');
            $(".smallImgContent .active div").append(number + 1 + '/' + smallImgs.length)

            showNumber(number)
    	})

        

    	smallImgs.on("click",function(){
    		number = $(this)[0].id;
    		bigImgs.eq(number).addClass('active').siblings().removeClass('active');
    		smallImgs.eq(number).addClass('active').siblings().removeClass('active');

            showNumber(parseInt(number))

            if(number == 0){
                smallLeftArrow.css("color","#e2e2e2").css("cursor","default")
            }else{
                if(number == smallImgs.length-1){
                    smallRightArrow.css("color","#e2e2e2").css("cursor","default")
                }else{
                    smallRightArrow.css("color","#666").css("cursor","pointer")
                    smallLeftArrow.css("color","#666").css("cursor","pointer")
                }
            }
    	})

        var tabHead = $(".tabHead li")
        var tabContent = $(".tabContent>li")


        var scrollHeight = []
        scrollHeight[0] = $(".ad_banner")[0].offsetTop + $(".ad_banner")[0].offsetHeight

        for(i = 0; i < tabHead.length - 1; i++){
            scrollHeight[i+1] = scrollHeight[i] + tabContent[i].offsetHeight
        }


        $(window).scroll(function(){
            if(document.body.scrollTop >= scrollHeight[0]){
                $(".tabHead").css("position","fixed")
            }else{
               $(".tabHead").css("position","relative")
            }

            for(i = 0; i < tabHead.length ; i++){
                if(document.body.scrollTop >= scrollHeight[i]){
                    tabHead.eq(i).addClass('active').siblings().removeClass('active');
                }
            }

        })

    })
  });
});
