document.getElementById("tab-1-button").classList.add("active");
document.getElementById("tab-1-content").style.display = "block";

function getStockData(){
    var stock_name1 = document.getElementById("stock_name1").value;
    var stock_name2 = document.getElementById("stock_name2").value;
    var start_date = document.getElementById("start_date").value;
    var end_date = document.getElementById("end_date").value;
    var xhr1 = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();

    xhr1.open("GET", "http://127.0.0.1:5000/stock-risk?stock_name="+stock_name1+"&start_date="+start_date+"&end_date="+end_date, true);
    xhr2.open("GET", "http://127.0.0.1:5000/stock-risk?stock_name="+stock_name2+"&start_date="+start_date+"&end_date="+end_date, true);

    xhr1.onload = function () {
        if (xhr1.readyState === 4 && xhr1.status === 200) {
            var data = JSON.parse(xhr1.responseText);

            var dates = [];
            var prices = [];

            for (var date in data.data.Close) {
                dates.push(date);
                prices.push(data.data.Close[date]);
                }
            plotStockData(dates, prices, 'plot1', stock_name1)
        };
    };
    xhr2.onload = function () {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            var data = JSON.parse(xhr2.responseText);

            var dates = [];
            var prices = [];

            for (var date in data.data.Close) {
                dates.push(date);
                prices.push(data.data.Close[date]);
                }
            plotStockData(dates, prices, 'plot2', stock_name2)
        };
    };
    xhr1.send();
    xhr2.send();
}

function plotStockData(x, y, plot_id, stock_name) {
    var trace = {
        x: x,
        y: y,
        type: 'line'
    };

    var layout = {
        title: 'Historical Stock Price: ' + stock_name,
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: 'Price'
        }
    };

    Plotly.newPlot(plot_id, [trace], layout);
};


function fetchStockData(stockName, startDate, endDate) {
  // Fetch stock data from the server
  fetch("http://127.0.0.1:5000/stock-data?stock_name=${stockName}&start_date=${startDate}&end_date=${endDate}")
    .then(response => response.json())
    .then(data => {
      // Calculate descriptive statistics
      const mean = data.mean;
      const std = data.std;
      const min = data.min;
      const max = data.max;
      // Display statistics in table
      displayStatistics(mean, std, min, max);
    });
}

function displayStatistics(mean, std, min, max) {
  const tab2Content = document.getElementById("tab-2-content");
  // Create table element
  const table = document.createElement("table");
  // Create rows for mean, std, min and max
  const meanRow = document.createElement("tr");
  meanRow.innerHTML = `<td>Mean</td><td>${mean}</td>`;
  const stdRow = document.createElement("tr");
  stdRow.innerHTML = `<td>Standard Deviation</td><td>${std}</td>`;
  const minRow = document.createElement("tr");
  minRow.innerHTML = `<td>Minimum</td><td>${min}</td>`;
  const maxRow = document.createElement("tr");
  maxRow.innerHTML = `<td>Maximum</td><td>${max}</td>`;
  // Add rows to table
  table.appendChild(meanRow);
  table.appendChild(stdRow);
  table.appendChild(minRow);
  table.appendChild(maxRow);
  // Clear previous content in tab 2
  tab2Content.innerHTML = "";
  // Add table to tab 2 content
  tab2Content.appendChild(table);
}



// function to handle tab button clicks
var tabs = document.getElementsByClassName("tab-button");
for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        console.log(current.length)
        if (current != null){
            //window.alert(current.className)
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
        var tabContent = document.getElementsByClassName("tab-content");
        for (var i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        var tabId = this.id.replace("-button", "-content");
        document.getElementById(tabId).style.display = "block";
    });
}

// set the active tab to be tab 1 when the page is loaded
document.getElementById("tab-1-button").click();