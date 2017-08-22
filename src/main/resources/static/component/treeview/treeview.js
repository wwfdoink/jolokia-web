angular.module("jolokiaWeb").component('treeview', {
    templateUrl: function(jsPath) { 
        return jsPath.component + '/treeview/treeview.html';
    },
    bindings: {
    	treeModel: "=",
    	nodeId: "@",
    	nodeLabel: "@",
    	nodeChildren: "@",
    	currentNode: "="
    },
    controllerAs: '$ctrl',
    controller: function() {
        var self = this;
        self.$onInit = function(){
            if (self.treeModel) {
                self.treeModel = self.treeModel || {};
            }
        }

        self.selectNodeLabel = function(node) {
            if(self.currentNode && self.currentNode.selected ) {
                self.currentNode.selected = undefined;
            }
            //set highlight to selected node
            node.selected = 'selected';
            //set currentNode
            self.currentNode = node;
        }

        self.selectNodeHead = function(selectedNode){
            selectedNode.isOpen = !selectedNode.isOpen;
        };
    }
});
