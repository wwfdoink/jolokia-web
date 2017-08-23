angular.module('jolokiaWeb').filter('beanTree', function() {
 
    function extractBean(beanPath){
        // beanPath: type=Valve,host=localhost,context=/,name=NonLoginAuthenticator
        var result = [];
        var parts = beanPath.split(',');
        parts.forEach(function(p){
            var subPart = p.split("=");
            result.push(subPart);
        });
        // arr: [["type","Valve"],["host","localhost"],....]
        return result;
    }
    
    function getTypeName(str){
        if (str === "[J") { return "long[]"; }
        else if (str.startsWith("[L") && str.endsWith(";")) {
            return str.replace(/^\[L/, "").replace(/;$/,"") + "[]";
        }
        return str;
    }

    function sortTree(arr) {
        arr = _.sortBy(arr, 'name');
        arr.forEach(function(item){
            item.children = sortTree(item.children);
        });
        return arr;
    }

    function fillAll(node, bean){
        node = fillBasicInfo(node,bean);
        node = fillAttributes(node,bean);
        node = fillOperations(node,bean);
        return node;
    }

    function fillBasicInfo(node, bean){
        if (bean.hasOwnProperty("class")) {
            node.class = bean.class;
            node.desc = bean.desc;
        }
        return node;
    }

    function fillAttributes(node, bean){
        if (bean.hasOwnProperty("attr")) {
            node.attr = [];

            for (var attrKey in bean.attr){
                node.attr.push({
                    name: attrKey,
                    rw: bean.attr[attrKey].rw,
                    desc: bean.attr[attrKey].desc,
                    type: getTypeName(bean.attr[attrKey].type),
                    typeOrig: bean.attr[attrKey].type
                });
            }
        }
        return node;
    }

    function fillOperations(node, bean){
        if (bean.hasOwnProperty("op")) {
            node.op = [];
            for (var opName in bean.op){
                //it's an array if the function has multiple param variants
                if (!Array.isArray(bean.op[opName])) {
                    bean.op[opName] = [bean.op[opName]];
                }
                bean.op[opName].forEach(function(fnc){
                    var operation = {
                        name: opName,
                        args: [],
                    }
                    operation.ret = getTypeName(fnc.ret);
                    operation.desc = fnc.desc;
                    fnc.args.forEach(function(argument){
                        operation.args.push({
                            name: argument.name,
                            type: getTypeName(argument.type),
                            typeOrig: argument.type,
                        });									
                    });
                    node.op.push(operation);									
                });
            }
        }
        return node;
    }


    function getDomainNode(arr, text){
        return _.findWhere(arr, {name: text});
    }

    return function (responseData) {
        if (!(responseData instanceof Object)) {
            return undefined;
        }
        var result = [];

        // Iterate over the domains, sort the domains case insesensitive using localCompare
        Object.keys(responseData).sort(function (a, b) { return a.localeCompare(b); }).forEach(function(key){
            var domainNode = {
                id: key,
                name: key,
                children: []
            }
            result.push(domainNode);

            // Iterate over the MBean paths
            Object.keys(responseData[key]).forEach(function(path){
                var bean = responseData[key][path];
                bean.pathArr = extractBean(path);

                // Iterate over the path fragments
                var currentPathNode = domainNode;
                var pathId = domainNode.id + ":";
                for (var i=0; i<bean.pathArr.length; i++) {
                    pathId += ((i==0) ? "" : ",") + bean.pathArr[i].join("=");

                    var existingNode = _.findWhere(currentPathNode.children, {id: pathId});
                    if (existingNode) {
                        // already registered path node
                        currentPathNode = existingNode;

                        // If this is the last path segment then this is an MBean with a child MBean in the tree
                        if (bean.pathArr.length-1 == i){
                            currentPathNode = fillAll(currentPathNode, bean);
                        }
                    } else {
                        // create a new node
                        var insertNode = {
                            id: pathId,
                            name: bean.pathArr[i][1], // eg: ["type","Valve"]
                            children: []
                        }
                        // If this is the last path segment
                        if (bean.pathArr.length-1 == i){
                            insertNode = fillAll(insertNode, bean);
                        }

                        currentPathNode.children.push(insertNode);
                        currentPathNode = insertNode;
                    }
                }
            });
        });

        // sort the tree, domain level beans already sorted so don't worry about them
        result.forEach(function(node){
            node.children = sortTree(node.children);
        });
                    
        return result;
    };
});
