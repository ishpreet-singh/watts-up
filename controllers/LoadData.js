
function loadData() {
    
    let path = "dummy/dummy.json";
    let rootNode = "/";
    let user = "user_04"
    $.getJSON(path, function (data) {
        // console.log("Path: ", path)
        writeDataToNode(rootNode, data);
        // readDataFromNode(rootNode);
        // readUserMsgs(user);
    });

    $.getJSON(path, function (data) {
        readUserMsgs(user);
    });
    
    
}

loadData();