var selectedDate;

function setDateToToday () {
    //Prevent previous dates in datepicker
    var input = document.getElementById("dateField");
    var today = new Date();
    var day = today.getDate();
    // Set month to string to add leading 0
    var mon = new String(today.getMonth()+1); //January is 0!
    var yr = today.getFullYear();
    if(mon.length < 2) { mon = "0" + mon; }
    var date = new String( yr + '-' + mon + '-' + day );
    selectedDate = date;
    input.value = date;
    input.disabled = false;
    input.setAttribute('min', date);
}

function setDate () {
    console.log($("#dateField").val());
    selectedDate = $("#dateField").val();
    if (timePicked) {
        refreshTableView();
    }
}

$(document).ready(function(){
    //$("#dateField").datepicker();
    setDateToToday();
    $("#dateField").change(setDate);
});