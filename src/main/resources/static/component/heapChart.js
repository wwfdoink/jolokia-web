angular.module("myApp").component('heapChart', {
    templateUrl: '/jolokiaweb/static/component/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService){
        this.labels = DashboardService.heapChartData().labels;
        this.series = DashboardService.heapChartData().series;
        this.data = DashboardService.heapChartData().data;

        this.datasetOverride = [{ yAxisID: 'y-axis-heap1' }];
        this.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-heap1',
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
            this.labels = DashboardService.heapChartData().labels;
            this.series = DashboardService.heapChartData().series;
            this.data = DashboardService.heapChartData().data;
        });
    }
});
