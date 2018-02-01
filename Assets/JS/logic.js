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
//get the current minute on initial load of page
var minuteonload = moment().get('minute');
var currentminute;
//add the flipclock
var clock = $('.clock').FlipClock({
  clockFace: 'TwentyFourHourClock',
  callbacks: {
    //every time the flip clock changes (flips)
    interval: function() {
      //get the current minute
      currentminute = moment().get('minute');

      //update now variable
      now = moment();
      //if current minute is greater than the minute on load of the page
      if (currentminute > minuteonload) {
        //update minute on load variable so it will conitinuosly update
        minuteonload++;
        //populate the board
        populate();
        //when new hour is hit
      } else if (currentminute == 00) {

        minuteonload = 0;
        populate();
      }
    }
  }
});




//determine the current time and store as a variable
var now = moment();



//determine the current time and store as a variable
var now = moment();



//create trains list in firebase
database.ref().child("Trains");


//on click event for submitting new trains
$("#addtrainbtn").on("click", function(event) {
  event.preventDefault();
  var trainname = $("#train-name").val().trim();
  var traindestination = $("#train-destination").val().trim();
  var trainfirsttime = $("#train-firsttime").val().trim();
  var trainfrequency = $("#train-freq").val().trim();
  //validation
  function validate() {
    if ((trainname == "") || (traindestination == "") || (trainfirsttime == "") || (trainfrequency == "")) {
      $("#addtrainbtn").attr("data-target", "#invalid");
      return false;
      //could not find out how to validate the traintime field because of the : character
    } else {
      $("#addtrainbtn").attr("data-target", "#success");
      return true;
    }
  }

  validate();

  //storing new trains as objects
  var newtrain = {
    name: trainname,
    destination: traindestination,
    time: trainfirsttime,
    frequency: trainfrequency
  }

  //pushing new trains to firebase
  if (validate() == true) {
    database.ref("Trains").push(newtrain);
    //emptying input fields
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-firsttime").val("");
    $("#train-freq").val("");
  }


});

//create a function for populating the billboard from the firebase
function populate() {
  //clear the current board
  $("#arrivalsdisplay").empty();

  //Pull all the trains back from firebase
  database.ref("Trains").on("child_added", function(childSnapshot, prevChildKey) {
    //pull the trains' values back from firebase (name, time, destination, frequency)
    var tName = childSnapshot.val().name;
    var tdestination = childSnapshot.val().destination;
    var tfreq = childSnapshot.val().frequency;
    var tTime = childSnapshot.val().time;


    //parse the frequency so it is returned as a number
    var newfreq = JSON.parse(tfreq);


    //if statement to determine if frequency needs to be added to the train time based on "now" variable, which is determined using moment
    //tTime.format() or .add() returns "not a function" if var tTime = moment(tTime, "HH:mm"), so we are stuck with the sloppy code below
    if (now == moment(tTime, "HH:mm") || now > moment(tTime, "HH:mm")) {
      //while the train time is less than the current time, add the frequency
      while (now > moment(tTime, "HH:mm")) {
        tTime = moment(tTime, "HH:mm").add(newfreq, "minutes");

      };
      //if the current train time is in the future (determined by >now), format as is
    } else {
      tTime = moment(tTime, "HH:mm");

    };
    //format the new time to push to the DOM
    var newTime = moment(tTime, "HH:mm").format("hh:mm A");
    //determine how far away train is (could not figure out through the moment docs how to make it in minutes only. Those docs are horrible)
    var minutesaway = moment(newTime, "hh:mm A").fromNow();
    // console.log(minutesaway);

    // Add each train's data into the table
    $("#arrivalsbillboard > tbody").append("<tr><td>" + tName + "</td><td>" + tdestination + "</td><td>" +
      tfreq + " Minutes </td><td>" + newTime + "</td><td>" + minutesaway + "</tr>");
  });

};


//call the populate function
populate();
