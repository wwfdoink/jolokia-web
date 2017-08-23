angular.module('jolokiaWeb').filter('beanTreeSearch', function() {

    function isMatching(text, searchText){
        return text.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
    }

    function checkNode(parent, node, searchText) {
        var matching = isMatching(node.id, searchText);
        var cNode = angular.copy(node);
        cNode.children = [];

        // Group match, we add all children
        if (matching && node.children.length > 0) {
            cNode.children = angular.copy(node.children);
        } else {
            for(var i=0;i<node.children.length;i++) {
                if (checkNode(cNode.children,node.children[i],searchText)) {
                    matching = true;
                }
            }
        }

        if (matching){
            parent.push(cNode);
        }
        return matching;
    }

    return function (tree, searchText) {
        if (!(tree instanceof Object)) {
            return undefined;
        }
        if (searchText == null || searchText.length < 1) {
            return tree;
        }
        var result = [];
        tree.forEach(function(child){
            checkNode(result, child, searchText);
        });
        return result;
    };
});
