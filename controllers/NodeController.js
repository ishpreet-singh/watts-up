// Node Controller for all functions of a Node
var msg_count = 0

function readDataFromNode(path, callback = () => { }, cbObj = {}) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.on("value", (snapshot) => {
            snapshotObj = JSON.parse(JSON.stringify(snapshot.val()))
            for (key in cbObj) {
                if (cbObj[key]) {
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

function updateDataToNode(path, data) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.update(data);
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

function getAllUsers(data = {}) {
    let users = []
    if (data["users"]) {
        usersData = data["users"]
        for (userId in usersData) {
            let user = usersData[userId]
            if (user["name"]) {
                users.push(user["name"])
            }
        }
    }

    return users

}

function getNewMessageId(data = {}) {
    let msgIds = [];
    let maxId = 0
    for (key in data) {
        if (key.includes("msg_id_")) {
            num = Number(key.replace('msg_id_', ''));
            if (num > maxId) {
                maxId = num
            }
            msgIds.push(num)
        }
    }
    let msgId = maxId + 1
    let messageId = "msg_id_"
    if (msgId < 100) {
        messageId += "0"
    } else if (msgId < 10) {
        messageId += "00"
    }
    messageId += String(msgId)
    return messageId
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
    path = "/group_chat/"
    nodePath = firebase.database().ref(path);

    const callback = data => {
        let userData = data.val()
        let users = getAllUsers(userData);
        let messageId = getNewMessageId(userData);
        let msgDetails = {}

        msgDetails.msg = msg
        msgDetails.sender = sender

        console.log("Users: ", users)

        for (let user in users) {
            msgDetails[users[user]] = "true"
        }

        let dataObj = {}
        dataObj[messageId] = msgDetails;

        updateDataToNode(path, dataObj)

    };

    nodePath.once('value', callback)
}


function deleteMessageForSingleUser(msgId, sender) {
    path = "/group_chat/" + msgId + "/"
    nodePath = firebase.database().ref(path);

    const callback = data => {

        let msgDetails = JSON.parse(JSON.stringify(data))
        msgDetails[sender] = "false"
        updateDataToNode(path, msgDetails)

    };

    nodePath.once('value', callback)
}


function deleteMessageForAllUsers(msgId, sender) {
    path = "/group_chat/"
    nodePath = firebase.database().ref(path);

    const callback = data => {

        debugger;
        let userData = data.val()
        let users = getAllUsers(userData);
        let msgDetails = JSON.parse(JSON.stringify(userData))
        console.log("Users: ", users)
        if(msgDetails[msgId].sender && sender == msgDetails[msgId].sender) {
            for (let user in users) {
                let username = users[user]
                msgDetails[msgId][username] = "false"
            }
        }
        updateDataToNode(path, msgDetails)

    };

    nodePath.once('value', callback)
}
