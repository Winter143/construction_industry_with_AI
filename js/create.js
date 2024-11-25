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

$("#projectDrop").change(function () {
    if (this.value.includes('Others')){
        document.getElementById('clientname').style.display = "block";
    } else {
        document.getElementById('clientname').style.display = "none";
    }
});

function getQueryParams() {
    const params = Object.fromEntries(new URLSearchParams(location.search));
    return params;
}

function createClient() {
    let cname = getInputVal("projectDrop");
    let cnameOthers = getInputVal("clientname");
    let pname = getInputVal("projectname");
    let sdate = getInputVal("sdate");
    let params1 = new URLSearchParams();
    let params2 = new URLSearchParams();
    let params3 = new URLSearchParams();

    if (cname.includes("Others")) {
        params1.set("clientname", cnameOthers);
        params2.set("projectname", pname);
        params3.set("startdate", sdate);
    } else {
        params1.set("clientname", cname);
        params2.set("projectname", pname);
        params3.set("startdate", sdate);
    }
    window.location.href = "client.html?" + params1.toString() + "&" + params2.toString() + "&" + params3.toString();
}

function getInputVal(id) {
    var inputValue = document.getElementById(id).value;
    return inputValue.trim();
}

function toDatabase() {
    var database = firebase.database();
    var projectNameList = [];
    database.ref('collected_data').child('activity').once('value', function (snapshot) {
        if (snapshot.exists()) {
            var content = '';
            snapshot.forEach(function (data) {
                // console.log('data', data.key);  getting key of the row
                var val = data.val();
                if (!projectNameList.includes(val.client)) {
                    projectNameList.push(val.client);
                    content += '<option>' + val.client + '</option>';
                }
            });
            $('#projectDrop').append(content);
        }
        var addedcontent = '';
        addedcontent += '<option>Others</option>';
        $('#projectDrop').append(addedcontent);
    });
}   

(function ($) {
    'use strict';
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'MM/DD/YYYY'
            },
        });
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
        $(window).on('click',function(){
            isClick = 0;
        });
        $(myCalendar).on('apply.daterangepicker',function(ev, picker){
            isClick = 0;
            $(this).val(picker.startDate.format('MM/DD/YYYY'));
        });
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });
    
    } catch(er) {console.log(er);}

})(jQuery);
toDatabase();
