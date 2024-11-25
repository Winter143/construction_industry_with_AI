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

function showDiv(client, pname, sdate) {
    window.location.href = window.location.pathname + "?clientname=" + client + "&projectname=" + pname + "&startdate=" + sdate;
}
  
function getQueryParams() {
const params = Object.fromEntries(new URLSearchParams(location.search));
return params;
}

function nextPage(loc) {
    var params = getQueryParams();
    var projectName = params.projectname;
    window.location = loc + "?file=" + projectName;
}

function editPage(loc) {
    var params = getQueryParams();
    var clientName = params.clientname;
    var projectName = params.projectname;
    var startDate = params.startdate;
    window.location = loc + "?clientname=" + clientName + "&projectname=" + projectName + "&startdate=" + startDate;
}

function progressPage(loc) {
    var params = getQueryParams();
    var clientName = params.clientname;
    var projectName = params.projectname;
    var startDate = params.startdate;
    window.location = loc + "?client=" + clientName + "&file=" + projectName + "&startdate=" + startDate;
}

function toDatabase() {
    var database = firebase.database();
    var projectNameList = [];
    database.ref('collected_data').child('activity').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            var def_link = "pertcpm.html?file=" + projectName;
            snapshot.forEach(function (data) {
                var val = data.val();
                if (!projectNameList.includes(val.pname)) {
                    projectNameList.push(val.pname);
                    content += `<tr>`;
                    content += '<td>' + val.client + '</td>';
                    content += '<td>' + val.pname + '</td>';
                    content += '<td>' + val.sdate + '</td>';
                    content += `<td><button type="button" class="btn btn-success" onclick="showDiv('` + val.client + `','` + val.pname + `','` + val.sdate + `'); return false;">Select</button>
                                </td>`;
                    content += '</tr>';
                }
                if (projectName == val.pname) {
                    def_link += "&" + val.itemL + "=" + val.aname
                }
            });
            $('#client_list').append(content);
            document.getElementById("pertBtn").addEventListener("click", () => {
                window.location = def_link;
                
            });
        }
    });
    var params = getQueryParams();
    var projectName = params.projectname;
    if (projectName) {
        document.getElementById('editproject').textContent = 'Edit Project';
        document.getElementById('projectlabel').textContent = projectName + ' Project Check';
        document.getElementById('schedulelabel').textContent = 'Schedule (Diagram)';
        document.getElementById('manpowerlabel').textContent = 'Man Power, Equipment Assignment and Overtime Calculations';
        document.getElementById('sectionPart').style.display = "block";
    }
    else {
        document.getElementById('projectlabel2').textContent = 'No Project Selected';
        document.getElementById('noSectionPart').style.display = "block";
    }
}

toDatabase();
