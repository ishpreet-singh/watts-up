// This program is created by Ishpreet Singh

const fs = require('fs');
const firebase = require('firebase');
let dataJSON = fs.readFileSync('./scripts/data.json')
let firebaseConfig = fs.readFileSync('./scripts/config.json')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//------------------------ FIREBASE METHODS ------------------------

/**
 * @function initialise - Function to initialise a firebase app
 */
function initialise() {
    firebase.initializeApp(JSON.parse(firebaseConfig));
}


//---------------------- NODE SPECIFIC METHODS ----------------------

/**
 * @function writeDataToNode  Function to write data to node
 * @param path - path of node
 * @param data - data to be added to node 
 */
function writeDataToNode(path, data) {
    let nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.set(data);
    } else {
        console.log("Path Doen't Exist !!");
    }
}


/**
 * @function updateDataToNode - Function to update data of node
 * @param path - path of node
 * @param data - data to be added to node 
 */
function updateDataToNode(path, data) {
    let nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.update(data);
    } else {
        console.log("Path Doen't Exist !!");
    }
}


/**
 * @function deleteDataFromNode - Function to delete data from node
 * @param path - path of node
 */
function deleteDataFromNode(path) {
    let nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.remove();
    } else {
        console.log("Path Doen't Exist !!")
    }
}


//------------------------- USER METHODS -------------------------

/**
 * @function readAllMsgsBySender - Function to read all meseages by sender
 * @param msgObj - the message object which contains sender's name
 */
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
            }
        }
    }
}


/**
 * @function getAllUsers Function to read all messages by sender
 * @param msgObj - the message object which contains sender's name
 */
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


/**
 * @function getNewMessageId - Function to retrive new message Id
 * @param data - data object
 */
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
    if (msgId < 10) {
        messageId += "00"
    } else if (msgId < 100) {
        messageId += "0"
    }
    messageId += String(msgId)
    return messageId
}


/**
 * @function addNewMsg - Function to add a new message
 * @param msg - The message to be added
 * @param sender - sender's name
 */
function addNewMsg(msg, sender) {
    let path = "/group_chat/"
    let nodePath = firebase.database().ref(path);

    const callback = data => {
        let userData = data.val()
        let users = getAllUsers(userData);
        let messageId = getNewMessageId(userData);
        let msgDetails = {}

        msgDetails.msg = msg
        msgDetails.sender = sender

        for (let user in users) {
            msgDetails[users[user]] = "true"
        }

        let dataObj = {}
        dataObj[messageId] = msgDetails;

        updateDataToNode(path, dataObj)

    };

    nodePath.once('value', callback)
}


/**
 * @function deleteMessageForSingleUser - Function to delete message for a single user
 * @param msgId - The message to be added
 * @param sender - sender's name
 * @param cb - callback function
 */
function deleteMessageForSingleUser(msgId, sender, cb = () => {}) {
    let path = "/group_chat/" + msgId + "/"
    let nodePath = firebase.database().ref(path);

    const callback = data => {

        let msgDetails = JSON.parse(JSON.stringify(data))
        msgDetails[sender] = "false"
        console.log("\nMessage deleted successful!")
        updateDataToNode(path, msgDetails)
        cb()
    };

    nodePath.once('value', callback)
}


/**
 * @function deleteMessageForAllUsers - Function to delete the message for all users in the chat group
 * @param msgId - The message to be added
 * @sender - sender's name
 * @cb - callback function
 */
function deleteMessageForAllUsers(msgId, sender, cb = () => {}) {
    let path = "/group_chat/"
    let nodePath = firebase.database().ref(path);

    const callback = data => {

        let userData = data.val()
        let users = getAllUsers(userData);
        let msgDetails = JSON.parse(JSON.stringify(userData))
        if (msgDetails[msgId].sender && sender == msgDetails[msgId].sender) {
            for (let user in users) {
                let username = users[user]
                msgDetails[msgId][username] = "false"
            }
            console.log("\nMessage deleted successful!")
        } else {
            console.log("\nMessage deletion failed!")
        }
        updateDataToNode(path, msgDetails)
        cb()

    };

    nodePath.once('value', callback)
}


//-------------------------- MENU METHODS --------------------------

/**
 * @function displayChatMenu - Function to display menu 
 */
function displayChatMenu() {
    console.log("\n---------------------------------------------")
    console.log("\n1. View user messages")
    console.log("\n2. Compose new message")
    console.log("\n3. Delete message")
    console.log("\n4. Delete message for all")
    console.log("\n5. Login as another user")
    console.log("\n0. Logout Chat Room")
    console.log("\n---------------------------------------------\n")
}


/**
 * @function userMenu - Function to display all choices
 * @param user 
 */
function userMenu(user) {
    console.log("\n---------------------------------------------")
    console.log("\nLogged in as: " + user)
    displayChatMenu(user)

    rl.question("\nEnter your choice: ", (choice) => {

        choice = Number(choice)
        console.log("\nLogged in as: ", user)

        if (choice == 1) {

            console.log("Chat logs for: ", user, "\n")
            let nodePath = firebase.database().ref("/group_chat/");
            nodePath.once("value", (snapshot) => {
                snapshotObj = JSON.parse(JSON.stringify(snapshot.val()))
                snapshotObj["senderName"] = user;
                readAllMsgsBySender(snapshotObj);
                userMenu(user);
            });

        } else if (choice == 2) {

            rl.question("Enter your new message: ", (msg) => {
                addNewMsg(msg, user);
                console.log("\nMessage sent successful!")
                userMenu(user)
            })

        } else if (choice == 3) {

            rl.question("Enter message id to be deleted for " + user + " : ", (msgId) => {
                deleteMessageForSingleUser(msgId, user, () => userMenu(user));
            })

        } else if (choice == 4) {

            rl.question("Enter message id to be deleted for all users: ", (msgId) => {
                deleteMessageForAllUsers(msgId, user, () =>  userMenu(user))
            })

        } else if (choice == 5) {
            console.log("Bye " + user + "!")
            login()
        } else if (choice == 0) {
            console.log(console.log("Bye " + user + "!"))
            process.exit();
        }

    });
}


//-------------------------- CHAT SPECIFIC METHODS --------------------------


/**
 * @function initialiseChatRoom - Function to initialise a chat room
 */
function initialiseChatRoom() {
    initialise();
    deleteDataFromNode("/");
    writeDataToNode("/", JSON.parse(dataJSON));
    console.log("\n------------------- WATTS UP -------------------\n")
}


/**
 * @function login - Function to login in a chat room
 */
function login() {

    let np = firebase.database().ref("/group_chat/");
    np.once("value", (snapshot) => {

        let users = getAllUsers(snapshot.val())

        console.log("\nMembers in the chat:\n", users)

        rl.question("\nEnter the name of user: ", (username) => {
            userMenu(username)
        })
    });


}


/**
 * @function startChat - Function to start a chat in char room
 */
function startChat() {
    initialiseChatRoom()
    login()
}


// Starting chat room
startChat()
