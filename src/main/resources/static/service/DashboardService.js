var app = angular.module('myApp');

app.service("DashboardService", function($http, $timeout, $rootScope, $websocket, JolokiaService){
    var self = this;

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

    self.processDashboardStats = function(data){
        //heap
        chartData.heap.data[0].shift();
        chartData.heap.data[0].push(Math.floor(data.HeapMemoryUsage.used/1024/1024));
        chartData.heap.data[1].shift();
        chartData.heap.data[1].push(Math.floor(data.HeapMemoryUsage.max/1024/1024));
        //thread
        chartData.thread.data[0].shift();
        chartData.thread.data[0].push(data.Thread.ThreadCount);
        chartData.thread.data[1].shift();
        chartData.thread.data[1].push(data.Thread.PeakThreadCount);
        //cpu
        chartData.cpu.data[0].shift();
        chartData.cpu.data[0].push(data.CpuLoad.ProcessCpuLoad);
        chartData.cpu.data[1].shift();
        chartData.cpu.data[1].push(data.CpuLoad.SystemCpuLoad);
        $rootScope.$broadcast('chartChange', {});
    }

    var ws = $websocket((window.location.protocol.startsWith("https") ? "wss://" : "ws://") + window.location.host + '/jolokiaweb/ws', null, { reconnectIfNotNormalClose: true });
    ws.onOpen(function() {
        $rootScope.$apply();
    });
    ws.onClose(function() {
        $rootScope.$apply();
    });
    ws.onError(function(err) {
        console.error(err);
        $rootScope.$apply();
    });
    ws.onMessage(function(res) {
        var msg = JSON.parse(res.data);
        if (msg.event == "dashboard") {
            self.processDashboardStats(msg.data);
        }
    });
    $rootScope.wsConnected = function(){
        return ws.readyState === 1;
    }
});