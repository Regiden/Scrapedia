var PFHiddenCSS = {'margin-left': 200, height: 0, opacity: 0};
var PFVisibleCSS = {'margin-left': 0, height: 80, opacity: 1};

var HiddenCanvasCSS = {opacity: 0};
var VisibleCanvasCSS = {opacity: 1};

var pathState = false;

var globalPathList = null;

$(function () {
    returnHome();
});

function returnHome() {
    pathState = false;
    hideUL1();
    $("#content").empty();
    var container = $('<div class="homeDiv"></div>');
    container.load('home.html', null, function () {
        container.css(HiddenCanvasCSS);
        $("#content").append(container);
        container.animate(VisibleCanvasCSS);
    });
}

function toggleContent() {
    if (pathState) {
        return;
    }
    pathState = true;
    hideUL1(function () {
        $("#content").empty();
        $("#content").append($('<h2>Path Finder</h2>'));
        $("#content").height("auto");
        _createContent();
    });

}

function _createContent() {
    var container = $('<div class="pf_container"></div>');
    container.load('pathfinder.html', null, function () {
        container.css(PFHiddenCSS);
        $("#content").append(container);
        $("#canvas").css(HiddenCanvasCSS);
        $("#checkboxes").css(HiddenCanvasCSS);
        container.animate({'margin-left': 0, height: 170, opacity: 1});
    });

}

function submit() {
    $("#canvas").empty();
    $("#canvas").css(HiddenCanvasCSS);
    $("#checkboxes").empty();
    $("#checkboxes").css(HiddenCanvasCSS);
    $("#wait-canvas").empty();
    $("#wait-canvas").append($('<p class="wait">Please wait...</p>'));

    var start = $("#pf_start").val();
    var target = $("#pf_target").val();
    var data = "json?stitle=" + start + "&dtitle=" + target;

    //  http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/pathfinder/json?stitle=Anime&dtitle=DaWanda

    // swap on Server to this
    /* $.ajax({
     url: "http://ec2-54-246-66-235.eu-west-1.compute.amazonaws.com:8088/pathfinder",
     data: data,
     dataType: "text",
     success: function (data) {

     }
     }); */

    // delete on server

    $.ajax({
        url: "php/request.php",
        data: "page=path",
        dataType: "text",
        success: function (data) {
            var d = eval(decodeURI(data).replace(/\+/g, " "));
            if (d) {
                createCheckboxes(d);
            } else {
                error("Something went wrong while parsing the array.")
            }
        },
        error: function (data, status, error) {
            error(error);
        }
    });

}

function error(text) {
    $("#wait-canvas").empty();
    $("#wait-canvas").append($('<p class="wait">' + text + '</p>'));
}

function createCheckboxes(data) {
    $("#wait-canvas").empty();
    $("#checkboxes").empty();
    var checkedList = parseInput($("#pf_num").val());
    if (largestValue(checkedList) > data.length) {
        error("Some or one value in the input range is larger then the number of paths. Value will be ignored!")
    }

    $("#checkboxes").append('<span>Choose Paths:</span><br>')

    for (var i = 0; i < data.length; i++) {
        var box = $('<input name="' + i + '" class="cb_class" type="checkbox" onclick="updateGraph()">');
        if (isChecked(checkedList, i)) {
            box.attr("checked", 'true');
        }
        $("#checkboxes").append(box);
        if (i % 10 == 9) {
            $("#checkboxes").append($('<span id="spacer"></span>'));
        }
    }
    $(".pf_container").css({height: 'auto'});
    $("#checkboxes").append($('<hr>'))
    $("#checkboxes").animate(VisibleCanvasCSS);

    globalPathList = data;
    updateGraph();
}

function largestValue(list) {
    var val = 0;
    for (var i = 0; i < list.length; i++) {
        if (list[i] > val) {
            val = list[i];
        }
    }
    return val;
}

function isChecked(list, i) {
    for (var j = 0; j < list.length; j++) {
        if (list[j] == i) {
            return true;
        }
    }
}

function updateGraph() {
    var e = $("#checkboxes").children(".cb_class");

    var count = 0;
    var accessList = [];
    for (var i = 0; i < e.length; i++) {
        var obj = $(e[i]);
        if (obj.context.checked) {
            accessList[count++] = i;
        }
    }
    renderGraph(accessList);
}

function parseInput(text) {
    var ranges = text.split(";");
    var values = [];

    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var start;
        var end;

        if (range.indexOf('-') >= 0) {
            range = range.split("-");

            start = parseInt(range[0]);
            end = parseInt(range[1]);
        } else {
            start = parseInt(range);
            end = start;
        }
        for (var j = start - 1; j < end; j++) {
            values.push(j);
        }
    }
    return values;
}

function renderGraph(accessList) {
    $("#canvas").empty();
    var start = $("#pf_start").val();
    var target = $("#pf_target").val();
    var lastObj = null;
    var edgeList = [];

    Math.seedrandom("Scrapedia342354356766784");

    var data = globalPathList;
    var g = new Graph();

    for (var i = 0; i < accessList.length; i++) {
        var bla = data[accessList[i]];
        for (var j = data[accessList[i]].length - 1; j >= 0; j--) {

            var obj = data[accessList[i]][j];
            if (obj) {
                if (obj.name == start) {
                    g.addNode(obj.name, {render: getSpecialRender("Start")})
                } else if (obj.name == target) {
                    g.addNode(obj.name, {render: getSpecialRender("Target")})
                } else {
                    g.addNode(obj.name);
                }
                if (lastObj) {
                    if (!edgeExits(edgeList, obj.name, lastObj.name)) {
                        g.addEdge(obj.name, lastObj.name, { directed: true });
                        edgeList.push({s: obj.name, d: lastObj.name});
                    }
                }
            }
            lastObj = obj;
        }
        lastObj = null;
    }

    var layouter = new Graph.Layout.Spring(g);
    layouter.layout();

    var width = Math.max(count(g) * 100, $("#canvas").width() - 20);
    var height = Math.max(count(g) * 50, 382);

    $("#canvas").animate(VisibleCanvasCSS, 300);

    var renderer = new Graph.Renderer.Raphael('canvas', g, width, height);

    renderer.draw();

}


function getSpecialRender(value) {
    return function (r, node) {
        /* the default node drawing */
        var color = Raphael.getColor();
        var ellipse = r.rect(0, 0, 60, 40).attr({fill: color, stroke: color, "stroke-width": 2});
        /* set DOM node ID */
        ellipse.node.id = node.label || node.id;
        var shape = r.set().
            push(ellipse).
            push(r.text(30, 50, node.label || node.id)).
            push(r.text(30, 20, value));
        return shape;
    }
}

function count(graph) {
    var counter = 0;
    for (var o in graph.nodes) {
        counter++;
    }
    return counter;
}

function edgeExits(list, node1, node2) {
    for (var i = 0; i < list.length; i++) {
        var o = list[i];
        if (o.s == node1 && o.d == node2) {
            return true;
        }
    }
    return false;
}

