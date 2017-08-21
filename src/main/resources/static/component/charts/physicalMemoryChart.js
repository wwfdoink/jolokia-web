angular.module("myApp").component('physicalMemoryChart', {
    templateUrl: '/static/component/charts/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService, UtilService){
        this.labels = DashboardService.physicalMemoryChartData().labels;
        this.series = DashboardService.physicalMemoryChartData().series;
        this.data = DashboardService.physicalMemoryChartData().data;

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

        this.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $rootScope.$on('chartChange',function(){
            this.labels = DashboardService.physicalMemoryChartData().labels;
            this.series = DashboardService.physicalMemoryChartData().series;
            this.data = DashboardService.physicalMemoryChartData().data;
        });
    }
});
