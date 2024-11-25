import { projectValidation } from "./project.js";

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

let messagesRef = firebase.database().ref("collected_data").child("activity");

let messagesRef1 = firebase.database().ref("collected_data").child("workers");

let messagesRef2 = firebase
  .database()
  .ref("collected_data")
  .child("equipments");

function getParams() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  return params;
}

let params = getParams()
let client = params.get('clientname');
let project = params.get('projectname').toUpperCase();
let sdate = params.get('startdate');

// WORKERS
var workers;
workers = ["PROJECT MANAGER", "SITE SUPERINTENDENT", "ESTIMATOR", "SAFETY OFFICER", "OFFICE ADMINISTRATOR", "CARPENTER", "ELECTRICIAN", "PLUMBER", "MASON", "IRONWORKER", "ROOFER", "PAINTER", "TILE SETTER", "CONSTRUCTION LABORER", "EQUIPMENT OPERATOR", "ARCHITECT", "ENGINEER", "SURVEYOR", "INSPECTOR", "OTHERS"]
var workers_str = ""
for (var work of workers) {
  workers_str += `<option value='${work}'>` + work + "</option>"
}
document.getElementById("worker").innerHTML = workers_str;

// EQUIPMENTS
var equipments;
equipments = [
  "EXCAVATOR", "BULLDOZER", "BACKHOE LOADER", "CRANE", "CONCRETE MIXER", "DUMP TRUCK", "ROLLER", "CONCRETE PUMP", "JACKHAMMER", "LADDER", "SCAFFOLDING", "LEVEL", "TAPE MEASURE", "HAMMER", "SAW", "DRILL", "SCREWDRIVER", "WRENCH", "PLIERS", "SAFETY HELMET", "SAFETY VEST", "SAFETY BOOTS", "HARD HAT", "EAR PROTECTION", "EYE PROTECTION", "RESPIRATORY PROTECTION", "OTHERS"
]
var equip_str = ""
for (var equip of equipments) {
  equip_str += `<option value='${equip}'>` + equip + "</option>"
}
document.getElementById("equip").innerHTML = equip_str;

// dropdown activity change
$("#aname").change(function () {
  if (this.value.includes('OTHERS')) {
    document.getElementById('anameInput').style.display = "block";
  }
  else {
    document.getElementById('anameInput').style.display = "none";
  }
});

// dropdown worker change
$("#worker").change(function () {
  if (this.value.includes('OTHERS')) {
    document.getElementById('labor').style.display = "block";
  }
  else {
    document.getElementById('labor').style.display = "none";
  }
});

// dropdown equipment change
$("#equip").change(function () {
  if (this.value.includes('OTHERS')) {
    document.getElementById('equipment').style.display = "block";
  }
  else {
    document.getElementById('equipment').style.display = "none";
  }
});

document.getElementById('activity-header').textContent = "Setting Immediate Predecessors & Time Estimates for the " + project + " of " + client;

document.getElementById("inputForm").addEventListener("submit", submitProject);

document.getElementById("workerForm").addEventListener("submit", submitForm1);

document.getElementById("action").addEventListener("click", myPert);

document
  .getElementById("equipmentForm")
  .addEventListener("submit", submitForm2);

$("#projectDrop").change(function () {
  let params = new URLSearchParams();
  params.set("projectname", $(this).val());
  window.location.href = window.location.pathname + "?" + params.toString();
});

function getQueryParams() {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  return params;
}

function nextCharacter(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

function submitProject(e) {
  e.preventDefault();

  var formValues = [
    "impre",
    "timeA",
    "timeM",
    "timeB",
  ];

  var invalid = false;
  formValues.every((el) => {
    var [isValid, errorMessage] = isFieldValid(el);
    if (!isValid) {
      invalid = true;
      $("#" + el).focus();
      alert(errorMessage);
      return false;
    }
    return true;
  });

  if (invalid) {
    return;
  }
  // Get values

  var projectDetail = {};

  formValues.forEach((field) => {
    projectDetail[field] = getInputVal(field);
  });

  var anamevalue = document.getElementById('aname').value;
  var aname;
  if (anamevalue.includes("OTHERS")) {
    aname = document.getElementById('anameInput').value;
  } else {
    aname = anamevalue;
  }

  const getRow = document.querySelector('#act-table > tbody > tr:last-child > td:nth-child(1)') || false;
  var actLabel = document.getElementById('act-label').textContent;
  var itemL;
  
  if (actLabel.includes("-")) {
    itemL = actLabel.replace("Activity Name - ", "");
    document.getElementById('act-label').textContent = "Activity Name";
  } else if (getRow) {
    const lastRow = document.querySelector('#act-table > tbody > tr:last-child > td:nth-child(1)').textContent;
    itemL = nextCharacter(lastRow);
  } else {
    itemL = "A"; 
  }

  if (itemL == "Q") {
    itemL = "A";
  }
  
  saveProject(projectDetail, aname, itemL);
  document.getElementById("inputForm").reset();
  toDatabase();
  document.getElementById('anameInput').style.display = "none";
}

function submitForm1(e) {
  e.preventDefault();

  // Get values
  let laborQuantity = getInputVal("laborQuantity");
  let laborHours = getInputVal("laborHours");
  let laborSalary = getInputVal("laborSalary");

  var workervalue = document.getElementById('worker').value;
  var labor;
  if (workervalue.includes("OTHERS")) {
    labor = document.getElementById('labor').value;
  } else {
    labor = workervalue;
  }

  saveMessage1(labor, laborQuantity, laborHours, laborSalary, project);

  document.getElementById("workerForm").reset();
  reloadWorkerEquipment();
}

function submitForm2(e) {
  e.preventDefault();

  // Get values
  let equipmentQuantity = getInputVal("equipmentQuantity");
  let equipmentDays = getInputVal("equipmentDays");
  let equipmentCost = getInputVal("equipmentCost");

  var equipvalue = document.getElementById('equip').value;
  var equipment;
  if (equipvalue.includes("OTHERS")) {
    equipment = document.getElementById('equipment').value;
  } else {
    equipment = equipvalue;
  }

  saveMessage2(equipment, equipmentQuantity, equipmentDays, equipmentCost, project);
  document.getElementById("equipmentForm").reset();
  reloadWorkerEquipment();
}

// Function to get form values
function getInputVal(id) {
  var inputValue = document.getElementById(id).value;
  return inputValue.trim();
}

function isFieldValid(inputId, inputValue) {
  var inputId = document.getElementById(inputId).id;
  var inputValue = document.getElementById(inputId).value;
  return projectValidation(inputId, inputValue);
}

// Save message to firebase
function saveProject(projectDetail, aname, itemL) {
  var impre = projectDetail.impre.toUpperCase()
    ? projectDetail.impre.toUpperCase()
    : "START";
  let newMessageRef = messagesRef.push();
  var anamevalue = aname.replace("&", "AND")
  newMessageRef.set({
    ...projectDetail,
    client: client,
    pname: project,
    sdate: sdate,
    aname: anamevalue,
    itemL: itemL,
    impre: impre,
    timeT:
      (parseInt(projectDetail.timeA) +
        4 * parseInt(projectDetail.timeM) +
        parseInt(projectDetail.timeB)) /
      6,
  });
}

function saveMessage1(labor, laborQuantity, laborHours, laborSalary, project) {
  let newMessageRef = messagesRef1.push();
  newMessageRef.set({
    client: client,
    pname: project,
    sdate: sdate,
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
  project
) {
  let newMessageRef = messagesRef2.push();
  newMessageRef.set({
    client: client,
    pname: project,
    sdate: sdate,
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

function editProjectRow(projectKey) {
  let quest1 = prompt("Please enter the password to edit", "");
  if (quest1 == "manager123123") {
    window.location.href = window.location.href + "&edit=" + projectKey;
  } else {
    alert("Password incorrect. Edit ignored.")
  }
}

function deleteProjectRow(projectKey) {
  let quest2 = prompt("Please enter the password to delete", "");
  if (quest2 == "manager123123") {
    deleteToDatabase("activity", projectKey);
    $("#" + projectKey).remove();
    disablePertCPMBtn();
  } else {
    alert("Password incorrect. Delete ignored.")
  }
}

function deleteOldRow(projectKey) {
  deleteToDatabase("activity", projectKey);
  $("#" + projectKey).remove();
  disablePertCPMBtn();
}

function deleteWorkerRow(projectKey) {
  let question1 = prompt("Please enter the password to delete", "");
  if (question1 == "manager123123") {
    deleteToDatabase("workers", projectKey);
    $("#workers_" + projectKey).remove();
    reloadWorkerEquipment();
  } else {
    alert("Password incorrect. Delete ignored.")
  }
}

function deleteEquipmentRow(projectKey) {
  let question2 = prompt("Please enter the password to delete", "");
  if (question2 == "manager123123") {
    deleteToDatabase("equipments", projectKey);
    $("#equipments_" + projectKey).remove();
    reloadWorkerEquipment();
  } else {
    alert("Password incorrect. Delete ignored.")
  }
}

function reloadWorkerEquipment() {
  $("#result-table tbody > tr").remove();
  toDatabase1();
  toDatabase2();
}

function deleteToDatabase(table, key) {
  var database = firebase.database();
  // create DatabaseReference
  const dbRef = database.ref(`collected_data/${table}/` + key);
  dbRef.remove();
}

function toDatabase() {
  $("#act-table tbody > tr").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.projectname ? params.projectname : "";
  var startDate = params.startdate ? params.startdate : "";
  var projectEdit = params.edit;
  database
    .ref("collected_data")
    .child("activity")
    .orderByChild("itemL")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if ((projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) && (val.impre)){
            var bgColor = '';
            if (data.key === projectEdit) {
              bgColor = 'style="background: yellow;"';
            }
            content += `<tr id='${data.key}' ${bgColor}>`;
            content += "<td>" + val.itemL + "</td>";
            content += "<td>" + val.aname + "</td>";
            content += "<td>" + val.impre + "</td>";
            content += "<td>" + val.timeA + "</td>";
            content += "<td>" + val.timeM + "</td>";
            content += "<td>" + val.timeB + "</td>";
            content += "<td>" + val.timeT + "</td>";

            if (data.key !== projectEdit) {
              content += `<td>
              <button type="button" class="btn btn-success" id="edit_${data.key}">Edit</button>
              </td>`;
              content += `<td>
              <button type="button" class="btn btn-danger" id="del_${data.key}">Remove</button>
              </td>`;
            }
            else {
              document.getElementById('anameInput').style.display = "block";
              document.getElementById('act-label').textContent = "Activity Name - " + val.itemL;
              document.querySelector("#anameInput").value = val.aname;
              document.querySelector("#impre").value = val.impre;
              document.querySelector("#timeA").value = val.timeA;
              document.querySelector("#timeM").value = val.timeM;
              document.querySelector("#timeB").value = val.timeB;
              console.log(data.key)
              deleteOldRow(data.key);

              content += `<td>
          </td>`;
              content += `<td>
          </td>`;
            }
            content += "</tr>";

            activityKey.push(data.key);
          }
        });
        content = content.trim();

        if (!content) {
          content = "<tr><td colspan='9'>Project empty.</td></tr>";
          $("#action").prop("disabled", true);
          disablePertCPMBtn();
        }

        $("#act-table").append(content);

        // FOR EDIT
        activityKey.forEach((key) => {
          document
            .querySelector("#edit_" + key)
            .addEventListener("click", () => {
              editProjectRow(key);
            });
        });

        // FOR DELETE
        activityKey.forEach((key) => {
          document
            .querySelector("#del_" + key)
            .addEventListener("click", () => {
              deleteProjectRow(key);
            });
        });
      };
    });
}

function disablePertCPMBtn() {
  if ($('[id^="btn_"]').length === 0) {
    $("#action").prop("disabled", true);
  }
}

function toDatabase1() {
  $("#worker-table tbody > tr:not(:first-child)").remove();
  var database = firebase.database();
  var params = getQueryParams();
  var projectName = params.projectname ? params.projectname : "";
  database
    .ref("collected_data")
    .child("workers")
    .once("value", function (snapshot) {
      if (snapshot.exists()) {
        var content = "";
        var totalContent = "";
        var activityKey = [];
        snapshot.forEach(function (data) {
          var val = data.val();
          if (projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) {
            content += `<tr id='workers_${data.key}'>`;
            content += "<td>" + val.labor + "</td>";
            content += "<td>" + val.laborQuantity + "</td>";
            content += "<td>" + val.laborHours + "</td>";
            content += "<td>" + val.laborSalary + "</td>";
            content +=
              '<td><button type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.labor +
              "</div><div>₱ " +
              val.laborTotal.toLocaleString(); +
              "</div></td>";
            totalContent += "<tr>";

            activityKey.push(data.key);
          }
        });
        $("#worker-table").append(content);
        $("#result-table").append(totalContent);

        // FOR DELETE
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
  var projectName = params.projectname ? params.projectname : "";
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
          if (projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) {
            content += `<tr id='equipments_${data.key}'>`;
            content += "<td>" + val.equipment + "</td>";
            content += "<td>" + val.equipmentQuantity + "</td>";
            content += "<td>" + val.equipmentDays + "</td>";
            content += "<td>" + val.equipmentCost + "</td>";
            content +=
              '<td><button type="button" class="btn btn-danger">Remove</button></td>';
            content += "</tr>";

            totalContent += "<tr>";
            totalContent +=
              "<td style='display:flex; justify-content: space-between;'><div>" +
              val.equipment +
              "</div><div>₱ " +
              val.equipmentTotal.toLocaleString(); +
              "</div></td>";
            totalContent += "<tr>";

            activityKey.push(data.key);
          }
        });
        $("#equipment-table").append(content);
        $("#result-table").append(totalContent);

        totalofAll();

        // FOR DELETE
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

function totalofAll() {
  var total_list = [];
  for (var j = 0; j < $("#result-table > tbody > tr").length; j++) {
    if ((j + 1) % 2 == 1) {
      var indiv = document.querySelector(`#result-table > tbody > tr:nth-child(${j + 1}) > td > div:nth-child(2)`).textContent;
      var cleaned_indiv = indiv.replace("₱ ", "").replace(",", "")
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

function getTableContents() {
  var row_contents = [];
  for (var j = 0; j < $("#act-table > tbody > tr").length; j++) {
    var item = document.querySelector(`#act-table > tbody > tr:nth-child(${j + 1}) > td:nth-child(1)`).textContent;
    var act_name = document.querySelector(`#act-table > tbody > tr:nth-child(${j + 1}) > td:nth-child(2)`).textContent;
    row_contents.push([item, act_name]);
  }
  return row_contents;
}

// PERT CPM PART --------------------------------------------------------------------------------------
// Function to download the CSV file
const download = (data, projectName, getDate) => {
  // Create a Blob with the CSV data and type
  const blob = new Blob([data], { type: "text/csv" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor tag for downloading
  const a = document.createElement("a");

  // Set the URL and download attribute of the anchor tag
  a.href = url;
  a.download = "download_" + projectName + "_" + getDate + ".csv";

  // Trigger the download by clicking the anchor tag
  a.click();
};

const dateToday = () => {
  var today = new Date();

  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var minute = today.getMinutes();
  var secs = today.getSeconds();

  today = mm + "-" + dd + "-" + yyyy + "_" + hour + minute + secs;
  return today;
};

// Function to create a CSV string from an object
const csvmaker = (data) => {
  // Get the keys (headers) of the object
  var headers = data.headers;

  // Get the values of the object
  var values = data.values;
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    rows.push(values[i].join(","));
  }

  return [headers.join(","), rows.join("\n")].join("\n");
};

async function get(getDate) {
  var rows = [];
  for (var j = 0; j < $("#act-table tbody > tr").length; j++) {
    var itemChar = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[0]
      .textContent;
    var impre = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[2]
      .textContent;
    var timeT = $(`#act-table tbody tr:nth-child(${j + 1}) > td`)[6]
      .textContent;
    if (impre.toUpperCase() === "START") {
      impre = "-";
    }
    rows.push([itemChar, impre, timeT]);
  }

  var csvData = {
    headers: ["ac", "pr", "du"],
    values: rows,
  };
  // Create the CSV string from the data
  const csvdata = csvmaker(csvData);

  // Download the CSV file
  download(csvdata, project, getDate);
  var csvName = project;
  await runPertCPM(csvName, csvData);

  var def_link = "/pertcpm.html?file=" + csvName;
  let table_contents = getTableContents();
  for (let x of table_contents) {
    def_link += "&" + x[0] + "=" + x[1]
  }

  return def_link;
}

async function runPertCPM(name, data) {
  console.log("runPertCPM", runPertCPM);

  const json = JSON.stringify({ cpm_data: data });

  const res = await axios.post("http://localhost:5000/cpm/" + name, json, {
    headers: {
      // Overwrite Axios's automatically set Content-Type
      "Content-Type": "application/json",
    },
  });
}

async function myPert() {
  var getDate = dateToday();
  var params = await get(getDate);
  window.location.href = params;
}

toDatabase();
toDatabase1();
toDatabase2();

const loadGemini = () => {
  const params = getQueryParams();
  let project_name = "";
  if (params.projectname) {
    project_name = params.projectname;
  }
  axios
    .get("http://localhost:5000/gpt/" + project_name)
    .then(function (response) {
      const res = response.data;
      const data = res.data;
      // handle success
      if (data.length > 0) {
        var str = ""
        data.forEach((item) => {
          str += `<option value='${item}'>` + item + "</option>"
        });
        document.getElementById("aname").innerHTML = str;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

$(document).ready(function () {
  loadGemini();
});
