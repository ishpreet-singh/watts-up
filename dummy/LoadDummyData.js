
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

function deleteDataFromNode(path) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.remove();
    } else {
        console.log("Path Doen't Exist !!");
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


function readDataFromNode(path) {
    nodePath = firebase.database().ref(path);
    if (nodePath) {
        nodePath.on("value", (snapshot) => {
            // console.log("Snalshot value: ", snapshot.val());
            // var keys = [];
            // for (var k in snapshot.val()) keys.push(k);
            // console.log("Keys: ", keys);
            return snapshot.val();
        });
    } else {
        console.log("Path Doen't Exist !!");
    }
}

function writeDummyData() {

    let dummyJSON = "dummy/dummy.json";
    let rootNode = "/";
    $.getJSON(dummyJSON, function (data) {
        writeDataToNode(rootNode, data);
    });
}

function main() {
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();


    let rootNode = "/";
    deleteDataFromNode(rootNode);
    writeDummyData();
    // readData();
}

main();
