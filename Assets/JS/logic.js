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
  var now= moment().format("HH:mm A");


  console.log("Current Time: " + now);
  database.ref("Trains").on("child_added", function(childSnapshot, prevChildKey){


    var tName = childSnapshot.val().name;
    var tdestination = childSnapshot.val().destination;
    var tfreq = childSnapshot.val().frequency;
    var tTime = childSnapshot.val().time;

    var newfreq = JSON.parse(tfreq);

    //-----------------------------------------------------------------------

    // var newTime = moment(tTime, "HH:mm").format("hh:mm A");
    // var testtime = moment(tTime, "HH:mm").format("HH:mm");
    // console.log("Test Military Time: " + testtime);
    // var minutesaway = moment(newTime, "hh:mm A").fromNow();
    //------------------------------------------------------------------------
    // var a = moment().format("HH:mm");
    // var b = moment(tTime, "HH:mm");
    // var minutesto = a.to(b)

    // var now = moment();
    // var newnow = moment(now, "HH:mm");
    // var testnewtime = moment(tTime, "HH:mm");
    //
    // var testaway = newnow.to(testnewtime);
    //
    // console.log("New Now: " + newnow);
    // console.log("Train Time " + testnewtime);
    // console.log("Test time to " + testaway);
    // var testaway = now.to(newTime);
    // console.log(testaway);

    //options---> find out how to set the new time in firebase of the specific child once the time changes
          //----> Delete the train once the time is up, add new train with all the same values except updated time (I like this one better I think)
          //-------------------------------> How do we remove this specific train?
          //---------------------------------------->fuck if I know. GOOD. LORD. Are the firebase Docs unhelpful. Half the shit on there comes back as "this is not a function"
    console.log("First Train Time: " + moment(tTime, "HH:mm").format("HH:mm A"));
    if (now == moment(tTime, "HH:mm").format("HH:mm A")  || now > moment(tTime, "HH:mm").format("HH:mm A")){
        var newTime = moment(tTime, "HH:mm A").add(newfreq, "minutes").format("hh:mm A");
        console.log ("First Train Time: " + tTime);
        console.log ("Time with Frequency Added: " + newTime);
        var newtrain = {
          name: tName,
          destination: tdestination,
          frequency: tfreq,
          time : newTime
        };
        console.log(newtrain);
        // database.ref("Trains").push(newtrain);



      } else {
        newTime = moment(tTime, "HH:mm").format("hh:mm A");
      };


      var minutesaway = moment(newTime, "HH:mm A").fromNow();


    // Add each train's data into the table
    $("#arrivalsbillboard > tbody").append("<tr><td>" + tName + "</td><td>" + tdestination + "</td><td>" +
    tfreq + "</td><td>" + newTime + "</td><td>" + minutesaway + "</tr>");
  });



};




populate();
