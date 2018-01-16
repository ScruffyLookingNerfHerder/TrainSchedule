// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCOX4d4BxeC2MAfRCsVGyVd1sFt9JMlKQY",
    authDomain: "make-it-train.firebaseapp.com",
    databaseURL: "https://make-it-train.firebaseio.com",
    projectId: "make-it-train",
    storageBucket: "make-it-train.appspot.com",
    messagingSenderId: "723078703555"
  };
  firebase.initializeApp(config);
var database = firebase.database();

//create trains list in firebase
database.ref().child("Trains");
//on click event for submitting new trains
$("#addtrainbtn").on("click", function(event){
  event.preventDefault();
  var trainname = $("#train-name").val().trim();
  var traindestination = $("#train-destination").val().trim();
  var trainfirsttime = $("#train-firsttime").val().trim();
  var trainfrequency = $("#train-freq").val().trim();

//storing new trains as objects
var newtrain = {
  name : trainname,
  destination : traindestination,
  time : trainfirsttime,
  frequency : trainfrequency
}



//pushing new trains to firebase
database.ref("Trains").push(newtrain);

//emptying input fields
$("#train-name").val("");
$("#train-destination").val("");
$("#train-firsttime").val("");
$("#-train-freq").val("");


});

//create a function for populating the billboard from the firebase
function populate (){
  database.ref("Trains").on("child_added", function(childSnapshot, prevChildKey){


    var tName = childSnapshot.val().name;
    var tdestination = childSnapshot.val().destination;
    var tfreq = childSnapshot.val().frequency;
    var tTime = childSnapshot.val().time;

    var newfreq = JSON.parse(tfreq);
    // var newtime = JSON.parse(tTime);

    var newTime = moment(tTime, "HH:mm").format("hh:mm A");

    var minutesaway = moment(newTime).diff(moment(), "minutes");
    console.log(minutesaway);

    //var now= moment();
    //if (now > newTime){
        //newTime = newTime +
  //}

    // Add each train's data into the table
    $("#arrivalsbillboard > tbody").append("<tr><td>" + tName + "</td><td>" + tdestination + "</td><td>" +
    tfreq + "</td><td>" + newTime + "</td></tr>");
  });

};

populate();
