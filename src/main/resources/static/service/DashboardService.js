var app = angular.module('myApp');

app.service("DashboardService", function($http, $timeout, $rootScope, JolokiaService){
    var chartData = {
        cpu: {
            labels:[],
            series:['Process','System'],
            data:[[],[]]
        },
        heap: {
           labels:[],
           series:['HeapMemoryUsage','Max'],
           data:[[],[]]
        },
        thread: {
           labels:[],
           series:['Current','Peak'],
           data:[[],[]]
        }
    }

    var fields = ['cpu','heap','thread'];
    _.each(fields,function(field){
        for(var i=0; i<50;i++) {
            chartData[field].labels.push("");
            if (chartData[field].series.length > 1) {
                for(var j=0;j<chartData[field].series.length; j++) {
                    chartData[field].data[j].push(0);
                }
            } else {
                chartData[field].data.push(0);
            }
        }
    });

    this.cpuChartData = function(){
        return chartData.cpu;
    }
    this.heapChartData = function(){
        return chartData.heap;
    }
    this.threadChartData = function(){
        return chartData.thread;
    }

    var pollData = function(){
        JolokiaService.dashboard().then(function(res){
            //heap
            chartData.heap.data[0].shift();
            chartData.heap.data[0].push(Math.floor(res.data.HeapMemoryUsage.used/1024/1024));
            chartData.heap.data[1].shift();
            chartData.heap.data[1].push(Math.floor(res.data.HeapMemoryUsage.max/1024/1024));
            //thread
            chartData.thread.data[0].shift();
            chartData.thread.data[0].push(res.data.Thread.ThreadCount);
            chartData.thread.data[1].shift();
            chartData.thread.data[1].push(res.data.Thread.PeakThreadCount);
            //cpu
            chartData.cpu.data[0].shift();
            chartData.cpu.data[0].push(res.data.CpuLoad.ProcessCpuLoad);
            chartData.cpu.data[1].shift();
            chartData.cpu.data[1].push(res.data.CpuLoad.SystemCpuLoad);
            $rootScope.$broadcast('chartChange', {});
            $timeout(pollData, 3000);
        });
    }
    pollData();
});