angular.module("jolokiaWeb").component('chartSubscribeButton', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/chartSubscribeButton/chartSubscribeButton.html';
    },
    bindings: {
        bean: '<',
        attr: '<'
    },
    controller: function(DashboardService, LocalStorageService, Notification) {
        var self = this;

        self.$onInit = function(){
        }

        self.isTrackable = function(){
            var allowed = ['long','int','double','float'];
            return (_.contains(allowed, self.attr.type));
        }

        self.trackAttribute = function() {
            if (self.alreadyTracking()){
                DashboardService.unTrackAttribute(self.bean.id, self.attr.name);
                Notification.success({
                    title: '<i class="fa fa-check"></i> Attribute tracking removed...',
                    message: self.attr.name + '<br>' + self.bean.id,
                    delay: 5000
                });            
            } else {
                DashboardService.trackAttribute(self.bean.id, self.attr.name);
                Notification.success({
                    title: '<i class="fa fa-check"></i> Attribute tracking added...',
                    message: self.attr.name + '<br>' + self.bean.id,
                    delay: 5000
                });            
            }
        };

        self.alreadyTracking = function() {
            var trackedAttributes = LocalStorageService.get("trackedAttributes");
            if (trackedAttributes == null) {
                return false;
            }
            return _.findWhere(trackedAttributes, {id:self.bean.id,name:self.attr.name});
        }

        self.tooltipMessage = function(){
            if (!self.isTrackable()) {
                return "You can only track number type attributes!";
            }
            if (self.alreadyTracking()) {
                return "Unsubscribe from tracking";
            }
            return "Track this attribute value";
        }
    }
});
