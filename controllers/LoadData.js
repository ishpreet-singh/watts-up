
function loadData() {
    
    let path = "dummy/dummy.json";
    let rootNode = "/";
    $.getJSON(path, function (data) {
        writeDataToNode(rootNode, data);
    });
    
}

loadData();