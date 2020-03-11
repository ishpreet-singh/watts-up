// This program is created by Ishpreet Singh

const fs = require('fs');
const firebase = require('firebase');
let dummyJSON = fs.readFileSync('./dummy/dummy.json')
let firebaseConfig = fs.readFileSync('./scripts/config.json')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


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
        console.log("Writing Data to Node Successful!");
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
        nodePath.remove();
        console.log("Deleting Node Successful!");
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

function getUserName() {
    readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }).question("Enter the name of user you want to extract chat:", (user) => {
        console.log(user, " msgs are:\n")
        readUserMsgs(user);
    })
}

function addNewMsgForUser() {
    // let userName = "";
    // let msg = "";
    rl.question("\nEnter username:", (username) => {
        // userName = username;
        rl.question("\nEnter msg:", (msg) => {
            addNewMsg(msg, username)
        })
    })
}

function initialise() {

    firebase.initializeApp(JSON.parse(firebaseConfig));
    console.log("Initializing Firebase App")
}


function run() {
    // console.log(`Hi ${name}!`)
    console.log("firebaseConfig: ", JSON.parse(firebaseConfig))
    
    initialise();
    
    deleteDataFromNode("/");

    writeDataToNode("/", JSON.parse(dummyJSON));

    let users = getAllUsers(JSON.parse(dummyJSON)["group_chat"])

    console.log("Users in Chat Room\n", users)

    // getUserName();

    addNewMsgForUser();

    // readUserMsgs("user_02");

    // readline.close()
}

run()

