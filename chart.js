function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getCSV(){
    const url = window.location.origin+'/chart_data.csv';
    const data = httpGet(url);
    return data;
}

function parseCSV(csv, timeColNum, valueColNum){
    const data = [];
    const csvlines = csv.split('\n');
    for(let i = 1; i < csvlines.length; i++){
        let parts = csvlines[i].split(',');
        const time = parseInt(parts[timeColNum]);
        const value = parseFloat(parts[valueColNum]); 
        data.push({time:time, value:value});
    }
    return data;
}

function chartLine(data) {
    lineSeries.setData(data);
    lineChart.timeScale().fitContent();
}


function chartHisto(data) {
    volumeSeries.setData(data);
    histogramChart.timeScale().subscribeVisibleTimeRangeChange( syncHandler)
function syncHandler(e) {
    var barSpacing1 = histogramChart.timeScale().getBarSpacing();
    var scrollPosition1 = histogramChart.timeScale().scrollPosition();
    lineChart.timeScale().applyOptions({rightOffset: scrollPosition1,barSpacing: barSpacing1})
    }
}


const lineChart = LightweightCharts.createChart(document.getElementById('line'), { 
	width: 1000,
  height: 400,
	rightPriceScale: {
		scaleMargins: {
			top: 0.1,
			bottom: 0.1,
		},
		borderColor: 'rgba(197, 203, 206, 0.4)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0.4)',
        timeVisible: true
	},
	layout: {
		backgroundColor: '#100841',
		textColor: '#ffffff',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
	},
});

const histogramChart = LightweightCharts.createChart(document.getElementById('histo'), { 
	width: 1000,
  height: 200,
	rightPriceScale: {
		scaleMargins: {
			top: 0.1,
			bottom: 0.1,
		},
		mode: LightweightCharts.PriceScaleMode.Percentage,
		borderColor: 'rgba(197, 203, 206, 0.4)',
	},
	timeScale: {
		borderColor: 'rgba(197, 203, 206, 0.4)',
        timeVisible: true
	},
	layout: {
		backgroundColor: '#100841',
		textColor: '#ffffff',
	},
	grid: {
		vertLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
	},
});

const lineSeries = lineChart.addLineSeries();
const volumeSeries = histogramChart.addHistogramSeries({
	color: '#26a69a',
	priceFormat: {
		type: 'volume',
	},
	priceScaleId: '',
	scaleMargins: {
		top: 0.2,
		bottom: 0,
	},
});

const csv = getCSV();
const lineData = parseCSV(csv, 3, 1);
const histoData = parseCSV(csv, 3, 2);
chartLine(lineData);
chartHisto(histoData);



var toolTip = document.getElementById('legend')

function getMin(date){
    let minutes = String(date.getMinutes());
    if (minutes.length === 1){
        minutes = '0' + minutes;
    }
    return minutes;
}

function setLastBarText(data, type) {
    let msg = null;
    if (type === 'price'){
        msg = 'Price (USD): ';
    }
    else{
        msg = 'Volume: ';
    }
    
    var date = new Date(data[data.length-1].time*1000);
	var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + getMin(date) + ':0' + String(date.getSeconds());
	 toolTip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px;"> ETH </div>'+ '<div style="font-size: 22px; margin: 4px 0px;margin: 4px 0px">' + msg + data[data.length-1].value + '</div>' +
     '<div style="font-size: 22px;margin: 4px 0px">' + dateStr + '</div>';
}
setLastBarText(lineData, 'price');

lineChart.subscribeCrosshairMove(function(param) {
    if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 1000 || param.point.y < 0 || param.point.y > 500 ) {
        setLastBarText(lineData, 'price');
  } else {
    date = new Date(param.time*1000);
    dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + getMin(date) + ':0' + String(date.getSeconds());
    var price = param.seriesPrices.get(lineSeries);
    toolTip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px"> ETH </div>' + '<div style="font-size: 22px; margin: 4px 0px">' + 'Price (USD): ' + (Math.round(price * 100) / 100).toFixed(2) + '<div style="font-size: 22px; margin: 4px 0px">' + dateStr + '</div>';
  }    
    
  
  });

  histogramChart.subscribeCrosshairMove(function(param) {
    if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > 1000 || param.point.y < 0 || param.point.y > 200 ) {
        setLastBarText(histoData);
  } else {
    date = new Date(param.time*1000);
    dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + getMin(date) + ':0' + String(date.getSeconds());
    var price = param.seriesPrices.get(volumeSeries);
    toolTip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px"> ETH </div>' + '<div style="font-size: 22px; margin: 4px 0px">' + 'Volume: ' + price + '<div style="font-size: 22px; margin: 4px 0px">' + dateStr + '</div>';
  }    
    
  
  });