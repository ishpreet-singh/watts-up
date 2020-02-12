
var firebaseConfig = {
    apiKey: "AIzaSyAZiVTYeuGPk_m4w_XmR2DN-8c46QnzNtQ",
    authDomain: "wattsup-3253d.firebaseapp.com",
    databaseURL: "https://wattsup-3253d.firebaseio.com",
    projectId: "wattsup-3253d",
    storageBucket: "wattsup-3253d.appspot.com",
    messagingSenderId: "961288482160",
    appId: "1:961288482160:web:77b8153b19d2b87d8233b5",
    measurementId: "G-H0G03XJQN3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function writeUserData() {
    console.log("I m called");

    DummyData = ""

    firebase.database().ref('/username/').set({
        firstname: "ish",
        middlename: "preet"
    });
}

function deleteDataFromNode(path) {
    nodePath = firebase.database().ref(path);
    if(nodePath) {
        nodePath.remove();
    } else {
        console.log("Path Doen't Exist !!");
    }
}

function writeDataToNode(path, data) {
    nodePath = firebase.database().ref(path);
    if(nodePath) {
        nodePath.set(data);
    } else {
        console.log("Path Doen't Exist !!");
    }
}

function writeDummyData() {

    console.log("Writing Dummy Data *_*\n");

    // Deleting 
    // firebase.database().ref('/').remove();

    var dummyJSON = "dummy/dummy.json"
    $.getJSON(dummyJSON, function (data) {
        writeDataToNode(data);
    });
}

// writeDummyData()
// deleteDataFromNode("/group_chat/users/")

// writeUserData();

function readData() {
    console.log("I m called");
    let ref = firebase.database().ref("/group chat/");
    ref.on("value", (snapshot) => {
        console.log("Snalshot value: ", snapshot.val());
        var keys = [];
        for (var k in snapshot.val()) keys.push(k);
        console.log("Keys: ", keys);
    });
    // ref.on("msg_id_01", function (snapshot) {
    //     console.log(snapshot.val());
    // }, function (errorObject) {
    //     // console.log("The read failed: " + errorObject.code);
    // });
    console.log("ref: ", ref);
}

// readData();