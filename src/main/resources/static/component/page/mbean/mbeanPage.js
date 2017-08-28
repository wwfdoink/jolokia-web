angular.module("jolokiaWeb").component('mbeanPage', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/page/mbean/mbeanPage.html';
    },
    bindings: {
    },
    controller: function($scope, $filter, JolokiaService, LocalStorageService) {
        var self = this;
        // cache for original tree model
        var origTree = [];

        self.$onInit = function () {
            self.hasPermission = JolokiaService.hasPermission;   
            self.tree = [];
            self.loading = true;
            self.currentNode = null;
            self.searchTree = null;
            self.showOperationParamTypes = LocalStorageService.get("showOperationParamTypes");
            
            $scope.$watch(function() { return self.currentNode; }, function() {
                self.getBeanValue();
            }, false);
        };

        JolokiaService.getMbeanTree().then(function(res){
            self.tree = $filter('beanTree')(res.data.value);
            origTree = angular.copy(self.tree);
        }).catch(function(err){
            var errorText;
            if (_.isObject(err.data)) { errorText = err.data.error; }
            else if (err.data) { errorText = err.data; }
            else { errorText = "Failed to load resource: [" + err.config.method + "] " + err.config.url }
            Notification.error({title: '<i class="fa fa-exclamation-triangle"></i> Request error', message: errorText, delay: 10000});
        }).finally(function(){
            self.loading = false;
        });

        self.getBeanValue = function(){
            if (angular.isObject(self.currentNode) && self.currentNode.class) {
                var bean = self.currentNode;
                self.beanLoading = true;
                JolokiaService.read(bean.id).then(function(res) {
                    for (key in res.data) {
                        if (res.data.hasOwnProperty(key)) {
                            bean.attr.forEach(function(attr){
                                if (key === attr.name) {
                                    attr.value = res.data[key];
                                }
                            });
                        }
                    }
                }).catch(function(err){
                    var errorText;
                    if (_.isObject(err.data)) { errorText = err.data.error; }
                    else if (err.data) { errorText = err.data; }
                    else { errorText = "Failed to load resource: [" + err.config.method + "] " + err.config.url }
                    Notification.error({title: '<i class="fa fa-exclamation-triangle"></i> Request error', message: errorText, delay: 10000});
                }).finally(function(){
                    self.beanLoading = false;
                });
            }
        }
        self.isBeanNode = function(){
            return (self.currentNode && (self.currentNode.hasOwnProperty("class")))
        }
        self.toggleTree = function(status){
            setTreeOpenStatus(self.tree, status);
        };

        self.clearSearchText = function(){
            self.treeSearchText = '';
            self.onSearchTextChange();
        }
        
        self.onSearchTextChange = function(){
            self.tree = $filter('beanTreeSearch')(origTree, self.treeSearchText);
            if (self.treeSearchText && self.treeSearchText.length > 0) {
                self.toggleTree(true);
            } else {
                self.toggleTree(false);
            }
        }

        var setTreeOpenStatus = function(item, status){
            for(var i=0;i<item.length;i++) {
                item[i].isOpen = status;
                if (item[i].children && item[i].children.length > 0) {
                    setTreeOpenStatus(item[i].children, status);
                }
            }
        }

        self.toggleAttributeSearch = function(){
            self.showAttributeSearch = !self.showAttributeSearch;
        }
        self.toggleOperationSearch = function(){
            self.showOperationSearch = !self.showOperationSearch;
        }
        self.toggleOperationParamTypes = function(){
            self.showOperationParamTypes = !self.showOperationParamTypes;
            LocalStorageService.set("showOperationParamTypes", self.showOperationParamTypes);
        }
    }
});