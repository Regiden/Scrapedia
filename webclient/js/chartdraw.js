// load the core package from the char API
google.load('visualization', '1.0', {'packages': ['table']});
google.load('visualization', '1.0', {'packages': ['corechart']});

var HiddenGraphCSS = {opacity: 0};
var VisibleGraphCSS = {opacity: 1};
var UlHiddenCSS = {'margin-left': 200, height: 0, opacity: 0};
var UlVisibleCSS = {'margin-left': 0, height: 84, opacity: 1};

var statsState = -1;
var UL1Visible = false;

/* TOGGLE STUFF
 ============================================================================================================================
 */

$(function () {
    $('#nav ul').css(UlHiddenCSS);
    $("#nav ul").hide();
});


function toggleUL1() {
    if (pathState) {
        $("#content").empty();
    }
    if (UL1Visible) {
        $('#nav ul').animate(UlHiddenCSS, 300, function () {
            $("#nav ul").hide();
        });
        fadeContent();
    } else {
        fadeContent()
        $("#nav ul").show();
        $('#nav ul').animate(UlVisibleCSS, 300);
    }
    appendHeader();
    statsState = -1;
    pathState = false;
    UL1Visible = !UL1Visible;
}

function fadeContent(callback) {
    if (callback) {
        $("#content").animate(null, 320, null, callback);
    } else {
        $("#content").empty();
        $("#content").height("auto");
    }
}

function appendHeader() {
     $("#content").append($('<p class="wait">Please choose the statistic you want to watch.</p>'));
}

function hideUL1(callback) {
    if (!UL1Visible) {
        if(callback){
            callback();
        }
        return;
    }
    $('#nav ul').animate(UlHiddenCSS, 300, function () {
        $("#nav ul").hide();
    });
    fadeContent(callback)
    UL1Visible = false;
    statsState = -1;
}

/* DRAW STUFF
 ============================================================================================================================
 */
function callTop20Linked() {
    if (statsState == 0) {
        return;
    }
    statsState = 0;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));

    $.ajax({
        url: "php/request.php",
        data: "page=mostlinked",
        dataType: "text",
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
    if (statsState == 1) {
        return;
    }
    statsState = 1;
    $("#content").empty();
    $("#content").append($('<p class="wait">Please wait...</p>'));

    $.ajax({
        url: "php/request.php",
        data: "page=mostlinks",
        dataType: "text",
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
    chart.draw(data, {showRowNumber: true, allowHtml: true});
}

function appendNotLinkedList() {
    if (statsState == 2) {
        return;
    }
    statsState = 2;
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
    if (statsState == 3) {
        return;
    }
    statsState = 3;
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
