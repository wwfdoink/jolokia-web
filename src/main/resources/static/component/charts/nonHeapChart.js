angular.module("myApp").component('nonHeapChart', {
    templateUrl: '/static/component/charts/simpleChart.html',
    bindings: {
    },
    controllerAs: 'ctx',
    controller: function($rootScope, DashboardService, UtilService){
        this.labels = DashboardService.nonHeapChartData().labels;
        this.series = DashboardService.nonHeapChartData().series;
        this.data = DashboardService.nonHeapChartData().data;

        this.datasetOverride = [
            UtilService.chartColor(225,0,0),
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
                    ticks: {
                        beginAtZero:true,
                        callback: function(label, index, labels) {
                            return UtilService.formatBytes(label, 0);
                        }
                    },
                    scaleLabel:{
                        display: true,
                        labelString: 'Memory usage',
                        fontColor: "#666666"
                    }
                }]
            },
            tooltips: {
                enabled: true,
                mode: 'label',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return data.datasets[tooltipItems.datasetIndex].label + ': ' + UtilService.formatBytes(tooltipItems.yLabel, 0);
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
            this.labels = DashboardService.nonHeapChartData().labels;
            this.series = DashboardService.nonHeapChartData().series;
            this.data = DashboardService.nonHeapChartData().data;
        });
    }
});
