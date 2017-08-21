angular.module("myApp").component('swapChart', {
    templateUrl: '/static/component/charts/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService, UtilService){
        this.labels = DashboardService.swapChartData().labels;
        this.series = DashboardService.swapChartData().series;
        this.data = DashboardService.swapChartData().data;

        this.datasetOverride = [
            UtilService.chartColor(150,187,205),
            UtilService.chartColor(220,220,220)
        ];

        this.options = {
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

        this.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $rootScope.$on('chartChange',function(){
            this.labels = DashboardService.swapChartData().labels;
            this.series = DashboardService.swapChartData().series;
            this.data = DashboardService.swapChartData().data;
        });
    }
});
