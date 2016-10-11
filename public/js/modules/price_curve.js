define('priceCurve',['Raphael','fetch', 'jquery'],function(Raphael,fetch,$){
  // var #f6f6f6;
  var priceCurve = function(options){

    //show loading
    var that = this;
    var paper;
    var priceCurveDataUrl = options.url || 'http://localhost:3000/price_curve';
    var testId = '05a515100cb441e8b8780d74e539bddc';
    var queryCarId = testId;
    var paperWidth = options.width || 1200;
    var paperHeight = options.height || 450;
    var charVerticalMargin = 15;

    init(options);

    function init(options){

      setPaperSize(paper, paperWidth, paperHeight);

      paper = initPaper(that ,paperWidth ,paperHeight);

      //fetch data
      fetchData(paper, function(data){

        setPriceCurveBackground();
          //hide loading
          // addCurveToPaper(data)
        setQuantiles(paper, data);

        addPriceButtons(data);

        var priceRectArray = addPriceRect(data);
        bindEventToPriceRect(priceRectArray);

        setPriceDetailPopup(paper, data);
        // bindEventToPriceDetailPopup(priceRectArray);

        setBottomBorder(paper);

        setBottomPathToButton(paper, data);

        setPricePoint(paper, data);

        setHelpButtons();
      });
    }

    function fetchData(paper, cb){
      fetch(priceCurveDataUrl,{
        headers:{
          'Content-Type':'application/json'
        },
        method:'post',
        body:JSON.stringify({
          modelId:queryCarId
        })
      }).then(function(response){
        if(response.ok){
          return response.json();
        }else{
          //handle error

        }
      }).then(cb);
    }

    function initPaper(that, paperWidth, paperHeight){
      return Raphael($(that)[0] , paperWidth, paperHeight);
    }

    function setPaperSize(paper, paperWidth, paperHeight){
      $(paper).css({
        width:paperWidth,
        height:paperHeight
      });
    }

    function setQuantiles(paper, priceCurveData){
      var quantileTextTitle = [
        '价格偏低',
        '价格较好',
        '价格合理',
        '价格过高'
      ];
      var quantileTextDesc = [
        '成交价低于',
        '成交价介于',
        '成交价介于',
        '成交价高于'
      ];
      var quantileDataArray = [
        priceCurveData.data.price.firstQuantile,
        priceCurveData.data.price.sencondQuantile,
        priceCurveData.data.price.thridQuantile,
        priceCurveData.data.price.max
      ];

      var totalRange = priceCurveData.data.price.max - priceCurveData.data.price.min;
      var leftBorderWidth = 1;
      var fontLineHeight = 8;
      var fontLeftMargin = 10;
      var quantileMarginTop = 15;
      var quantileDescMarginTop = 5;

      for(var i = 0; i < quantileDataArray.length; i++){
        var rangeWidth;
        var priceRectLeftCord;
        var priceRect;
        var leftBorder;
        var quantileTitle;
        var quantileDesc;
        var priceText;
        if(i > 0){
          rangeWidth = ((quantileDataArray[i] - priceCurveData.data.price.min) - (quantileDataArray[i-1] - priceCurveData.data.price.min)) / totalRange;
          priceRectLeftCord = (quantileDataArray[i - 1] - priceCurveData.data.price.min) / totalRange;
        }else{
          rangeWidth = (quantileDataArray[i] - priceCurveData.data.price.min) / totalRange;
          priceRectLeftCord = 0;
        }

        priceRect = paper.rect(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin, 0, rangeWidth * (paperWidth * .8) , paperHeight * .9);
        priceRect.attr('fill', 'rgba(246,246,246,0)');
        priceRect.attr('stroke', 0);

        leftBorder = paper.rect(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin, 0, leftBorderWidth , paperHeight * .9);
        leftBorder.attr('fill', '#e2e4e5');
        leftBorder.attr('stroke', 0);

        quantileTitle = paper.text(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin + fontLeftMargin, fontLineHeight + quantileMarginTop, quantileTextTitle[i]);
        quantileTitle.attr('text-anchor', 'start');
        quantileTitle.attr('font-size', 14);
        quantileTitle.attr('font-weight', 'bold');

        quantileDesc = paper.text(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin + fontLeftMargin, fontLineHeight * 3 + quantileMarginTop + quantileDescMarginTop, quantileTextDesc[i]);
        quantileDesc.attr('text-anchor', 'start');
        quantileDesc.attr('font-size', 14);
        quantileDesc.attr('fill', 'rgba(54,54,54,0.7)');

        if(i === 0 || i === quantileTextDesc.length - 1){
          priceText = paper.text(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin + fontLeftMargin, fontLineHeight * 5 + quantileMarginTop + quantileDescMarginTop, '¥' + quantileDataArray[i]);
        }else{
          priceText = paper.text(priceRectLeftCord * (paperWidth * .8) + paperWidth * .08 - charVerticalMargin + fontLeftMargin, fontLineHeight * 5 + quantileMarginTop + quantileDescMarginTop, '¥' + quantileDataArray[i - 1] + '-' + quantileDataArray[i]);
        }

        priceText.attr('text-anchor', 'start');
        priceText.attr('font-size', 14);
        priceText.attr('fill', 'rgba(54,54,54,0.7)');
      }
    }

    function addPriceButtons(priceCurveData){
      var pricePointData = [
        {priceName:'factory',priceValue:priceCurveData.data.price.factory},
        {priceName:'average',priceValue:priceCurveData.data.price.average},
        {priceName:'hmcEstimate',priceValue:priceCurveData.data.price.hmcEstimate},
        {priceName:'msrp',priceValue:priceCurveData.data.price.msrp}
      ];
      var priceButtonsTemplate = '';
      var priceButtons = '';
      var priceButtonTextEnum = {
        factory:'4S店成本价',
        average:'平均成交价',
        hmcEstimate:'好买车预测当前成交价',
        msrp:'厂商指导价'
      };

      pricePointData.sort(function(a, b){return a.priceValue - b.priceValue;});

      for(var i = 0; i < pricePointData.length; i++){
        var activeClass = '';
        if(pricePointData[i].priceName == 'hmcEstimate'){
          activeClass = 'active';
        }
        priceButtons += '<button class="'+ activeClass +'">' + priceButtonTextEnum[pricePointData[i].priceName] + '<br>' + pricePointData[i].priceValue + '</button>'
      }

      priceButtonsTemplate = '<div class="price_buttons">' + priceButtons + '</div>';

      $(that).append(priceButtonsTemplate);
    }

    function addPriceRect(priceData){
      var dealCount = [];
      var dealCountWithOrder = [];
      var minCount;
      var priceRectObjects = [];

      for(var i = 0; i < priceData.data.chart.length; i++){
        dealCount.push(priceData.data.chart[i].deal);
        dealCountWithOrder.push(priceData.data.chart[i].deal);
      }
      dealCountWithOrder.sort(function(a,b){return b - a});

      minCount = dealCountWithOrder[0];

      for(var i = 0; i < dealCount.length; i++){

        if(priceData.data.chart[i].deal === 0){
          continue;
        }

        var dealCountChartLeft = (i / dealCount.length ) * (paperWidth * .8) + paperWidth * .1 - charVerticalMargin;
        var dealCountChartTop = paperHeight * .9 - dealCount[i] / minCount * .8 * paperHeight * .9;//paperHeight * .9 - dealCountChartHeight * paperHeight * .9
        var dealCountChartWdith = paperWidth * .8 / dealCount.length - charVerticalMargin;
        var dealCountChartHeight = dealCount[i] / minCount * .8 * paperHeight * .9;//dealCountChartHeight * paperHeight * .9
        var priceRect = paper.rect(dealCountChartLeft , dealCountChartTop , dealCountChartWdith, dealCountChartHeight );

        priceRect.attr("fill", "rgba(215,218,221,0.5)");
        priceRect.attr("stroke", 0);

        priceRectObjects.push(priceRect);
      }
      return priceRectObjects;
    }

    function setPriceCurveBackground(){
      $(that).css({
        'background': 'url(/images/price_curve_bg.png) 0% 40% no-repeat',
        'background-size': '100% 60%'
      });
    }

    function setBottomBorder(paper){
      var bottomBorderHeight = 5;
      var bottomBorder = paper.rect(0, paperHeight * .9, paperWidth, bottomBorderHeight );

      bottomBorder.attr("fill", "rgba(9,175,236,1)");
      bottomBorder.attr("stroke", 0);
    }

    function setPricePoint(paper, priceCurveData){
      var pricePointData = [
        {priceName:'factory',priceValue:priceCurveData.data.price.factory},
        {priceName:'average',priceValue:priceCurveData.data.price.average},
        {priceName:'hmcEstimate',priceValue:priceCurveData.data.price.hmcEstimate},
        {priceName:'msrp',priceValue:priceCurveData.data.price.msrp}
      ];

      pricePointData.sort(function(a, b){return a.priceValue - b.priceValue;});

      var totalRange = priceCurveData.data.price.max - priceCurveData.data.price.min;

      for(var i = 0; i < pricePointData.length; i++){
        var pricePointLeft = (pricePointData[i].priceValue - priceCurveData.data.price.min) / totalRange * (paperWidth * .8) + (paperWidth * .1) - charVerticalMargin;
        var pricePoint = paper.circle(pricePointLeft , paper.height * .9 + 2.5, 10);
        var pricePointColor = "rgba(9,175,236,1)";
        
        if(pricePointData[i].priceName == 'hmcEstimate'){
          pricePointColor = 'rgba(3,10,11,1)';
        }

        pricePoint.attr("fill", pricePointColor);
        pricePoint.attr("stroke", 0);
      }
    }

    function setBottomPathToButton(paper, priceCurveData){
      var pricePointData = [
        {priceName:'factory',priceValue:priceCurveData.data.price.factory},
        {priceName:'average',priceValue:priceCurveData.data.price.average},
        {priceName:'hmcEstimate',priceValue:priceCurveData.data.price.hmcEstimate},
        {priceName:'msrp',priceValue:priceCurveData.data.price.msrp}
      ];

      pricePointData.sort(function(a, b){return a.priceValue - b.priceValue;});

      var totalRange = priceCurveData.data.price.max - priceCurveData.data.price.min;
      var pathToOffset = 5;

      var $priceButtons = $(that).find('.price_buttons').find('button');
      for(var i = 0; i < $priceButtons.length; i++){
        var pathToButtonWidth = parseInt($priceButtons.eq(i).css('width'), 10);
        var pathToButtonLeft = Math.abs(parseInt($(that).offset().left,10) - parseInt($priceButtons.eq(i).offset().left, 10)) + pathToButtonWidth / 2;
        var pathStartleft = (pricePointData[i].priceValue - priceCurveData.data.price.min) / totalRange * (paper.width * .8) + (paper.width * .1) - charVerticalMargin;

        var pathToButton = paper.path('M' + pathStartleft + ',' + (paper.height * .9) + ' L' + pathStartleft + ' ' + (paper.height * .9 + 9 + 10 + pathToOffset * i) + ' L' + pathToButtonLeft + ' ' + (paper.height * .9 + 9 + 10 + pathToOffset * i) + ' L' + pathToButtonLeft + ' ' + (paper.height * .9 + 9 + 40));
        var pathToButtonColor = 'rgba(9,175,236,1)';

        if(pricePointData[i].priceName == 'hmcEstimate'){
          pathToButtonColor = 'rgba(3,10,11,1)';
        }

        pathToButton.attr('stroke', pathToButtonColor);
      }
    }

    function setHelpButtons(){
      var helpButtonsTemplate = '\
        <div class="help_buttons">\
          <div><button>为什么有价格差？</button></div>\
          <div><button>如何看懂图表？</button></div>\
        </div>\
      ';
      $(that).append(helpButtonsTemplate);
    }

    function bindEventToPriceRect(priceRectObjectArray){
      for(var i = 0; i < priceRectObjectArray.length; i++){
        !function(currentIndex){
          priceRectObjectArray[i].mouseover(function(e){
            this.attr('fill', 'rgba(9,175,236,1)');
            $(that).find(".price_detail_popup").find("li").eq(currentIndex).show();
          });
          priceRectObjectArray[i].mouseout(function(e){
            this.attr('fill', 'rgba(215,218,221,0.5)');
            $(that).find(".price_detail_popup").find("li").eq(currentIndex).hide();
          });
        }(i);
      }
    }
    // function bindEventToPriceDetailPopup(priceRectObjectArray){
      // var $priceDetailPopup = $(that).find(".price_detail_popup").find("li");
      // for(var i = 0; i < $priceDetailPopup.length; i++){
      //   !function(currentIndex){
      //     $priceDetailPopup.eq(i).on("mouseover", function(e){
      //       $priceDetailPopup.eq(currentIndex).show();
      //       priceRectObjectArray[currentIndex].attr('fill', 'rgba(9,175,236,1)');
      //     });
      //     $priceDetailPopup.eq(i).on("mouseout", function(e){
      //       $priceDetailPopup.eq(currentIndex).hide();
      //       priceRectObjectArray[currentIndex].attr('fill', 'rgba(215,218,221,0.5)');
      //     });
      //   }(i);
      // }
    // }

    function setPriceDetailPopup(paper, priceData){
      var detailPopupWidth = 215;
      var detailPopupHeight = 60;
      var detailPopupPadding = 20;
      var detailPopupBottomOffset = 12;
      var dealCountArray = [];
      var dealCountWithOrder = [];
      var minCount;
      var priceRectObjects = [];

      var priceDetailPopupListTemplate = '<ul class="price_detail_popup">{{popupList}}</ul>';
      var priceDetailPopupList = '';

      for(var i = 0; i < priceData.data.chart.length; i++){
        dealCountArray.push(priceData.data.chart[i].deal);
        dealCountWithOrder.push(priceData.data.chart[i].deal);
      }
      dealCountWithOrder.sort(function(a,b){return b - a});

      minCount = dealCountWithOrder[0];

      for(var i = 0; i < dealCountArray.length; i++){
        if(priceData.data.chart[i].deal === 0){
          continue;
        }

        var dealCountChartWidth = paperWidth * .8 / dealCountArray.length - charVerticalMargin;
        var dealCountChartHeight = dealCountArray[i] / minCount * .8 * paperHeight * .9;
        var dealCountChartLeft = (i / dealCountArray.length * 80 + 10) / 100 * paper.width;
        var dealCountChartTop = paper.height * .9 - dealCountArray[i] / minCount * .8 * paper.height * .9;

        var popupStyle = '';

        var minPriceRange = priceData.data.chart[i].rang[0];
        var maxPriceRange = priceData.data.chart[i].rang[1];
        var dealCount = priceData.data.chart[i].deal;

        var detailPopupListTemplate = '<li style="{{popupStyle}}">在{{minPriceRange}}-{{maxPriceRange}}价格范围内有{{dealCount}}单成交纪录</li>';

        popupStyle += 'width:' + detailPopupWidth + 'px;';
        popupStyle += 'height:' + detailPopupHeight + 'px;';
        popupStyle += 'top:' + (dealCountChartTop - detailPopupHeight - detailPopupBottomOffset - detailPopupPadding * 2) + 'px;';
        popupStyle += 'left:' + (dealCountChartLeft + dealCountChartWidth * .5 - (detailPopupWidth + detailPopupPadding * 2) * .5 - charVerticalMargin) + 'px;';
        popupStyle += 'padding:' + detailPopupPadding + 'px;';

        // console.log((dealCountChartLeft + dealCountChartWidth * .5 - (detailPopupWidth + detailPopupPadding * 2) * .5) + charVerticalMargin)
        detailPopupListTemplate = detailPopupListTemplate.replace(/{{popupStyle}}/g, popupStyle);
        detailPopupListTemplate = detailPopupListTemplate.replace(/{{minPriceRange}}/g, minPriceRange);
        detailPopupListTemplate = detailPopupListTemplate.replace(/{{maxPriceRange}}/g, maxPriceRange);
        detailPopupListTemplate = detailPopupListTemplate.replace(/{{dealCount}}/g, dealCount);

        priceDetailPopupList += detailPopupListTemplate;
      }

      priceDetailPopupListTemplate = priceDetailPopupListTemplate.replace(/{{popupList}}/g, priceDetailPopupList);
      $(that).append(priceDetailPopupListTemplate);
    }

    ///////////
    function bindButtonMouseEvent(){
      var currentPoint = point;

      $(".price_buttons").find("button").eq(i).mouseover(function(){
        currentPoint.attr("fill", "black")
      })
      $(".price_buttons").find("button").eq(i).mouseout(function(){
        currentPoint.attr("fill", "gray")
      })
    }

    function addCurveToPaper(priceCurveData){
      var paperWidth = options.width || 1200;
      var paperHeight = options.height || 450;

      var paper = Raphael($(that)[0] , paperWidth, paperHeight);

      var quantileDataArray = [
        priceCurveData.data.price.firstQuantile,
        priceCurveData.data.price.sencondQuantile,
        priceCurveData.data.price.thridQuantile,
        priceCurveData.data.price.max
      ];
      var quantileDateTextArray = [
        'Exceptional Price Less than ¥' + quantileDataArray[0],
        'Great Price Less than ¥' + quantileDataArray[1],
        'Good Price Below ¥' + quantileDataArray[2],
        'Above Market ¥' + quantileDataArray[3]
      ];
      var quantileArray = [];
      var quantileTextArray = [];
      for(var i = 0; i < quantileDataArray.length; i++){
        var rect
        var priceText

        var totalRange = priceCurveData.data.price.max - priceCurveData.data.price.min;
        var rangeWidth
        var left
        if(i > 0){
          rangeWidth = ((quantileDataArray[i] - priceCurveData.data.price.min) - (quantileDataArray[i-1] - priceCurveData.data.price.min)) / totalRange
          left = (quantileDataArray[i-1] - priceCurveData.data.price.min) / totalRange;
        }else{
          rangeWidth = (quantileDataArray[i] - priceCurveData.data.price.min) / totalRange;
          left = 0;
        }

        //init rects
        rect = paper.rect(left * 100 + '%', 0, rangeWidth * 100 + '%' , paperHeight * .9);

        rect.attr("fill", "rgba(255,255,255,0.2)");
        rect.attr("stroke", "white");

        //set text
        priceText = paper.text(left * 100 + 5 + '%', 20, quantileDateTextArray[i]);

        bindMouseEventToText();

        function bindMouseEventToText(){
          var currentRect = rect
          priceText.mouseover(function(e){
            currentRect.attr("fill", "gray")
          })
          priceText.mouseout(function(e){
            currentRect.attr("fill", "#FFF")
          })
        }

        quantileArray.push(rect)
        quantileTextArray.push(priceText)

      }

      var dealCount = []
      var dealCountWithOrder = []
      for(var i = 0; i < priceCurveData.data.chart.length; i++){
        dealCount.push(priceCurveData.data.chart[i].deal)
        dealCountWithOrder.push(priceCurveData.data.chart[i].deal)
      }
      dealCountWithOrder.sort(function(a,b){return b - a})

      // var chartsTemplate = ''
      var rectArray = []
      for(var i = 0; i < dealCount.length; i++){
        var dealCountChartHeight = dealCount[i] / dealCountWithOrder[0] * .8
        // chartsTemplate += '<li style="left:' + (i / dealCount.length * 80 + 10) + '%;width:20px;height:' + dealCountChartHeight + '%;"></li>';
        // rect.attr("fill", "#f00");
        var priceRect = paper.rect((i / dealCount.length * 80 + 10) + '%', paperHeight * .9 - dealCountChartHeight * paperHeight * .9 , 50, dealCountChartHeight * paperHeight * .9 )
        priceRect.attr("fill", "rgba(215,218,221,1)")
        priceRect.attr("stroke", 0)

        priceRect.mouseover(function(){
          this.attr("fill", "rgba(9,175,236,1)")
        })
        priceRect.mouseout(function(){
          this.attr("fill", "rgba(215,218,221,1)")
        })

        rectArray.push(priceRect)
      }

      //draw curve here
      // var theCurve = paper.path("M0 500C500 0 100 500 400 200 500 0");
      // theCurve.attr("fill", "red")
      //
      // console.log('M0 250 C' + 600 + ' 0 ' + paper.width + ' ' + paper.height + ' 0 0 0 0' )
      //draw dot here
      var pricePointData = [
        priceCurveData.data.price.factory,
        priceCurveData.data.price.hmcEstimate,
        priceCurveData.data.price.average,
        priceCurveData.data.price.msrp
      ]
      var pricePointArray = []
      for(var i = 0; i < pricePointData.length; i++){
        var totalRange = priceCurveData.data.price.max - priceCurveData.data.price.min;
        var left = (pricePointData[i] - priceCurveData.data.price.min) / totalRange;
        var point = paper.circle(left * paperWidth, paperHeight * .9,10);
        point.attr("fill", "gray");
        point.attr("stroke", "white");

        return;

        bindButtonMouseEvent();

        $(".price_buttons").find("button").eq(i).text(
          $(".price_buttons").find("button").eq(i).text() + pricePointData[i]
        );


        var pathToButtonWidth = parseInt($(".price_buttons").find("button").eq(i).css("width"), 10);
        var pathToButtonLeft = Math.abs(parseInt($(this).offset().left,10) - parseInt($(".price_buttons").find("button").eq(i).offset().left, 10)) + pathToButtonWidth / 2;
        // console.log(pathToButtonLeft  )

        var pathToButton = paper.path('M' + (left * paperWidth) + ',' + (paperHeight * .9 + 9) + ' L' + left * paperWidth + ' ' + (paperHeight * .9 + 9 + 10) + ' L' + pathToButtonLeft + ' ' + (paperHeight * .9 + 9 + 10) + ' L' + pathToButtonLeft + ' ' + (paperHeight * .9 + 9 + 40))
        // pathToButton.attr("fill", "yellow")
        pathToButton.attr("stroke", "black")
        // console.log(pathToButtonLeft)/

        pricePointArray.push(point)
      }
    }
  }

  $.fn.priceCurve = priceCurve
  return priceCurve;
})
