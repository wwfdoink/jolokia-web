angular.module("jolokiaWeb").component('swapChart', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/charts/simpleChart.html';
    },
    bindings: {
    },
    controller: function(DashboardService, UtilService){
        var self = this;

        self.$onInit = function() {
            self.chartData = {
                labels:[],
                series:['Used','Total'],
                data:[[],[]]
             }

            // fill with empty values
            UtilService.fillEmptyChartData(self.chartData);

            self.datasetOverride = [
                UtilService.chartColor(150,187,205),
                UtilService.chartColor(220,220,220)
            ];

            self.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-heap1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: UtilService.chartTicks(Math.pow(1024,3)), // 1 GiB
                        scaleLabel:{
                            display: true,
                            labelString: 'Swap usage',
                            fontColor: "#666666"
                        }
                    }]
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            return data.datasets[tooltipItems.datasetIndex].label + ': ' + UtilService.formatBytes(tooltipItems.yLabel, 2);
                        }
                    }
                },
                legend: {
                    display:true
                }
            };

            self.dashboardSub = DashboardService.chartEvents.os.subscribe(
                function(data){
                    self.processStats(data);
                }
            )            
        }

        self.processStats = function(data){
            // shift
            self.chartData.data[0].shift();
            self.chartData.data[1].shift();
            // push data
            self.chartData.data[0].push((data.SystemCpuLoad == -1) ? Number.NaN : data.TotalSwapSpaceSize - data.FreeSwapSpaceSize);
            self.chartData.data[1].push((data.TotalSwapSpaceSize == -1) ? Number.NaN : data.TotalSwapSpaceSize);
        }

        self.$onDestroy = function(){
            self.dashboardSub.unsubscribe();
        }
    }
});
