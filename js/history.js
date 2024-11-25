let firebaseConfig = {
    apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
    authDomain: "construction-industry-wi-70272.firebaseapp.com",
    databaseURL: "https://construction-industry-wi-70272-default-rtdb.firebaseio.com",
    projectId: "construction-industry-wi-70272",
    storageBucket: "construction-industry-wi-70272.appspot.com",
    messagingSenderId: "494097993743",
    appId: "1:494097993743:web:85219ddf87e2e9ae75d37a"
};
firebase.initializeApp(firebaseConfig);

let messagesRef = firebase.database().ref("collected_data").child("activity");

function getQueryParams() {
const params = Object.fromEntries(new URLSearchParams(location.search));
return params;
}

var params = getQueryParams();
let clientName = params.client;
let projectName = params.file;
let startDate = params.startdate;
if (projectName) {
    document.getElementById('clientname').textContent = clientName;
    document.getElementById('projectname').textContent = projectName;
    document.getElementById('startingdate').textContent = startDate;
}

// Function to get form values
function getInputVal(id) {
    var inputValue = document.getElementById(id).value;
    return inputValue.trim();
}

document.getElementById("coveredPeriod").addEventListener("submit", submitProject);

function submitProject(e) {
    e.preventDefault();
  
    var covered_period = getInputVal("period");

    saveProject(covered_period);
    document.getElementById("coveredPeriod").reset();
    toDatabase();
}
  
// Save message to firebase
function saveProject(covered_period) {
    let newMessageRef = messagesRef.push();
    newMessageRef.set({
        date: covered_period,
        pname: projectName,
        client: clientName,
        sdate: startDate
    });
}

function toDatabase() {
    var database = firebase.database();
    var params = getQueryParams();
    var projectName = params.file ? params.file : "";
    var content = "";
    database
      .ref("collected_data")
      .child("activity")
      .orderByChild("itemL")
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            var val = data.val();
            if (projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) {
                if (val.date) {
                    content += `◙<a href="progress.html?client=` + val.client + `&project=` + val.pname + `&date=` + val.date + `">` + val.date + `</a><br>`;
                }
            }
        });
        $('#historyList').append(content);
    };
    });
};

toDatabase();
