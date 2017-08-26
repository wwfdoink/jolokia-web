angular.module("jolokiaWeb").component('cpuChart',  {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/charts/simpleChart.html';
    },
    bindings: {
    },
    controller: function(DashboardService, UtilService){
        var self = this;

        self.$onInit = function(){
            self.chartData = {
                labels:[],
                series:['Process','System'],
                data:[[],[]]
            }

            // fill with empty values
            UtilService.fillEmptyChartData(self.chartData);
            
            self.datasetOverride = [
                UtilService.chartColor(240,0,0,0),
                UtilService.chartColor(150,187,205)
            ];
    
            self.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-cpu1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            beginAtZero:true,
                            max: 100,
                            stepsize: 10,
                            callback: function(label, index, labels) {
                                return label + " %";
                            }
                        },
                        scaleLabel:{
                            display: true,
                            labelString: 'CPU load',
                            fontColor: "#666666"
                        }
                    }]
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItems, data) {
                            return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel + " % ";
                        }
                    }
                },
                legend: {
                    display:true
                },
                plotOptions: {
                    line: {
                        colorIndex: 4
                    }
                }
            };

            self.dashboardSub = DashboardService.chartEvents.os.subscribe(
                function(data){
                    self.processStats(data);
                }
            )
        } // $onInit

        self.processStats = function(data){
            // shift
            self.chartData.data[0].shift();
            self.chartData.data[1].shift();
            // push data
            self.chartData.data[0].push((data.ProcessCpuLoad == -1) ? Number.NaN : Math.round(data.ProcessCpuLoad * 100));
            self.chartData.data[1].push((data.SystemCpuLoad == -1) ? Number.NaN : Math.round(data.SystemCpuLoad * 100));
        }


        self.$onDestroy = function(){
            self.dashboardSub.unsubscribe();
        }
    }
});
