google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Time');
  data.addColumn('number', 'Distance');
  data.addRows([[0,0]]);

  var options = {
    width: 500,
    height: 300,
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
    // Disabling the button while the chart is drawing.
    google.visualization.events.addListener(chart, 'ready', function(){console.log('chart get ready!');});
    chart.draw(data, options);
  }

  var initialX = 1;
  var testData = function() {
    if (data.getNumberOfRows() > 30) {
      data.removeRow(0);
    options.hAxis.viewWindow.min += 1;
    options.hAxis.viewWindow.max += 1;
    }
    // Generating a random x, y pair and inserting it so rows are sorted.
    var x = initialX;
    ++initialX;
    var y = Math.floor(Math.random() * 100);
    var where = data.getNumberOfRows();
    data.insertRows(where, [[x, y]]);
    drawChart();
  }
  drawChart();

  var intervalID = setInterval(testData, 1000);
}


