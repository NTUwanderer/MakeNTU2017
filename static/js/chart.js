const socket = io.connect('http://haglass.japaneast.cloudapp.azure.com:3000/');

socket.on('news', (data) => {
  console.log(data);
});

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

var initialX = 0;

function drawBasic() {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Time');
  data.addColumn('number', 'Distance');
  data.addRows([[0,0]]);

  var options = {
    width: 800,
    height: 300,
	chartArea: { left:60,top:30,width:'78%',height:'75%'},
    hAxis: {
      title: 'Time',
      viewWindow: {min:0, max:29}
    },
    vAxis: {
      title: 'Distance',
	  minValue: 0
    },
    animation: {
      duration: 1,
      startup: true,
      easing: 'inAndOut'
    },
    curveType: 'function'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  function drawChart() {
    chart.draw(data, options);
  }

  var addData = function(newData) {
console.log('I got newData: ', newData);
    if (data.getNumberOfRows() > 30) {
      data.removeRow(0);
    options.hAxis.viewWindow.min += 1;
    options.hAxis.viewWindow.max += 1;
    }
    // Generating a random x, y pair and inserting it so rows are sorted.
	if ( initialX === 0 ) {
		initialX = newData.time;
    	x = 0;
	} else {
    	x = (newData.time - initialX) / 1000;
	}
	var y = (newData.CM > 500 ? 0 : newData.CM);
    var where = data.getNumberOfRows();
    data.insertRows(where, [[x, y]]);
    drawChart();
  }
  drawChart();

socket.on('disdata', (data) => {
	addData(data);
});

  // var intervalID = setInterval(testData, 1000);
}


