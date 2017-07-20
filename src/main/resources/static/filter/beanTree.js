angular.module('myApp').filter('beanTree', function() {
 
    function keySplitter(text){
        // name=mapped,type=BufferPool
        var result = { /*name:, type:*/ };
        var parts = text.split(',');
        parts.forEach(function(p){
            var subPart = p.split("=");
            if (subPart[0] == 'name') {
                result.name = subPart[1];
            } else if (subPart[0] == 'type') {
                result.type = subPart[1];
            } else {
                throw "invalid subPart";
            }
        });
        return result;
    }
    
    function joinIf(a,b){
        if (a.length < 1) return b;
        if (b.length < 1) return a;
        return a+":"+b;
    }

    function traverse(x, target, path) {
        if ((typeof x === 'object') && (x !== null)) {
            traverseObject(x, target, path)
        } else {
        }
    }

    function getTypeName(str){
        if (str === "[J") { return "long[]"; }
        else if (str.startsWith("[L") && str.endsWith(";")) {
            return str.replace(/^\[L/, "").replace(/;$/,"") + "[]";
        }
        return str;
    }

    var parentCache = {
    }
    function traverseObject (obj, target, path) {
        for (var key in obj) {
            if (key != 'attr' && key != 'op' && obj.hasOwnProperty(key)) {
                var id = joinIf(path,key);
                var node = {
                    name: key,
                    id: id,
                    children: []
                }
                
                if (obj[key].hasOwnProperty("class")) {
                    // Put types to a parent node like jConsole does
                    // Jolokia sends us like this: name=mapped,type=BufferPool
                    var splittedObj = keySplitter(key);
                    
                    if (splittedObj.name) { node.name = splittedObj.name; }
                    else { node.name = splittedObj.type; }
                    if ((typeof splittedObj.type != "undefined") && (splittedObj.name)) {
                        var parentNode = {
                            name: splittedObj.type,
                            id: id,
                            children: []
                        };
                        
                        if (typeof parentCache[splittedObj.type] == "undefined") {
                            //create a dummy parent node
                            target.push(parentNode);
                            parentCache[splittedObj.type] = parentNode;
                        }
                        //parentCache[splittedObj.type].children;
                    }
                        
                    node['class'] = obj[key]['class'];
                    //if (splittedObj.name) {
                        node.id = id;
                    //} else {
                    //    node.id = joinIf(id,splittedObj.type);
                    //}
                    node.desc = obj[key].desc;
                    
                    if (obj[key].hasOwnProperty("attr")) {
                        node.attr = [];
                        for (var attrKey in obj[key].attr){
                            node.attr.push({
                                name: attrKey,
                                rw: obj[key].attr[attrKey].rw,
                                desc: obj[key].attr[attrKey].desc,
                                type: getTypeName(obj[key].attr[attrKey].type),
                                typeOrig: obj[key].attr[attrKey].type
                            });
                        }
                    }
                    
                    if (obj[key].hasOwnProperty("op")) {
                        node.op = [];
                        for (var opName in obj[key].op){
                            //it's an array if the function has multiple param variants
                            if (!Array.isArray(obj[key].op[opName])) {
                                obj[key].op[opName] = [obj[key].op[opName]];
                            }
                            obj[key].op[opName].forEach(function(fnc){
                                var operationNode = {
                                    name: opName,
                                    args: [],
                                }
                                operationNode.ret = getTypeName(fnc.ret);
                                operationNode.desc = fnc.desc;
                                fnc.args.forEach(function(argument){
                                    operationNode.args.push({
                                        name: argument.name,
                                        type: getTypeName(argument.type),
                                        typeOrig: argument.type,
                                    });									
                                });
                                node.op.push(operationNode);									
                            });
                            
                        }
                    }
                    
                    if (!(splittedObj.name)) {
                        target.push(node);
                    } else {
                        parentCache[splittedObj.type].children.push(node);
                    }

                } else {
                    target.push(node);
                    traverse(obj[key],node.children, joinIf(path,key))
                }
            }
        }
    }

    return function (obj) {
        if (!(obj instanceof Object)) {
            return undefined;
        }
        parentCache = {}
        var result = [];
        traverse(obj, result, '');
        return result;
    };
});