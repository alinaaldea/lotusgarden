var tbls = [];
var tblMinSeats = [1,1,2,1,1,3,4,4,3];
var tblMaxSeats = [2,2,4,2,2,6,8,8,6];
var numTables = 9;
var seats = 1;

$(document).ready(function(){
    createDropDownMenu();
    $("#reserveButton").on("click", reserveButtonHandler);
    disableAllTables();
});

// Adds the items to the Dropdown menu
function createDropDownMenu() {
    var dropdown = $("#numberSeatsItems");

    for (var i = 1; i < 9; i++) {
        dropdown.append('<a class="dropdown-item" onclick="changeNumberSeats(' + i + ')">' + i + '</a>');
    }
}

// The function that is called when the user selects a value from the dropdown
function changeNumberSeats (numseats) {
    $("#numberSeats").html(numseats);
    seats = numseats;
    selected = null;

    if (timePicked) {
        getReservedFromDb();
    }
}

function mouseOverHandler(e) {
    var id = e.currentTarget.id;
    if ( (tbls[id.replace("rtb","")-1].minutes_available) < 120) colorYellow(id);
    else colorGreen(id);
}

function mouseOffHandler(e) {
    var id = e.currentTarget.id;
    if (id != selected) removeGreen(id);
}

function colorGreen (tableID) {
    var src = $("#" + tableID).attr("src");
    if (src.indexOf("_green") == -1 && src.indexOf("_yellow") == -1 ) {
        $("#" + tableID).attr("src", src.replace(".png", "_green.png"));
    }    
}

function colorYellow (tableID) {
    var src = $("#" + tableID).attr("src");
    if (src.indexOf("_green") == -1 && src.indexOf("_yellow") == -1 ) {
        $("#" + tableID).attr("src", src.replace(".png", "_yellow.png"));
    }    
}

function removeGreen (tableID) {
    var src = $("#" + tableID).attr("src");
    src = src.replace("_green", "");
    src = src.replace("_yellow", "");
    $("#" + tableID).attr("src", src);
}

function createTableList (tblList) {

    enableAllTables();

    tbls = [];

    for (var i = 1; i <= numTables; i++) {
        var tbl = {
            id: i,
            elem: $("#rtb" + i),
            minutes_available: 120,
            free: true,
            minSeats: seats >= tblMinSeats[i-1],
            maxSeats: seats <= tblMaxSeats[i-1]
        }
        tbls.push(tbl);
    }    

    for(table of tblList) {
        
        var id = table.table_id - 1;
        if(!tbls[id]) continue;
        tbls[id].minutes_available = table.minutes_available;
        tbls[id].free = table.minutes_available >= 60;
        
    }

    mangageTableViewer();
}

function getReservedFromDb () {
    var dateTime = selectedDate + " " + timePicked + "Z";
    console.log("Fetch reservations for "+ dateTime);

    $.post("/reservations/tables/", {
        dt: dateTime
    },
    function (data) {
        console.log(data);
        createTableList(data);
    });
}

// Gray out all the tables that are not to be reserved
function mangageTableViewer () {
    for (table of tbls) {
        table.elem.attr("title", "");
        if (!table.free || !(table.maxSeats && table.minSeats)) {
            table.elem.fadeTo(500, 0.3);
            table.elem.unbind('mouseenter mouseleave click');
            table.elem.attr("title", "This table is not available");
            if (table.free && !table.minSeats) table.elem.attr("title", "Please reserve more seats for this table");
            if (table.free && !table.maxSeats) table.elem.attr("title", "This table has not enough seats");
        } else {
            if (table.minutes_available < 120) {
                table.elem.attr("title", "This is only available for " + table.minutes_available + " Minutes!");
            }
        }
    }
}

function enableAllTables () {
    $(".reserveTable").unbind("click");
    $(".reserveTable").fadeTo(800, 1);    
    $(".reserveTable").bind("mouseenter", mouseOverHandler);
    $(".reserveTable").bind("mouseleave", mouseOffHandler);
    $(".reserveTable").bind("click", clickHandler);
    selected = null;
    $("#reserveButton").removeClass("btn-success");
    $("#personalDataInputContainer").slideUp("fast");
    for (var i = 1; i < 10; i++) {
        removeGreen("rtb" + i);
    }
}

function disableAllTables () {
    $(".reserveTable").fadeTo(100, 0.2);
    $(".reserveTable").bind("click", function() {
        alert("Please select a time first!");
    });
}

function clickHandler(e) {
    for (table of tbls) {
        removeGreen("rtb" + table.id);
    }

    selected = e.currentTarget.id;
    colorGreen(selected);
    $("#personalDataInputContainer").slideDown("slow", function () {
        $("#reserveButton").addClass("btn-success");
        $("#nameInput").focus();
    });
    console.log("Click on: " + selected);
}

function refreshTableView () {
    getReservedFromDb();
}

function reserveButtonHandler () {
    if (!$("#reserveButton").hasClass('btn-success')) return false;

    var reservation = {
        name: $("#nameInput").val(),
        email: $("#mailInput").val(),
        phone_number: $("#phoneInput").val(),
        start_dateTime: selectedDate + " " + timePicked + "Z",
        end_dateTime: calcEndTime(selected.replace("rtb", "")),
        table_id: selected.replace("rtb", ""),
        number_of_people: seats
    }
    $.post("/reservations/add/", reservation, function (data, err) {
        console.log(err, data);
        if (data) {
            alert("Reservation was SUCCESSFULL!");
            $("#reserveButton").removeClass("btn-success");
            $("#personalDataInputContainer").slideUp("fast");
            disableAllTables();
        }
    });
}

function calcEndTime (tableID) {
    var time = timePicked;
    var available = tbls[tableID-1].minutes_available;
    var endTime = time.split(":");

    endTime[0] = parseInt(endTime[0]) + Math.floor(available / 60);
    endTime[1] = (parseInt(endTime[1]) + available) % 60

    if (endTime[1].toString().length == 1) endTime[1] = "0" + endTime[1];

    var endDateTime = selectedDate + " " + endTime[0] + ":" + endTime[1] + "Z";

    return (endDateTime);
}