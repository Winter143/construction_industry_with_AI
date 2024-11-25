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
let projectName = params.project;
let coveredPeriod = params.date;
if (projectName) {
    document.getElementById('clientname').textContent = clientName;
    document.getElementById('projectname').textContent = projectName;
    document.getElementById('startingdate').textContent = coveredPeriod;
}

// Function to get form values
function getInputVal(id) {
    var inputValue = document.getElementById(id).value;
    return inputValue.trim();
}

document.getElementById("add_input").addEventListener("submit", submitProject);

document.getElementById("addprogress").addEventListener("click", () => {
    document.getElementById('add_row').style.display = "block";
    document.getElementById('addprogress').style.display = "none";
});

document.getElementById("calculateprogress").addEventListener("click", () => {
    totalofAll();
});

function submitProject(e) {
    e.preventDefault();
  
    var anamevalue = document.querySelector('#activityname option:checked').textContent;
    var itemLetter = document.querySelector('#activityname option:checked').value;
    var amount = document.getElementById('amount').value;
    var previous = document.getElementById('previous').value;
    var thisPeriod = document.getElementById('thisperiod').value;

    saveProject(itemLetter, anamevalue, amount, previous, thisPeriod);
    document.getElementById("add_input").reset();
    toDatabase();
    document.getElementById('add_row').style.display = "none";
    document.getElementById('addprogress').style.display = "block";
}
  
// Save message to firebase
function saveProject(itemL, aname, amount, previous, thisperiod) {
    var previous_amount = Math.round((amount * previous / 100) * 1000) / 1000;
    var period_amount = Math.round((amount * thisperiod / 100) * 100) / 100;
    let newMessageRef = messagesRef.push();
    const anamevalue = aname.split(" - ");
    newMessageRef.set({
        itemL: itemL,
        aname: anamevalue[1],
        pname: projectName,
        cov_period: coveredPeriod,
        contract_amount: amount,
        thisperiod: thisperiod,
        period_amount: period_amount,
        previous: previous,
        previous_amount: previous_amount,
        cummulative: (parseInt(previous) + parseInt(thisperiod)),
        cummulative_amount: parseFloat(previous_amount) + parseFloat(period_amount),
        status: "added"
    });
}

function deleteToDatabase(table, key) {
    var database = firebase.database();
    const dbRef = database.ref(`collected_data/${table}/` + key);
    dbRef.remove();
}

function deleteProjectRow(projectKey) {
    deleteToDatabase("activity", projectKey);
    $("#" + projectKey).remove();
}

function toDatabase() {
    $("#act-table tbody > tr").remove();
    var database = firebase.database();
    var params = getQueryParams();
    var projectName = params.project ? params.project : "";
    var coverage = params.date ? params.date : "";
    database
      .ref("collected_data")
      .child("activity")
      .orderByChild("itemL")
      .once("value", function (snapshot) {
        if (snapshot.exists()) {
          var content = "";
          var progressKey = [];
          var str = "";
          snapshot.forEach(function (data) {
            var val = data.val();
            if (projectName.toUpperCase().trim() === val.pname.toUpperCase().trim()) {
                if ((val.aname) && (val.status == "added") && val.cov_period === coverage) {
                    content += `<tr id='${data.key}' name='actinputs'>`;
                    content += "<td>" + val.itemL + "</td>";
                    content += "<td>" + val.aname + "</td>";
                    content += "<td>" + val.contract_amount + "</td>";
                    content += "<td></td>";
                    content += "<td>" + val.previous + "%</td>";
                    content += "<td>" + val.previous_amount + "</td>";
                    content += "<td>" + val.thisperiod + "%</td>";
                    content += "<td>" + val.period_amount + "</td>";
                    content += "<td>" + val.cummulative + "%</td>";
                    content += "<td>" + val.cummulative_amount + "</td>";
                    content += `<td>
                    <button type="button" name="remove" class="btn btn-danger" id="del_${data.key}">Remove</button>
                    </td>`;
                    content += "</tr>";
                    progressKey.push(data.key);
                }
                if (val.aname) {
                    if ((val.aname) && (val.status !== "added")) {
                        str += `<option value='${val.itemL}'>` + val.itemL + " - " + val.aname + "</option>"
                    }    
                }
            }
        });
  
        $("#act-table").append(content);
        document.getElementById("activityname").innerHTML = str;

        // remove dropdown contents in every add progress
        var get_act = document.querySelectorAll('tbody > tr > td:nth-child(1)');
        for (var i = 0; i < get_act.length; i++) {
            $("#activityname option[value='" + get_act[i].textContent + "']").remove();
        }
        
        // display none add progress if activity names are all filled up
        var act_length = document.getElementById("activityname").length;
        if (act_length === 0) {
            document.getElementById('addprogress').style.display = "none";
            totalofAll();
        }
  
        // FOR DELETE
        progressKey.forEach((key) => {
            document.querySelector("#del_" + key).addEventListener("click", () => {
                deleteProjectRow(key);
            });
        });
    };
    });
};

function totalofAll() {
    var actinputs = document.getElementsByName('actinputs').length;
    var total_contract = [];
    var total_prev = [];
    var total_period = [];
    var total_cumm = [];

    console.log(actinputs)

    for (var j = 0; j < actinputs; j++) {
        var contract_amount = document.querySelector(`tr[name='actinputs']:nth-child(${j + 1}) > td:nth-child(3)`).textContent;
        var prev_amount = document.querySelector(`tr[name='actinputs']:nth-child(${j + 1}) > td:nth-child(6)`).textContent;
        var period_amount = document.querySelector(`tr[name='actinputs']:nth-child(${j + 1}) > td:nth-child(8)`).textContent;
        var cumm_amount = document.querySelector(`tr[name='actinputs']:nth-child(${j + 1}) > td:nth-child(10)`).textContent;
        
        total_contract.push(parseFloat(contract_amount));
        total_prev.push(parseFloat(prev_amount));
        total_period.push(parseFloat(period_amount));
        total_cumm.push(parseFloat(cumm_amount));

        if (j + 1 === actinputs) {
            break
        }
    }

    // get the sum of the values in array
    const sum = array => eval(array.join('+'));
    var total_perc_prev = [];
    var total_perc_period = [];
    var total_perc_cumm = [];
    var sum_contract = sum(total_contract);
    var sum_prev = sum(total_prev);
    var sum_period = sum(total_period);
    var sum_cumm = sum(total_cumm);

    for (var k = 0; k < total_contract.length; k++) {
        var perc_weight = Math.round((total_contract[k] / sum_contract)* 100 * 100) / 100;

        var perc_prev = document.querySelector(`tr:nth-child(${k + 1}) > td:nth-child(5)`).textContent;
        var perc_period = document.querySelector(`tr:nth-child(${k + 1}) > td:nth-child(7)`).textContent;
        var perc_cumm = document.querySelector(`tr:nth-child(${k + 1}) > td:nth-child(9)`).textContent;

        var prev_dec = perc_prev.replace("%", "") / 100;
        var period_dec = perc_period.replace("%", "") / 100;
        var cumm_dec = perc_cumm.replace("%", "") / 100;

        var perc_x_prev = parseFloat(perc_weight) * prev_dec
        var perc_x_period = parseFloat(perc_weight) * period_dec
        var perc_x_cumm = parseFloat(perc_weight) * cumm_dec
        
        document.querySelector(`tr:nth-child(${k + 1}) > td:nth-child(4)`).textContent = perc_weight + "%";
        total_perc_prev.push(parseFloat(perc_x_prev));
        total_perc_period.push(parseFloat(perc_x_period));
        total_perc_cumm.push(parseFloat(perc_x_cumm));
    }
    
    var sum_perc_prev = Math.round(sum(total_perc_prev)* 100) / 100;
    var sum_perc_period = Math.round(sum(total_perc_period)* 100) / 100;
    var sum_perc_cumm = Math.round(sum(total_perc_cumm)* 100) / 100;

    var x = sum_perc_prev.toString() + "%";
    var y = sum_perc_period.toString() + "%";
    var z = sum_perc_cumm.toString() + "%";
    
    var showTotal = "";
  
    showTotal += "<tr>";
    showTotal += "<td colspan=2 style='background-color:green;'><b>Total Contract Amount (PHP)</b></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + sum_contract.toLocaleString(); + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>100%</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + x; + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + sum_prev.toLocaleString(); + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + y; + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + sum_period.toLocaleString(); + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + z; + "</b></div></td>";
    showTotal += "<td style='background-color:green;'><div></div><div><b>" + sum_cumm.toLocaleString(); + "</b></div></td>";
    showTotal += "<td></td>";
    showTotal += "<tr>";
    $("#act-table").append(showTotal);
    document.getElementById('calculateprogress').style.display = "none";
}

toDatabase();
