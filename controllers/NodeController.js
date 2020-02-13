// Node Controller for all functions of a Node

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
        nodePath.remove();
    } else {
        console.log("Path Doen't Exist !!");
    }
}