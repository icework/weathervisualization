$(function(){
    initializeHtml();
    //drawChart();
})


function drawTavgLineChart(data) {
    nv.addGraph(function () {
        var tvgLineChart = nv.models.lineWithFocusChart();
        // chart.transitionDuration(500);
        tvgLineChart.xAxis
            .tickFormat(d3.format(',f'));
        tvgLineChart.yAxis
            .tickFormat(d3.format(',.2f'));
        //var lineData = testData();
        d3.select('#tavglinechart svg')
            .datum(data)
            .call(tvgLineChart);

        nv.utils.windowResize(tvgLineChart.update);
        return tvgLineChart;
    });
}

function drawPrecipBarChart(data) {
    nv.addGraph(function() {
        chart = nv.models.multiBarChart()
          .barColor(d3.scale.category20().range())
          .margin({bottom: 100})
          .transitionDuration(300)
          .delay(0)
          .groupSpacing(0.1);

        chart.xAxis
            .axisLabel("Month")
            .showMaxMin(true)
            .tickFormat(d3.format(',.0f'));

        chart.yAxis
            .axisLabel("Days")
            .tickFormat(d3.format(',.0f'));

        d3.select('#precipbarchart svg')
            .datum(data)
           .call(chart);

        chart.multibar
          .hideable(true);

        chart.reduceXTicks(false).staggerLabels(true);
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
}

function drawSnowBarChart(data) {
    nv.addGraph(function() {
        chart = nv.models.multiBarChart()
          .barColor(d3.scale.category20().range())
          .margin({bottom: 100})
          .transitionDuration(300)
          .delay(0)
          .groupSpacing(0.1);

        chart.xAxis
            .axisLabel("Month")
            .showMaxMin(true)
            .tickFormat(d3.format(',.0f'));

        chart.yAxis
            .axisLabel("Days")
            .tickFormat(d3.format(',.0f'));

        d3.select('#snowbarchart svg')
            .datum(data)
           .call(chart);

        chart.multibar
          .hideable(true);

        chart.reduceXTicks(false).staggerLabels(true);
        nv.utils.windowResize(chart.update);
        chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
        return chart;
    });
}

function drawChart(cityName){
    var urlOfTavgCity = '/weatherdata/'+cityName;
    $.getJSON(urlOfTavgCity, function(data){
        drawTavgLineChart(data[0]);
        drawPrecipBarChart(data[1]);
        drawSnowBarChart(data[2]);
    })
}

function initializeSelection(){
    var urlForCityList = '/citylist'
    $.getJSON(urlForCityList, function(data){
        data.sort();
        for(var i=0; i<data.length; i++){
            var option1 = $("<option>").text(data[i]);
            $("#city1").append(option1);
            var option2 = $("<option>").text(data[i]);
            $("#city2").append(option2);
        }
    });
}

function initializeFormAndTab(){
    $("#city2").hide();
    $("#cityNum").click(function(){
        if($("#city2").css('display') == 'none'){
            $("#city2").show();
            $("#smicon").removeClass("glyphicon-plus").addClass("glyphicon-minus")
        }else{
            $("#city2").hide();
            $("#smicon").removeClass("glyphicon-minus").addClass("glyphicon-plus")
        }
    })
}

function initializeHtml(){
    initializeSelection();
    initializeFormAndTab();
    $("#draw").click(function(){
        var cityName = ""
        if($("#city2").css('display') == 'none'){
            cityName = $('#city1').find(":selected").text();
            drawChart(cityName);
        }else{
            cityName = $('#city1').find(":selected").text() + "PLUS" + $('#city2').find(":selected").text();
            drawChart(cityName);
        }
        $("#tab a:first").tab("show");
    })

}



