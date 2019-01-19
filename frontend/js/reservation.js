var tbls = [];
var tblMinSeats = [1,1,2,1,1,3,4,4,3];
var tblMaxSeats = [2,2,4,2,2,6,8,8,6];
var tblList = [];
var numTables = 9;

$(document).ready(function(){
    //Prevent previous dates in datepicker
    var input = document.getElementById("dateField");
    var today = new Date();
    var day = today.getDate();
    // Set month to string to add leading 0
    var mon = new String(today.getMonth()+1); //January is 0!
    var yr = today.getFullYear();

    if(mon.length < 2) { mon = "0" + mon; }

    var date = new String( yr + '-' + mon + '-' + day );

    input.disabled = false;
    input.setAttribute('min', date);

    tblList.push({minutes_available: 10, table_id: 0});
    tblList.push({minutes_available: 60, table_id: 1});
    tblList.push({minutes_available: 120, table_id: 3});
    tblList.push({minutes_available: 60, table_id: 4});
    tblList.push({minutes_available: 0, table_id: 7});
    tblList.push({minutes_available: 60, table_id: 8});
    tblList.push({minutes_available: 120, table_id: 9});

    createDropDownMenu();
    createTableList(tblList);
    mangageTableViewer();
});

// Adds the items to the Dropdown menu
function createDropDownMenu() {
    var dropdown = $("#numberSeatsItems");

    for (var i = 1; i < 10; i++) {
        dropdown.append('<a class="dropdown-item" onclick="changeNumberSeats(' + i + ')">' + i + '</a>');
    }
}

// The function that is called when the user selects a value from the dropdown
function changeNumberSeats (seats) {
    $("#numberSeats").html(seats);
    createTableList(tblList);
    mangageTableViewer();
}

function mouseOverHandler(e) {
    var id = e.currentTarget.id;
    colorGreen(id);
}

function mouseOffHandler(e) {
    var id = e.currentTarget.id;
    if (id != selected) removeGreen(id);
}

function colorGreen (tableID) {
    var src = $("#" + tableID).attr("src");
    if (src.indexOf("_green") == -1) {
        $("#" + tableID).attr("src", src.replace(".png", "_green.png"));
    }    
}

function removeGreen (tableID) {
    var src = $("#" + tableID).attr("src").replace("_green", "");
    $("#" + tableID).attr("src", src);
}

function createTableList (tblList) {

    enableAllTables();

    tbls = [];
    var seats = $("#numberSeats").html();

    for (var i = 1; i <= numTables; i++) {
        var tbl = {
            id: i,
            elem: $("#rtb" + i),
            minutes_available: 0,
            free: true,
            minSeats: seats >= tblMinSeats[id],
            maxSeats: seats <= tblMaxSeats[id]
        }

        tbls.push(tbl);
    }    

    for(table of tblList) {
        var id = table.table_id - 1;
        if(!tbls[id]) continue;
        tbls[id].minutes_available = table.minutes_available;
        tbls[id].free = table.minutes_available >= 60;
        tbls[id].minSeats = seats >= tblMinSeats[id];
        tbls[id].maxSeats = seats <= tblMaxSeats[id];
    }

    console.log(tbls);
}

function mangageTableViewer () {
    for (table of tbls) {
        if (!table.free || !(table.maxSeats && table.minSeats)) {
            table.elem.fadeTo(500, 0.3);
            table.elem.unbind('mouseenter mouseleave click');
            table.elem.attr("title", "This table is not free");
            if (!table.minSeats) table.elem.attr("title", "Please reserve more seats for this table");
        }        
    }
}

function enableAllTables() {
    $(".reserveTable").fadeTo(800, 1);    
    $(".reserveTable").bind("mouseenter", mouseOverHandler);
    $(".reserveTable").bind("mouseleave", mouseOffHandler);
    $(".reserveTable").bind("click", clickHandler);
    selected = null;
    for (var i = 1; i < 10; i++) {
        removeGreen("rtb" + i);
    }
}

function clickHandler(e) {
    for (table of tbls) {
        removeGreen("rtb" + table.id);
    }

    selected = e.currentTarget.id;
    colorGreen(selected);
    $("#personalDataInputContainer").slideDown("slow", function () {
        $("#reserveButton").addClass("btn-success");
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#nameInput").offset().top - 100
        }, 1000);
        $("#nameInput").focus();
    });
    console.log("Click on: " + selected);
}