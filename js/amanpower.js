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
  
  // WORKERS
  var workers;
  workers = ["PROJECT MANAGER", "SITE SUPERINTENDENT", "ESTIMATOR", "SAFETY OFFICER", "OFFICE ADMINISTRATOR", "CARPENTER", "ELECTRICIAN", "PLUMBER", "MASON", "IRONWORKER", "ROOFER", "PAINTER", "TILE SETTER", "CONSTRUCTION LABORER", "EQUIPMENT OPERATOR", "ARCHITECT", "ENGINEER", "SURVEYOR", "INSPECTOR", "OTHERS"]
  var workers_str = ""
  for (var work of workers) {
    workers_str += `<option value='${work}'>` + work + "</option>"
  }
  document.getElementById("worker").innerHTML = workers_str;
  
  // OT WORKERS
  var workers;
  workers = ["PROJECT MANAGER", "SITE SUPERINTENDENT", "ESTIMATOR", "SAFETY OFFICER", "OFFICE ADMINISTRATOR", "CARPENTER", "ELECTRICIAN", "PLUMBER", "MASON", "IRONWORKER", "ROOFER", "PAINTER", "TILE SETTER", "CONSTRUCTION LABORER", "EQUIPMENT OPERATOR", "ARCHITECT", "ENGINEER", "SURVEYOR", "INSPECTOR", "OTHERS"]
  var workers_str = ""
  for (var work of workers) {
    workers_str += `<option value='${work}'>` + work + "</option>"
  }
  document.getElementById("otworker").innerHTML = workers_str;
  
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
  
  // dropdown worker change
  $("#worker").change(function () {
    if (this.value.includes('OTHERS')) {
      document.getElementById('labor').style.display = "block";
    }
    else {
      document.getElementById('labor').style.display = "none";
    }
  });
  
  // dropdown ot worker change
  $("#otworker").change(function () {
    if (this.value.includes('OTHERS')) {
      document.getElementById('OTlabor').style.display = "block";
    }
    else {
      document.getElementById('OTlabor').style.display = "none";
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
  
    saveMessage1(labor, laborQuantity, laborHours, laborSalary, pname);
    
    document.getElementById("workerForm").reset();
    reloadWorkerEquipment();
  }
  
  function submitForm2(e) {
    e.preventDefault();
    var params = getQueryParams();
    var projectName = params.file;
    // Get values
    let pname = projectName;
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
    let OTlaborQuantity = getInputVal("OTlaborQuantity");
    let OTlaborHours = getInputVal("OTlaborHours");
    let OTlaborSalary = getInputVal("OTlaborSalary");
  
    var otvalue = document.getElementById('otworker').value;
    var OTlabor;
    if (otvalue.includes("OTHERS")) {
      OTlabor = document.getElementById('equipment').value;
    } else {
      OTlabor = otvalue;
    }
  
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
    console.log(projectKey)
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
    console.log(projectKey)
    let question2 = prompt("Please enter the password to delete", "");
    if (question2 == "manager123123") {
      deleteToDatabase("equipments", projectKey);
      $("#equipments_" + projectKey).remove();
      reloadWorkerEquipment();
    } else {
      alert("Password incorrect. Delete ignored.")
    }
  }
  
  function deleteOvertimeRow(projectKey) {
    console.log(projectKey)
    let question3 = prompt("Please enter the password to delete", "");
    if (question3 == "manager123123") {
      deleteToDatabase("overtime", projectKey);
      $("#overtime_" + projectKey).remove();
      reloadWorkerEquipment();
    } else {
      alert("Password incorrect. Delete ignored.")
    }
  }
  
  function reloadWorkerEquipment() {
    $("#result-table tbody > tr").remove();
    toDatabase1();
    toDatabase2();
    toDatabase3();
    location.reload();
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
          totalofAll();
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
    const element = document.getElementById('total-table');
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
          if (element) {
            document.getElementById('total-table').style.display = "none";
            totalofAllWithOT();
          }
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
  
  function totalofAllWithOT() {
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
  
    $("#ot-total-table").append(showTotal);
  }
  
  toDatabase1();
  toDatabase2();
  toDatabase3();
  