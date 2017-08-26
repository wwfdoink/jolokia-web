angular.module("jolokiaWeb").component('threadChart', {
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
                series:['Current','Peak'],
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
                        id: 'y-axis-thread1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            beginAtZero:true,
                        },
                        scaleLabel:{
                            display: true,
                            labelString: 'Number of Threads',
                            fontColor: "#666666"
                        }
                    }]
                },
                legend: {
                    display:true
                }
            };

            self.dashboardSub = DashboardService.chartEvents.thread.subscribe(
                function(data){
                    self.processStats(data);
                }
            )            
        }

        var prevNan = false;
        self.processStats = function(data){
            prevNaN = isNaN(self.chartData.data[0][0]);
            // shift
            self.chartData.data[0].shift();
            self.chartData.data[1].shift();

            // push data
            self.chartData.data[0].push(data.ThreadCount);
            self.chartData.data[1].push(data.PeakThreadCount);
            
            // To prevent chatjs shift error
            if (!prevNaN) {
                self.chartData.data[0][0]=Number.NaN;
                self.chartData.data[1][0]=Number.NaN;
            }
        }

        self.$onDestroy = function(){
            self.dashboardSub.unsubscribe();
        }
    }
});
