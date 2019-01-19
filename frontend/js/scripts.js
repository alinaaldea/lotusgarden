
//Set datetime in form to current time
var now = new Date();
var utcString = now.toISOString().substring(0,19);
var year = now.getFullYear();
var month = now.getMonth() + 1;
var day = now.getDate();
var hour = now.getHours();
var minute = now.getMinutes();
var second = now.getSeconds();

var localDatetime = year + "-" +
    (month < 10 ? "0" + month.toString() : month) + "-" +
    (day < 10 ? "0" + day.toString() : day) + "T" +
    (hour < 10 ? "0" + hour.toString() : hour) + ":" +
    (minute < 10 ? "0" + minute.toString() : minute) +
    utcString.substring(16,19);

var datetimeField = document.getElementById("dateFiled");
datetimeField.value = localDatetime;