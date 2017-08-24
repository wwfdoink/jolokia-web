angular.module('jolokiaWeb').service("DashboardService", function($http, $timeout, $rootScope, $websocket, JolokiaService, LocalStorageService, UtilService, jsPath){
    var self = this;

    self.chartData = {
        cpu: {
            labels:[],
            series:['Process','System'],
            data:[[],[]]
        },
        heap: {
           labels:[],
           series:['Used','Committed','Max'],
           data:[[],[],[]]
        },
        nonHeap: {
           labels:[],
           series:['Used','Committed','Max'],
           data:[[],[],[]]
        },
        swap: {
           labels:[],
           series:['Used','Total'],
           data:[[],[]]
        },
        physicalMemory: {
           labels:[],
           series:['Used','Total'],
           data:[[],[]]
        },
        thread: {
           labels:[],
           series:['Current','Peak'],
           data:[[],[]]
        }
    }

    _.each(Object.keys(self.chartData),function(field){
        for(var i=0; i<50;i++) {
            self.chartData[field].labels.push("");
            if (self.chartData[field].series.length > 1) {
                for(var j=0;j<self.chartData[field].series.length; j++) {
                    self.chartData[field].data[j].push(Number.NaN);
                }
            } else {
                self.chartData[field].data.push(Number.NaN);
            }
        }
    });

    this.cpuChartData = function(){
        return self.chartData.cpu;
    }
    this.heapChartData = function(){
        return self.chartData.heap;
    }
    this.nonHeapChartData = function(){
        return self.chartData.nonHeap;
    }
    this.threadChartData = function(){
        return self.chartData.thread;
    }
    this.swapChartData = function(){
        return self.chartData.swap;
    }
    this.physicalMemoryChartData = function(){
        return self.chartData.physicalMemory;
    }

    self.processDashboardStats = function(data){
        /* Update X-axis labels
        var time = UtilService.getTimeString();
        _.each(Object.keys(self.chartData),function(field){
            self.chartData[field].labels.shift();
            self.chartData[field].labels.push(time);
        });*/

        /*
         Since angular $watch can't detect the below change type and the chart
         doesn't flow and bugs out. That's why we ask for another $digest cycle to push data.
         You can't shift the array first that's why we set to NaN because the
         data array length must match to keep the smooth animation.

         arr = [1,1,1]
         arr.shift()
         arr.push(1)
        */
        //shift heap
        self.chartData.heap.data[0][0]=Number.NaN;
        self.chartData.heap.data[1][0]=Number.NaN;
        self.chartData.heap.data[2][0]=Number.NaN;
        //shift nonHeap
        self.chartData.nonHeap.data[0][0]=Number.NaN;
        self.chartData.nonHeap.data[1][0]=Number.NaN;
        self.chartData.nonHeap.data[2][0]=Number.NaN;
        //shift thread
        self.chartData.thread.data[0][0]=Number.NaN;
        self.chartData.thread.data[1][0]=Number.NaN;
        //shift cpu
        self.chartData.cpu.data[0][0]=Number.NaN;
        self.chartData.cpu.data[1][0]=Number.NaN;
        //shift swap
        self.chartData.swap.data[0][0]=Number.NaN;
        self.chartData.swap.data[1][0]=Number.NaN;
        //shift mem
        self.chartData.physicalMemory.data[0][0]=Number.NaN;
        self.chartData.physicalMemory.data[1][0]=Number.NaN;

        $timeout(function(){
            //shift heap
            self.chartData.heap.data[0].shift();
            self.chartData.heap.data[1].shift();
            self.chartData.heap.data[2].shift();
            //shift nonHeap
            self.chartData.nonHeap.data[0].shift();
            self.chartData.nonHeap.data[1].shift();
            self.chartData.nonHeap.data[2].shift();
            //shift thread
            self.chartData.thread.data[0].shift();
            self.chartData.thread.data[1].shift();
            //shift cpu
            self.chartData.cpu.data[0].shift();
            self.chartData.cpu.data[1].shift();
            //shift swap
            self.chartData.swap.data[0].shift();
            self.chartData.swap.data[1].shift();
            //shift mem
            self.chartData.physicalMemory.data[0].shift();
            self.chartData.physicalMemory.data[1].shift();

            //heap
            self.chartData.heap.data[0].push(data.memory.HeapMemoryUsage.used);
            self.chartData.heap.data[1].push(data.memory.HeapMemoryUsage.committed);
            self.chartData.heap.data[2].push(data.memory.HeapMemoryUsage.max);
            //non-heap
            self.chartData.nonHeap.data[0].push(data.memory.NonHeapMemoryUsage.used);
            self.chartData.nonHeap.data[1].push(data.memory.NonHeapMemoryUsage.committed);
            self.chartData.nonHeap.data[2].push((data.memory.NonHeapMemoryUsage.max <= 0) ? Number.NaN : data.memory.NonHeapMemoryUsage.max);
            //thread
            self.chartData.thread.data[0].push(data.thread.ThreadCount);
            self.chartData.thread.data[1].push(data.thread.PeakThreadCount);
            //cpu
            self.chartData.cpu.data[0].push((data.os.ProcessCpuLoad == -1) ? Number.NaN : Math.round(data.os.ProcessCpuLoad * 100));
            self.chartData.cpu.data[1].push((data.os.SystemCpuLoad == -1) ? Number.NaN : Math.round(data.os.SystemCpuLoad * 100));
            //swap
            self.chartData.swap.data[0].push((data.os.SystemCpuLoad == -1) ? Number.NaN : data.os.TotalSwapSpaceSize - data.os.FreeSwapSpaceSize);
            self.chartData.swap.data[1].push((data.os.TotalSwapSpaceSize == -1) ? Number.NaN : data.os.TotalSwapSpaceSize);
            //physicalMemory
            self.chartData.physicalMemory.data[0].push((data.os.FreePhysicalMemorySize == -1 || data.os.TotalPhysicalMemorySize == -1) ? Number.NaN : data.os.TotalPhysicalMemorySize - data.os.FreePhysicalMemorySize);
            self.chartData.physicalMemory.data[1].push((data.os.TotalPhysicalMemorySize == -1) ? Number.NaN : data.os.TotalPhysicalMemorySize);
        });

    }

    var ws = $websocket(jsPath.ws, null, { 
        reconnectIfNotNormalClose: true,
        maxTimeout: 10,
        initialTimeout: 5
    });
    ws.onOpen(function() {
        var delay = LocalStorageService.get("dashboardUpdateDelay");
        if (delay != null) {
            self.updateDashboardDelay(delay);
        }
        $rootScope.$apply();
    });
    ws.onClose(function() {
        $rootScope.$apply();
    });
    ws.onError(function(err) {
        $rootScope.$apply();
    });
    ws.onMessage(function(res) {
        var msg = JSON.parse(res.data);
        if (msg.event == "dashboard") {
            self.processDashboardStats(msg.data);
        }
    });
    self.updateDashboardDelay = function(delay){
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(
                { 
                    event: 'settings.changeDashboardDelay',
                    data: { 
                        delay: delay
                    }
                }
            ));
        }
    }
    $rootScope.wsConnected = function(){
        return ws.readyState === 1;
    }
});