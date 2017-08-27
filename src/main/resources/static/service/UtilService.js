angular.module('jolokiaWeb').service("UtilService", function(){
    var self = this;

    this.getTimeString = function(){
        var date = new Date();
        return ("0000" + date.getHours()).slice(-2) + ":" + ("0000" + date.getMinutes()).slice(-2) + ":" + ("0000" + date.getSeconds()).slice(-2);
    }

    this.formatBytes = function(bytes, decimals) {
       if (bytes <= 1) return '0';
       var k = 1024,
           dm = ((typeof decimals == "undefined") || (decimals === null)) ? 2 : decimals,
           sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));

       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    this.chartTicks = function(stepSize){
        return {
            beginAtZero: true,
            stepSize: stepSize,
            autoSkip: true,
            //maxTicksLimit: 10, this is not working
            callback: function(label, index, labels) {
                if (!(index % parseInt(labels.length / 8))) {
                    return self.formatBytes(label, 2);
                }
            }
        }
    }
    
    this.chartColor = function(r,g,b){
        return {
            backgroundColor: "rgba("+r+","+g+","+b+",0.3)",
            borderColor: "rgba("+r+","+g+","+b+",0.8)",
            pointBackgroundColor: "rgba("+r+","+g+","+b+",0.8)",
            pointHoverBackgroundColor: "rgba("+r+","+g+","+b+",0.8)",
            pointHoverBorderColor: "rgba("+r+","+g+","+b+",1)"
        }
    }

    this.fillEmptyChartData = function(chartData) {
        for (var i=0; i<50;i++) {
            chartData.labels.push("");
            if (chartData.series.length > 1) {
                for(var j=0;j<chartData.series.length; j++) {
                    chartData.data[j].push(Number.NaN);
                }
            } else {
                chartData.data[0].push(Number.NaN);
            }
        }
        return chartData;
    }

});