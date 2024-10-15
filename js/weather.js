$("#chosenDate").change(function () {
  const params = new URLSearchParams();
  const dateSplit = $(this).val().split("-");

  const year = dateSplit[0].trim();
  const month = dateSplit[1].trim();
  const day = dateSplit[2].trim();

  const selectedDate = `${year}-${month}-${day}`;
  params.set("ChosenDate", selectedDate);
  window.location.href = window.location.pathname + "?" + params.toString();
});

const getQueryParams = () => {
  const params = Object.fromEntries(new URLSearchParams(location.search));
  return params;
};

const loadWeather = () => {
  const params = getQueryParams();
  let selectedDate = "today";
  if (params.ChosenDate) {
    selectedDate = params.ChosenDate;
  }
  axios
    .get("http://localhost:5000/weather/" + selectedDate)
    .then(function (response) {
      const res = response.data;
      const data = res.data;
      // handle success
      console.log(data);
      if (data.length > 0) {
        let temp = "";
        data.forEach((itemData) => {
          temp += "<tr>";
          temp += "<td>6 am</td>";
          temp += "<td>" + itemData.six_am + "</td>";
          temp += "<td>" + itemData.six_am_status + "</td>";
          temp += "<tr>";
          temp += "<tr>";
          temp += "<td>9 am</td>";
          temp += "<td>" + itemData.nine_am + "</td>";
          temp += "<td>" + itemData.nine_am_status + "</td>";
          temp += "<tr>";
          temp += "<tr>";
          temp += "<td>12 pm</td>";
          temp += "<td>" + itemData.twelve_pm + "</td>";
          temp += "<td>" + itemData.twelve_pm_status + "</td>";
          temp += "<tr>";
          temp += "<tr>";
          temp += "<td>3 pm</td>";
          temp += "<td>" + itemData.three_pm + "</td>";
          temp += "<td>" + itemData.three_pm_status + "</td>";
          temp += "<tr>";
          temp += "<tr>";
          temp += "<td>6 pm</td>";
          temp += "<td>" + itemData.six_pm + "</td>";
          temp += "<td>" + itemData.six_pm_status + "</td>";
          temp += "<tr>";
        });
        document.getElementById("data").innerHTML = temp;
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

const getDateToday = () => {
  const dateToday = new Date();
  return formatDate(dateToday);
};

const formatDate = (date) => {
  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
};

const initliazeDatePicker = () => {
  const params = getQueryParams();
  let selectedDate = "";
  let currentDateText = "";

  if (params.ChosenDate && params.ChosenDate !== getDateToday()) {
    selectedDate = params.ChosenDate;
    currentDateText = setDateText(selectedDate);
  } else {
    selectedDate = getDateToday();
    currentDateText = "TODAY";
  }
  $("#chosenDate").val(selectedDate);
  $("#currentDate").append(currentDateText);
};

const setDateText = (date) => {
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateSplit = date.split("-");
  const month = monthList[parseInt(dateSplit[1]) - 1];
  const day = dateSplit[2];
  const year = dateSplit[0];
  return `${month} ${day}, ${year}`;
};

$(document).ready(function () {
  loadWeather();
  initliazeDatePicker();
});
