var tableDiv = document.getElementById('tableDiv');
function getReservationsByDate(){
    var date = document.getElementById('dateField').value;
    var data = {dt: date};

    $.post('http://localhost:3000/reservations/restaurant/all_reservations/', data, function(response){
        var reservationArray = response;
        var sortedReservations = [];

        //Sort reservations by table
        reservationArray.forEach(function(reservation){
            sortedReservations[reservation.table_id] = sortedReservations[reservation.table_id] || [];
            sortedReservations[reservation.table_id].push(reservation);
        });
        console.log(sortedReservations);
        tableDiv.innerHTML = tableBuilder(sortedReservations);
        sortTable();
    })

}

function tableBuilder(reservationArray){
    var table = "<div class='row'>";
    for(var key in reservationArray){
        var table = table + "<div class='col-lg-6'><h3>Table " + key +"</h3>\n<table class='table table-hover table-bordered reservationTable'><tr><th>Name</th><th>Number of people</th><th>Start Time</th><th>End Time</th><th>Phone</th></tr>";
        var j;
        for(j = 0; j < reservationArray[key].length; j++){
            var startTime = new Date(reservationArray[key][j].start_dateTime);
            startTime = startTime.getHours() - 1 + ":" + (startTime.getMinutes()<10?'0':'') + startTime.getMinutes();
            var endTime = new Date(reservationArray[key][j].end_dateTime);
            endTime = endTime.getHours() - 1 + ":" + (endTime.getMinutes()<10?'0':'') + endTime.getMinutes();


            table += "<tr>";
            table = table + "<td>" + reservationArray[key][j].name + "</td>";
            table = table + "<td>" + reservationArray[key][j].number_of_people + "</td>";
            table = table + "<td>" + startTime + "</td>";
            table = table + "<td>" + endTime + "</td>";
            table = table + "<td>" + reservationArray[key][j].phone_number + "</td>";
            table += "</tr>";
        }
        table += "</table></div>";
    }
    table += "</div>";
    return table;
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByClassName('reservationTable');

    var j;
    for(j = 0; j < table.length; j++){
        switching = true;
        /* Make a loop that will continue until
        no switching has been done: */
        while (switching) {
            // Start by saying: no switching is done:
            switching = false;
            rows = table[j].rows;
            /* Loop through all table rows (except the
            first, which contains table headers): */
            for (i = 1; i < (rows.length - 1); i++) {
                // Start by saying there should be no switching:
                shouldSwitch = false;
                /* Get the two elements you want to compare,
                one from current row and one from the next: */
                x = rows[i].getElementsByTagName("TD")[2];
                y = rows[i + 1].getElementsByTagName("TD")[2];
                // Check if the two rows should switch place:
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
                /* If a switch has been marked, make the switch
                and mark that a switch has been done: */
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    }

}