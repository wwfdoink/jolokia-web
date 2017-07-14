angular.module("myApp").component('threadChart', {
    templateUrl: '/jolokiaweb/static/component/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService){
        this.labels = DashboardService.threadChartData().labels;
        this.series = DashboardService.threadChartData().series;
        this.data = DashboardService.threadChartData().data;

        this.datasetOverride = [{ yAxisID: 'y-axis-thread1' }];
        this.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-thread1',
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        beginAtZero:true,
                    }
                }]
            }
        };

        this.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $rootScope.$on('chartChange',function(){
            this.labels = DashboardService.threadChartData().labels;
            this.series = DashboardService.threadChartData().series;
            this.data = DashboardService.threadChartData().data;
        });
    }
});
