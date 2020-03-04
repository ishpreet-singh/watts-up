// Node Controller for all functions of a Node
var msg_count = 0

function readDataFromNode(path, callback = () => { }, cbObj = {}) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.on("value", (snapshot) => {
            snapshotObj = JSON.parse(JSON.stringify(snapshot.val()))
            for (key in cbObj) {
                if(cbObj[key]) {
                    snapshotObj[key] = cbObj[key]
                }
            }
            callback(snapshotObj);
            // return snapshot.val();
        });
    } else {
        console.log("Path Doesn't Exist !!");
    }
}


function writeDataToNode(path, data) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.set(data);
    } else {
        console.log("Path Doen't Exist !!");
    }
}


function deleteDataFromNode(path) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.remove()
    } else {
        console.log("Path Doen't Exist !!")
    }
}

function readAllMsgsBySender(msgObj) {
    sender = msgObj["senderName"]
    for (key in msgObj) {
        if (key.includes("msg_id_")) {
            msgId = key
            message = msgObj[key]
            msgSender = message["sender"]
            if (message[sender] == "true") {
                console.log(msgId, ":", msgSender, ":", message.msg)
            } else {
                console.log(msgId, ":", msgSender, ":", "Message Deleted")
                // console.log("Msg Deleted")
            }
        }
    }
}

function getAllUsers() {
    
}

function readUserMsgs(sender) {
    senderPath = "/group_chat/"
    callbackObj = {
        "senderName": sender
    }
    console.log("Sender Name: ", sender)
    readDataFromNode(senderPath, readAllMsgsBySender, callbackObj)
}

function addNewMsg(msg, sender) {
    senderPath = "/group_chat/"
    let msg_Id = "msg_id_022"
    // users = getAllUsers()
    
    // data = {
    //     msg_Id: {
    //         "msg": msg,
    //         "sender": sender,
    //         "user_01": "true",
    //         "user_02": "true",
    //         "user_03": "true",
    //         "user_04": "true"
    //     }
    // }
}
