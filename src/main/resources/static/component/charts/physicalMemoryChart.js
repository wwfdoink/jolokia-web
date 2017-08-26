angular.module("jolokiaWeb").component('physicalMemoryChart', {
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
                series:['Used','Committed','Max'],
                data:[[],[],[]]
             }

            // fill with empty values
            UtilService.fillEmptyChartData(self.chartData);
                
            this.datasetOverride = [
                UtilService.chartColor(150,187,205),
                UtilService.chartColor(220,220,220)
            ];
            this.options = {
                scales: {
                    yAxes: [{
                        id: 'y-axis-phys1',
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: UtilService.chartTicks(Math.pow(1024,2)*512), // 512 MiB,
                        scaleLabel:{
                            display: true,
                            labelString: 'Physical Memory usage',
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
            self.chartData.data[0].push((data.FreePhysicalMemorySize == -1 || data.TotalPhysicalMemorySize == -1) ? Number.NaN : data.TotalPhysicalMemorySize - data.FreePhysicalMemorySize);
            self.chartData.data[1].push((data.TotalPhysicalMemorySize == -1) ? Number.NaN : data.TotalPhysicalMemorySize);    
        }

        self.$onDestroy = function(){
            self.dashboardSub.unsubscribe();
        }
    }
});
