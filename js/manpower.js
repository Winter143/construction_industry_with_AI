let firebaseConfig = {
  apiKey: "AIzaSyAUps0u952FCNFslPPn0VOwtVQLXEg1JnM",
  authDomain: "construction-industry-wi-70272.firebaseapp.com",
  databaseURL:
    "https://construction-industry-wi-70272-default-rtdb.firebaseio.com",
  projectId: "construction-industry-wi-70272",
  storageBucket: "construction-industry-wi-70272.appspot.com",
  messagingSenderId: "494097993743",
  appId: "1:494097993743:web:85219ddf87e2e9ae75d37a",
};
firebase.initializeApp(firebaseConfig);

let messagesRef1 = firebase.database().ref("collected_data").child("workers");

let messagesRef2 = firebase
  .database()
  .ref("collected_data")
  .child("equipments");

let messagesRef3 = firebase
  .database()
  .ref("collected_data")
  .child("overtime");

document.getElementById("workerForm").addEventListener("submit", submitForm1);

document
  .getElementById("equipmentForm")
  .addEventListener("submit", submitForm2);

document
  .getElementById("OTForm")
  .addEventListener("submit", submitForm3);

function getQueryParams() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  return params;
}

function submitForm1(e) {
  e.preventDefault();
  var params = getQueryParams();
  var projectName = params.file;
  // Get values
  let pname = projectName;
  let labor = getInputVal("labor");
  let laborQuantity = getInputVal("laborQuantity");
  let laborHours = getInputVal("laborHours");
  let laborSalary = getInputVal("laborSalary");

  saveMessage1(labor, laborQuantity, laborHours, laborSalary, pname);
  console.log(pname)
  document.getElementById("workerForm").reset();
  reloadWorkerEquipment();
}

function submitForm2(e) {
  e.preventDefault();
  var params = getQueryParams();
  var projectName = params.file;
  // Get values
  let pname = projectName;
  let equipment = getInputVal("equipment");
  let equipmentQuantity = getInputVal("equipmentQuantity");
  let equipmentDays = getInputVal("equipmentDays");
  let equipmentCost = getInputVal("equipmentCost");

  saveMessage2(equipment, equipmentQuantity, equipmentDays, equipmentCost, pname);
  document.getElementById("equipmentForm").reset();
  reloadWorkerEquipment();
}

function submitForm3(e) {
  e.preventDefault();
  var params = getQueryParams();
  var projectName = params.file;
  // Get values
  let pname = projectName;
  let OTlabor = getInputVal("OTlabor");
  let OTlaborQuantity = getInputVal("OTlaborQuantity");
  let OTlaborHours = getInputVal("OTlaborHours");
  let OTlaborSalary = getInputVal("OTlaborSalary");

  saveMessage3(OTlabor, OTlaborQuantity, OTlaborHours, OTlaborSalary, pname);
  console.log(pname)
  document.getElementById("OTForm").reset();
  reloadWorkerEquipment();
}

// Function to get form values
function getInputVal(id) {
  var inputValue = document.getElementById(id).value;
  return inputValue.trim();
}

function saveMessage1(labor, laborQuantity, laborHours, laborSalary, pname) {
  let newMessageRef = messagesRef1.push();
  newMessageRef.set({
    pname: pname,
    labor: labor,
    laborQuantity: laborQuantity,
    laborHours: laborHours,
    laborSalary: laborSalary,
    laborTotal:
      parseInt(laborQuantity) * parseInt(laborHours) * parseInt(laborSalary),
  });
}

function saveMessage2(
  equipment,
  equipmentQuantity,
  equipmentDays,
  equipmentCost,
  pname
) {
  let newMessageRef = messagesRef2.push();
  newMessageRef.set({
    pname: pname,
    equipment: equipment,
    equipmentQuantity: equipmentQuantity,
    equipmentDays: equipmentDays,
    equipmentCost: equipmentCost,
    equipmentTotal:
      parseInt(equipmentQuantity) *
      parseInt(equipmentDays) *
      parseInt(equipmentCost),
  });
}

function saveMessage3(OTlabor, OTlaborQuantity, OTlaborHours, OTlaborSalary, pname) {
  let newMessageRef = messagesRef3.push();
  newMessageRef.set({
    pname: pname,
    OTlabor: OTlabor,
    OTlaborQuantity: OTlaborQuantity,
    OTlaborHours: OTlaborHours,
    OTlaborSalary: OTlaborSalary,
    OTlaborTotal:
      parseInt(OTlaborQuantity) * parseInt(OTlaborHours) * parseInt(OTlaborSalary),
  });
}

function deleteWorkerRow(projectKey) {
  deleteToDatabase("workers", projectKey);
  $("#workers_" + projectKey).remove();
  reloadWorkerEquipment();
}

function deleteEquipmentRow(projectKey) {
  deleteToDatabase("equipments", projectKey);
  $("#equipments_" + projectKey).remove();
  reloadWorkerEquipment();
}

function deleteOvertimeRow(projectKey) {
  deleteToDatabase("overtime", projectKey);
  $("#overtime_" + projectKey).remove();
  reloadWorkerEquipment();
}

function reloadWorkerEquipment() {
  $("#result-table tbody > tr").remove();
  toDatabase1();
  toDatabase2();
  toDatabase3();
}

function deleteToDatabase(table, key) {
  var database = firebase.database();
  // create DatabaseReference
  const dbRef = database.ref(`collected_data/${table}/` + key);
  dbRef.remove();
}

function toDatabase1() {
  $("#worker-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.file ? params.file : "";
  database
    .ref("collected_data")
    .child("workers")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var sumContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.trim() === val.pname.trim()) {
            // console.log('data', data.key);  getting key of the row
            content += `<tr id='workers_${data.key}'>`;
            content += "<td>" + val.labor + "</td>";
            content += "<td>" + val.laborQuantity + "</td>";
            content += "<td>" + val.laborHours + "</td>";
            content += "<td>" + val.laborSalary + "</td>";
            content +=
              '<td><button id="removebtn" type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.labor +
              "</div><div>₱ " +
              (val.laborTotal).toLocaleString(); +
              "</div></td>";
            totalContent += "<tr>";

            activityKey.push(data.key);
          }
        });
        $("#worker-table").append(content);
        $("#result-table").append(totalContent);

        activityKey.forEach((key) => {
          document
            .querySelector("#workers_" + key)
            .addEventListener("click", () => {
              deleteWorkerRow(key);
            });
        });
      }
    });
}

function toDatabase2() {
  $("#equipment-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.file ? params.file : "";
  database
    .ref("collected_data")
    .child("equipments")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.trim() === val.pname.trim()) {
            // console.log('data', data.key);  getting key of the row
            content += `<tr id='equipments_${data.key}'>`;
            content += "<td>" + val.equipment + "</td>";
            content += "<td>" + val.equipmentQuantity + "</td>";
            content += "<td>" + val.equipmentDays + "</td>";
            content += "<td>" + val.equipmentCost + "</td>";
            content +=
              '<td><button id="removebtn" type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.equipment +
              "</div><div>₱ " +
              (val.equipmentTotal).toLocaleString(); +
              "</div></td>";
            totalContent += "<tr>";

            activityKey.push(data.key);
          }
        });
        $("#equipment-table").append(content);
        $("#result-table").append(totalContent);

        activityKey.forEach((key) => {
          document
            .querySelector("#equipments_" + key)
            .addEventListener("click", () => {
              deleteEquipmentRow(key);
            });
        });
      }
    });
}

function toDatabase3() {
  $("#ot-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.file ? params.file : "";
  database
    .ref("collected_data")
    .child("overtime")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.trim() === val.pname.trim()) {
            // console.log('data', data.key);  getting key of the row
            content += `<tr id='overtime_${data.key}'>`;
            content += "<td>" + val.OTlabor + "</td>";
            content += "<td>" + val.OTlaborQuantity + "</td>";
            content += "<td>" + val.OTlaborHours + "</td>";
            content += "<td>" + val.OTlaborSalary + "</td>";
            content +=
              '<td><button id="removebtn" type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.OTlabor +
              " (Overtime)</div><div>₱ " +
              (val.OTlaborTotal).toLocaleString(); +
              "</div></td>";
            totalContent += "<tr>";

            activityKey.push(data.key);
          }
        });
        $("#ot-table").append(content);
        $("#result-table").append(totalContent);
        totalofAll();
        activityKey.forEach((key) => {
          document
            .querySelector("#overtime_" + key)
            .addEventListener("click", () => {
              deleteOvertimeRow(key);
            });
        });
      }
    });
}

function totalofAll() {
  var total_list = [];
  for (var j = 0; j < $("#result-table > tbody > tr").length; j++) {
    if ((j + 1) % 2 == 1) {
      var indiv = document.querySelector(`#result-table > tbody > tr:nth-child(${j + 1}) > td > div:nth-child(2)`).textContent;
      cleaned_indiv = indiv.replace("₱ ", "").replace(",", "")
      total_list.push(parseInt(cleaned_indiv));
    } else {
      continue
    }
  }
  let sum = 0;
  for (let i = 0; i < total_list.length; i++) {
    sum += total_list[i];
  }
  var showTotal = "";

  showTotal += "<tr>";
  showTotal +=
  "<td style='display:flex; justify-content: space-between;background-color:green;'><div><b>TOTAL</b></div><div>₱ " +
  sum.toLocaleString(); +
  "</div></td>";
  showTotal += "<tr>";

  $("#total-table").append(showTotal);
}

toDatabase1();
toDatabase2();
toDatabase3();
