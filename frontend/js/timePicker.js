var tp = $("#timePickerScrollable");
var x = 0;

function createTimeSlot(h, m) {
    var slot = "";
    if (m == "00") slot += '<div class="vl"></div>';
    slot += '<div class="timePickerItem" id=' + h + ':' + m + '>';
    slot += '<span><b>' + h + '</b></span><br>';
    slot += '<span><small>:' + m + '</small></span>';
    return slot;
}

function h (h) {
    if (h.toString().length == 1) return "0" + h;
    return h; 
}

$(document).ready(function(){

    tp.mousemove(mouseMoveHandler);

    for (var i = 12; i < 24; i++) {
        for (var j = 00; j < 60; j += 15) {
            tp.append(createTimeSlot(h(i), h(j)));
        }        
    }

    $(".timePickerItem").on('click', timeSlotClickHandler);

    $("#future").on("click", futureClick);
    $("#past").on("click", pastClick);

});

function mouseMoveHandler(e){
    var offset = $(this).offset();
    x = e.pageX- offset.left;
    var distR = $(this).outerWidth() - e.pageX - offset.left;
    tp.css("transform", "translate(" + x + ")");
}

function futureClick (e) {
    tp.animate({
        left: "-=160"
    }, 300, function() {
        if (parseInt(tp.css('left'), 10) > 20) tp.css('left', '20px');
        console.log(tp.css('left'))
    });
}

function pastClick (e) {
    tp.animate({
        left: "+=160"
    }, 300, function() {
        if (parseInt(tp.css('left'), 10) > 20) tp.css('left', '20px');
        console.log(tp.css('left'))
    });
}

function timeSlotClickHandler (e) {
    console.log(e.currentTarget.id);
}