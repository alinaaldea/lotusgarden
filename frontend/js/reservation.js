var tbl = [];
var tblList = [];
var selected;

$(document).ready(function(){
    tblList.push({minutes_available: 10, table_id: 0});
    tblList.push({minutes_available: 60, table_id: 1});
    tblList.push({minutes_available: 120, table_id: 2});
    tblList.push({minutes_available: 10, table_id: 3});
    tblList.push({minutes_available: 60, table_id: 4});
    tblList.push({minutes_available: 120, table_id: 5});

    createTablelist(tblList);
});

function mouseOverHandler(e) {
    var id = e.currentTarget.id;
    if (id != selected) colorGreen(id);
}

function mouseOffHandler(e) {
    var id = e.currentTarget.id;
    if (id != selected) removeGreen(id);
}

function colorGreen (tableID) {
    var src = $("#" + tableID).attr("src").replace(".png", "_green.png");
    $("#" + tableID).attr("src", src);
}

function removeGreen (tableID) {
    var src = $("#" + tableID).attr("src").replace("_green", "");
    $("#" + tableID).attr("src", src);
}

function clickHandler(e) {
    for (var i = 1; i < 10; i++) {
        removeGreen("rtb" + i);
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

function createTablelist (dbList) {
    disableAllTables();
    tbl = [];
    for (var i = 0; i < 10; i++){

        var dbTbl = null;
        for (var j = 0; j < dbList.length; j++) {
            if(dbList[j].table_id == i) {
                dbTbl = dbList[j];
                break;
            }
        }

        console.log(dbTbl);
        var htmlID = i + 1;
        tbl.push($("#rtb" + htmlID));
        if(dbTbl) {
            if(dbTbl.minutes_available < 60) {
                // Table not free
                tbl[i].fadeTo(1500, 0.3);
                continue;
            }
            tbl[i].hover(mouseOverHandler, mouseOffHandler);
            tbl[i].fadeTo(1500, 1);
            tbl[i].click(clickHandler);
            tbl[i].css({"cursor": "pointer"});
        } else {
            tbl[i].unbind('mouseenter, mouseleave, click');
        }
        
    }
}

function disableAllTables() {
    $(".reserveTable").fadeTo(800, 0.3);
}
