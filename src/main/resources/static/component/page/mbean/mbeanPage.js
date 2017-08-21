angular.module("myApp").component('mbeanPage', {
    templateUrl: '/static/component/page/mbean/mbeanPage.html',
    bindings: {
    },
    controllerAs: "$ctrl",
    controller: function($scope, JolokiaService, $filter) {
        var self = this;

        var origTree = [];
        self.$onInit = function () {
            self.tree = [];
            self.loading = true;
            self.currentNode = {};
            self.searchTree = null;

            $scope.$watch(function() { return self.searchTree; }, function(text) {
                self.tree = $filter('beanTreeSearch')(origTree, text);
                if (text && text.length > 0) {
                    self.toggleTree(true);
                } else {
                    self.toggleTree(false);
                }
            });
            $scope.$watch(function() { return self.currentNode; }, function() {
                self.getBeanValue();
            }, false);
        };

        JolokiaService.getMbeanTree().then(function(res){
            self.tree = $filter('beanTree')(res.data.value);
            origTree = angular.copy(self.tree);
            self.loading = false;
        },function(err){
            if (_.isObject(err.data)) { self.error = err.data.error; }
            else { self.error = err.data; }
            self.loading = false;
        });

        self.getBeanValue = function(){
            self.error = null;
            if (angular.isObject(self.currentNode)) {
                if (!self.currentNode.class) {
                    return;
                }
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
                    if (_.isObject(err.data)) { self.error = err.data.error; }
                    else { self.error = err.data; }
                }).finally(function(){
                    self.beanLoading = false;
                });
            }
        }

        self.toggleTree = function(status){
            console.log(status);
            setTreeOpenStatus(self.tree, status);
        };

        var setTreeOpenStatus = function(item, status){
            for(var i=0;i<item.length;i++) {
                item[i].isOpen = status;
                if (item[i].children && item[i].children.length > 0) {
                    setTreeOpenStatus(item[i].children, status);
                }
            }
        }
    }
});