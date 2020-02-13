
function initialise() {

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    let rootNode = "/";
    // Hard Delete
    deleteDataFromNode(rootNode);

}

initialise();