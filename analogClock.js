/**
 * Created by desktop on 6/4/2015.
 */

// Get the time
var fields;

fields = function() {
    var currentTime, hour, minute, second;

    currentTime = new Date();
    second = currentTime.getSeconds();
    minute = currentTime.getMinutes();
    hour = currentTime.getHours() + minute / 60;

    return data = [
        {
            "unit": "seconds",
            "numeric": second
        } , {
            "unit": "minutes",
            "numeric": minute
        } , {
            "unit": "hours",
            "numeric": hour
        }
    ];
};

var calculateAngle;

calculateAngle = function(d) {
    var result = d[0].numeric;
    result.concat(d[1].numeric);
    result.concat(d[2].numeric);
}


// Scaling
var width, height, offSetX, offSetY, pi, scaleSecs, scaleHours;
width = 1500;
height = 1500;
offSetX = 300;
offSetY = 200;

pi = Math.PI;
scaleSecs = d3.scale.linear().domain([0, 59 + 999/1000]).range([0, 2 * pi]);
scaleMins = d3.scale.linear().domain([0, 59 + 59/60]).range([0, 2 * pi]);
scaleHours = d3.scale.linear().domain([0, 11 + 59/60]).range([0, 2 * pi]);

var hourScale = d3.scale.linear()
    .range([0,330])
    .domain([0,11]);


// SVG
var vis, clockGroup;

vis = d3.selectAll(".chart")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

clockGroup = vis.append("svg:g")
    .attr("transform", "translate(" + offSetX + "," + offSetY + ")");

clockGroup.append("svg:circle")
    .attr("r", 160).attr("fill", "none")
    .attr("class", "clock outercircle")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

clockGroup.append("svg:circle")
    .attr("r", 150).attr("fill", "none")
    .attr("class", "clock outercircle2")
    .attr("stroke", "black")
    .attr("stroke-width", 2);

clockGroup.append("svg:circle")
    .attr("r", 8)
    .attr("fill", "black")
    .attr("class", "clock innercircle");

// Label
clockGroup.selectAll(".hour-label")
    .data(d3.range(1, 13))
        .enter()
        .append('svg:text')
        .attr('class', 'clock labelText')
        .attr('text-anchor', 'middle')
        .attr('x', function(d) {
            return (170 * Math.sin(scaleHours(d % 12)));
        })
        .attr('y',function(d){
            return -(170 * Math.cos(scaleHours(d % 12))) + 5;
        })
        .text(function(d){
            return d;
        });

clockGroup.selectAll(".hour-tick")
    .data(d3.range(1, 61, 5))
        .enter()
        .append('svg:line')
        .attr('class', 'clock labelTick')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 160)
        .attr('y2', 100)
        .attr('transform',function(d){
            return 'rotate(' + hourScale(d) + ')';
        });

// Render
var render;

render = function(data) {
    var hourArc, minuteArc, secondArc;

    clockGroup.selectAll(".clockhand").remove();
    clockGroup.selectAll(".digitalTime").remove();
    clockGroup.selectAll(".angleDiff").remove();



    secondArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(140)
        .startAngle(function(d) {
            return scaleSecs(d.numeric);
        })
        .endAngle(function(d) {
            return scaleSecs(d.numeric);
        });

    minuteArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(140)
        .startAngle(function(d) {
            return scaleMins(d.numeric);
        })
        .endAngle(function(d) {
            return scaleMins(d.numeric);
        })

    hourArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(100)
        .startAngle(function(d) {
            return scaleHours(d.numeric % 12);
        })
        .endAngle(function(d) {
            return scaleHours(d.numeric % 12);
        });

    clockGroup.selectAll(".clockhand")
        .data(data)
        .enter()
        .append("svg:path")
        .attr("d", function(d) {
            if (d.unit === "seconds") {
                return secondArc(d);
            } else if (d.unit === "minutes") {
                return minuteArc(d);
            } else if (d.unit === "hours") {
                return hourArc(d);
            }
        })
        .attr("class", "clockhand")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) {
            if (d.unit === "seconds") {
                return 2;
            } else if (d.unit === "minutes") {
                return 3;
            } else if (d.unit === "hours") {
                return 3;
            }
        })
        .attr("fill", "none");

    clockGroup.selectAll(".digitalTime")
        .data(data)
        .enter()
        .append("svg:text")
        .attr("class", "digitalTime")
        .attr("x", -55)
        .attr("y", 50)
        .text(function() {

            digitSec = String(data[0].numeric);
            if(data[0].numeric < 10) {
                digitSec = "0".concat(digitSec);
            }
            digitMinute = String(data[1].numeric);
            if(data[1].numeric < 10) {
                digitMinute = "0".concat(digitMinute);
            }
            digitHour = String(Math.floor(data[2].numeric));
            if(data[2].numeric < 10) {
                digitHour = "0".concat(digitHour);
            }
            return digitHour.concat(":" + digitMinute + ":" + digitSec);
        });

    clockGroup.selectAll(".angleDiff")
        .data(data)
        .enter()
        .append("svg:text")
        .attr("class", "digitalTime")
        .attr("x", 150)
        .attr("y", 150)
        .text(function() {
            var second_degrees = (scaleSecs(data[0].numeric) * 180)/Math.PI;
            var minute_degrees = (scaleMins(data[1].numeric) * 180)/Math.PI;
            return "Between Second & Minutes: " + diffAngleResult(minute_degrees, second_degrees)  + "\xB0";
        });

    clockGroup.selectAll(".angleDiff")
        .data(data)
        .enter()
        .append("svg:text")
        .attr("class", "digitalTime")
        .attr("x", 150)
        .attr("y", 200)
        .text(function() {
            var second_degrees = (scaleSecs(data[0].numeric) * 180)/Math.PI;
            var hour_degrees = (scaleHours(data[2].numeric) * 180)/Math.PI;
            return "Between Second & Hours: " + diffAngleResult(hour_degrees, second_degrees)  + "\xB0";
        });


    clockGroup.selectAll(".angleDiff")
        .data(data)
        .enter()
        .append("svg:text")
        .attr("class", "digitalTime")
        .attr("x", 150)
        .attr("y", 250)
        .text(function() {
            var minute_degrees = (scaleMins(data[1].numeric) * 180)/Math.PI;
            var hour_degrees = (scaleHours(data[2].numeric) * 180)/Math.PI;
            return "Between Hours & Minutes: " + diffAngleResult(minute_degrees, hour_degrees)  + "\xB0";
        });

};

setInterval (function() {
    var data;
    data = fields();
    return render(data);
}, 1000);


var diffAngleResult = function(degree1, degree2) {

    var result = "";

    if ( degree1 > degree2){
        result = degree1 - degree2;
    }  else {
        result = degree2 - degree1;
    }

    if(result > 180) {
        result = 360 - result;
    }

    return result.toFixed(2);
};