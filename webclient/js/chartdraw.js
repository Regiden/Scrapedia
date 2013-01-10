// load the core package from the char API
google.load('visualization', '1.0', {'packages': ['table']});

var HiddenGraphCSS = {opacity: 0};
var VisibleGraphCSS = {opacity: 1};
var UlHiddenCSS = {'margin-left': 200, height: 0, opacity: 0};
var UlVisibleCSS = {'margin-left': 0, height: 80, opacity: 1};


var state = -1;
var UL1Visible = false;

/* TOGGLE STUFF
 ============================================================================================================================
 */

$(function () {
    $('#nav ul').css(UlHiddenCSS);
});


function toggleUL1() {
    if (UL1Visible) {
        $('#nav ul').animate(UlHiddenCSS, 300);
        $("#content").animate({height: 0}, 320, null, function () {
            $("#content").empty();
            $("#content").height("auto");
            state = -1;
        });
    } else {
        $('#nav ul').animate(UlVisibleCSS, 300);
    }
    UL1Visible = !UL1Visible;
}

/* DRAW STUFF
 ============================================================================================================================
 */
function callTop20Linked() {
    if (state == 0) {
        return;
    }
    state = 0;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));

    $.ajax({
        url: "php/request.php",
        data: "page=mostlinked",
        success: function (data) {
            if (data) {
                drawTop20Linked(eval(data));
            } else {
                errorMessage();
            }
        }
    });
}
function callTop20Links() {
    if (state == 1) {
        return;
    }
    state = 1;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));

    $.ajax({
        url: "php/request.php",
        data: "page=mostlinks",
        success: function (data, status) {
            if (data) {
                drawTop20Links(eval(data));
            } else {
                errorMessage();
            }

        }
    });
}

function errorMessage() {
    $("#content").empty();
    $("#content").append($('<span >An error occurred. Please try again later.</span>'));
}

function drawTop20Linked(rows) {
    $("#content").empty();
    var container = $('<div class="graphcontainer"></div>');
    container.css(HiddenGraphCSS);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Article');
    data.addColumn('string', 'URL');
    data.addColumn('string', 'Number of Pages linking to this page');

    data.addRows(rows);

    $("#content").append($('<span>Number of most linked articles</span><br><hr>'));
    $("#content").append(container);

    $("#content").append(container);

    var chart = new google.visualization.Table(container[0]);

    function afterDraw() {
        container.animate(VisibleGraphCSS);
    }

    google.visualization.events.addListener(chart, 'ready', afterDraw);
    chart.draw(data, {showRowNumber: true, allowHtml: true});
}
function drawTop20Links(rows) {
    $("#content").empty();
    var container = $('<div class="graphcontainer"></div>');
    container.css(HiddenGraphCSS);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Article');
    data.addColumn('string', 'URL');
    data.addColumn('string', 'Number of Links');

    data.addRows(rows);

    $("#content").append($('<span>Number of articles with most links</span><br><hr>'));
    $("#content").append(container);

    var chart = new google.visualization.Table(container[0]);

    function afterDraw() {
        container.animate(VisibleGraphCSS);
    }

    google.visualization.events.addListener(chart, 'ready', afterDraw);
    chart.draw(data, {showRowNumber: true});
}

function appendNotLinkedList() {
    if (state == 2) {
        return;
    }
    state = 2;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));
    $.ajax({
        url: "php/request.php",
        data: "page=unlinked",
        success: function (data) {
            if (data) {
                $("#content").empty();
                $("#content").append($('<span>List of articles not linked by any other article</span><br><hr>'));
                $("#content").append(data);
            } else {
                errorMessage();
            }

        }
    });
}

function appendNoLinks() {
    if (state == 3) {
        return;
    }
    state = 3;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));
    $.ajax({
        url: "php/request.php",
        data: "page=nolinks",
        success: function (data) {
            if (data) {
                $("#content").empty();
                $("#content").append($('<span>List of Articles with no links</span><br><hr>'));
                $("#content").append(data);
            } else {
                errorMessage();
            }
        }
    });
}
