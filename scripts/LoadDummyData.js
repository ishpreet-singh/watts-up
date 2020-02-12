
console.log("Billa Paaji Changgeeee");

// var firebaseConfig = {
//     apiKey: "AIzaSyDGDkc9NSnajB0PYFERTC18VXU5Lx88JMU",
//     authDomain: "fir-test-9797d.firebaseapp.com",
//     databaseURL: "https://fir-test-9797d.firebaseio.com",
//     projectId: "fir-test-9797d",
//     storageBucket: "fir-test-9797d.appspot.com",
//     messagingSenderId: "721598873598",
//     appId: "1:721598873598:web:c5bd7f679e30fd54d10aaf",
//     measurementId: "G-XQMYR64MJB"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// firebase.analytics();

// var userId = firebase.auth().currentUser;

// function writeUserData() {
//     console.log("I m called");
//     firebase.database().ref('/username/').set({
//         firstname: "ish",
//         middlename: "preet"
//     });
// }

// // writeUserData();

// function readData() {
//     console.log("I m called");
//     let ref = firebase.database().ref("/group chat/");
//     ref.on("value", (snapshot) => {
//         console.log("Snalshot value: ", snapshot.val());
//         var keys = [];
//         for(var k in snapshot.val()) keys.push(k);
//         console.log("Keys: ", keys);
//     });
//     // ref.on("msg_id_01", function (snapshot) {
//     //     console.log(snapshot.val());
//     // }, function (errorObject) {
//     //     // console.log("The read failed: " + errorObject.code);
//     // });
//     console.log("ref: ", ref);
//     // debugger;
// }

// readData();