angular.module("jolokiaWeb").component('attributeChart',  {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/charts/simpleChart.html';
    },
    bindings: {
        id: '<',
        name: '<',
    },
    controller: function(DashboardService, UtilService){
        var self = this;

        self.$onInit = function(){
            self.chartData = {
                labels:[],
                series:[self.name],
                data:[[]]
            }

            // fill with empty values
            UtilService.fillEmptyChartData(self.chartData);
            
            self.datasetOverride = [
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
                        },
                        scaleLabel:{
                            display: true,
                            labelString: self.name,
                            fontColor: "#666666"
                        }
                    }]
                },
                tooltips: {
                    enabled: true,
                    mode: 'label',
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

            self.chartSub = DashboardService.chartEvents[self.id + ":" + self.name].subscribe(
                function(data){
                    self.processStats(data);
                }
            )
        } // $onInit

        var prevNan = false;
        self.processStats = function(data){
            prevNaN = isNaN(self.chartData.data[0][0]);
            self.chartData.data[0].shift();
            self.chartData.data[0].push(data[self.name]);
            // To prevent chatjs shift error
            if (!prevNaN) {
                self.chartData.data[0][0]=Number.NaN;
            }
        }

        self.$onDestroy = function(){
            self.chartSub.unsubscribe();
        }
    }
});
