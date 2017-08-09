angular.module("myApp").component('cpuChart', {
    templateUrl: '/static/component/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService){
        this.labels = DashboardService.cpuChartData().labels;
        this.series = DashboardService.cpuChartData().series;
        this.data = DashboardService.cpuChartData().data;

        this.datasetOverride = [{ yAxisID: 'y-axis-cpu1' }];
        this.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-cpu1',
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        beginAtZero:true,
                        max: 1,
                        stepsize: 0.1
                    }
                }]
            }
        };

        this.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $rootScope.$on('chartChange',function(){
            this.labels = DashboardService.cpuChartData().labels;
            this.series = DashboardService.cpuChartData().series;
            this.data = DashboardService.cpuChartData().data;
        });
    }
});
