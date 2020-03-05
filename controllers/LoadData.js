
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
        // readUserMsgs("user_04");
        addNewMsg("Hello", "Shikari")
        deleteMessageForSingleUser("msg_id_003", "user_03")
        deleteMessageForAllUsers("msg_id_003", "user_03")
        // readUserMsgs("user_03");
    });
    
    
}

loadData();