const ChartJSImage = require('chart.js-image');

class MonthlyReportLineGraph {
  constructor(export_data, import_data) {
    this.export_data = export_data;
    this.import_data = import_data;
  }
  async generateSalesLineGraph() {
    const line_chart = ChartJSImage().chart({
      "type": "line",
      "data": {
        "datasets": [
          {
            "borderColor": "rgb(255,+99,+132)",
            "backgroundColor": "rgba(255,+99,+132,+.5)",
            "data": this.export_data
          }
        ]
      },
      "options": {
        "title": {
          "display": true,
          "text": "Total Sales"
        },
        "scales": {
          "xAxes": [
            {
              "scaleLabel": {
                "display": true,
                "labelString": "Day"
              }
            }
          ],
          "yAxes": [
            {
              "scaleLabel": {
                "display": true,
                "labelString": "$"
              }
            }
          ]
        },
        "parsing": {
          xAxisKey: 'day',
          yAxisKey: 'value'
      }
      }
    })
    .backgroundColor('white')
    .width(500) // 500px
    .height(300); // 300px
    const fileName = './sales_chart.png';
    line_chart.toURL(); 
    line_chart.toFile(fileName); 
    line_chart.toDataURI(); 
    line_chart.toBuffer();
    return true;
  }

  async generateImportLineGraph() {
    const line_chart = ChartJSImage().chart({
      "type": "line",
      "data": {
        "datasets": [
          {
            "borderColor": "rgb(255,+99,+132)",
            "backgroundColor": "rgba(255,+99,+132,+.5)",
            "data": this.import_data
          }
        ]
      },
      "options": {
        "title": {
          "display": true,
          "text": "Imports"
        },
        "scales": {
          "xAxes": [
            {
              "scaleLabel": {
                "display": true,
                "labelString": "Day"
              }
            }
          ],
          "yAxes": [
            {
              "scaleLabel": {
                "display": true,
                "labelString": "$"
              }
            }
          ]
        },
        "parsing": {
          xAxisKey: 'day',
          yAxisKey: 'value'
      }
      }
    })
    .backgroundColor('white')
    .width(500) // 500px
    .height(300); // 300px
    const fileName = './imports_chart.png';
    line_chart.toURL(); 
    line_chart.toFile(fileName); 
    line_chart.toDataURI(); 
    line_chart.toBuffer();
    return true;
  }
  
}

module.exports = MonthlyReportLineGraph;