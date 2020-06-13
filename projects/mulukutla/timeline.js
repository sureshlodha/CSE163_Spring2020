/*
d3.json("schedule.json").then(function(data) {
    console.log(data.people)
    var checkboxes = d3.select(".person-list").selectAll(".person-checkbox")
        .data(data.people)
        .enter()
        .append("li")
        .attr("class", "person-checkbox");

    console.log(checkboxes)
        // append the input field to the checkboxes
    checkboxes.append("input")
        .attr("type", "checkbox")
        // set an attribute countryname
        .attr("name", function(d) {
            console.log("here")
            return d.name;
        })
        // set the id to the country
        .attr("id", function(d) {
            return d.name + '_checkbox';
        })
        .on("change", checkChanged)
        // only check the initial countries which are the BRICS ones
        .filter(function(elem) {
            return elem.active
        })
        .each(function(d) {
            d3.select(this)
                .attr("checked", true)
        })

    // append the text box with the country name too
    checkboxes.append("label")
        .text(function(d) {
            return d.name;
        });
})

// checks the changed boxes
function checkChanged() {
    // finds if the box is checked
    var checked = this.checked;
    if (!checked) {} else {}

}
*/
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

var color = d3.scaleOrdinal();
var schemeColor = d3.scaleOrdinal(d3.schemeCategory10);
var activities = new Set();
var rangeOfColors = [];
var dataset = [];
var width = 900;

// convert time string to milliseconds
function millisecs(time) {
    var parseTime = d3.timeParse("%H:%M");
    var hours = d3.timeFormat("%H");
    var minutes = d3.timeFormat("%M");

    var Time = parseTime(time);
    //console.log(Time)
    return (hours(Time) * 60 * 60 * 1000 + minutes(Time) * 60 * 1000);
    //return Time;
}

var dates = []
d3.json("schedule.json").then(function(data) {
    console.log(data)
    var people = data.people;
    //console.log(people[0].name);
    // go through people to get the names
    people.forEach(function f(p) {
        var data_label;
        var datas = [];
        var group = {};
        var array = [];
        var dailyschedule = p.daily_schedule;
        
        //console.log(dailyschedule.day);
        dailyschedule.forEach(function f(d) { //goes through daily schedule per person
                //console.log(d.schedule);
                //var date = new Date(d.day)
                //console.log(date)
                var day_schedule = d.schedule;
                day_schedule.forEach(function f(s) {
                        //console.log(s.starting_time);
                        var day = new Date(d.day);
                        //console.log(day);
                        var a = [new Date(day.getTime() + millisecs(s.starting_time)), new Date(day.getTime() + millisecs(s.end_time))]; //converts to milliseconds I think
                        //var a = [millisecs(s.starting_time), millisecs(s.end_time)]; //converts to milliseconds I think
                        var times = { "timeRange": a, "val": s.activity };
                        array.push(times);
                    })
                    //console.log(day_schedule)
                //console.log(new Date(d.day))
                dates.push(new Date(d.day))
                //console.log(array)
            })
        data_label = { "label": "", "data": array }; //gets the label
        datas.push(data_label);
            //console.log(p.name);
            //console.log(datas);
        group = { "group": p.name, "data": datas };
        dataset.push(group);
    })
    //console.log(new Date(dates[0].getTime() + 86340000));
    //console.log(dataset)
    //console.log(d3.min(dates));
    //minZoom = d3.min(dates[0]);
    myChart = TimelinesChart()(document.getElementById('myPlot'))
        .data(dataset)
        .zQualitative(true)
        .maxHeight(1000)
        .maxLineHeight(70)
        //.onZoom([dates[0], dates[1]], ['', ''])
        .zoomX([dates[0], new Date(dates[0].getTime() + 86340000)])
        .topMargin(60);
        //.width(2000)
        //.bottomMargin(30)
        //.timeFormat('%H:%M')
        //.xTickFormat(d3.timeFormat("%I:%M %p"));
    //console.log(myChart.getTotalNLines());

})