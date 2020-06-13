//Sources
//Stacked area chart example: https://www.d3-graph-gallery.com/graph/stackedarea_template.html

// set the dimensions and margins of the graph
var margin = {
        top: 60,
        right: 230,
        bottom: 50,
        left: 50
    },
    width = 1300 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var dataviz = d3.select("#my_dataviz")
var container = dataviz.append("div")
    .style("display", "flex")
    .style("flex-direction", "row")



var selection = container.append("div")
var svg_container = container.append("div")

d3.json("schedule.json").then(function(data) {
    names = data.people.map(function(d) {
        return { "name": d.name, "dem": d.dem }
    })

    createSelection(selection, svg_container, names)
})

createStackedChart(svg_container, 0)

function createStackedChart(svg_container, index) {
    var svg = svg_container
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.json("schedule.json").then(function(data) {
        console.log(data)
        names = data.people.map(function(d) {
            return d.name
        })

        console.log(names)
        console.log(data.people[index])
        personID = index

        person = data.people[index]

        daily_schedule = person.daily_schedule

        convert_time_to_num = {}

        activity_percetiles = person.daily_schedule[index].schedule.map(function(d) {
            init_struct = {
                "time": d.starting_time
            }
            data.activities.map(function(e) {
                init_struct[e] = 0
            })
            return init_struct
        })
        console.log(activity_percetiles)
        num_days = 0

        person.daily_schedule.map(function() {
            num_days++
        })

        person.daily_schedule.map(function(d) {
            //console.log(d)

            d.schedule.map(function(e, i) {
                convert_time_to_num[e.starting_time] = i
                activity_percetiles[i][e.activity] += 1 / num_days
            })
        })
        console.log(num_days)
        console.log(activity_percetiles)
        console.log(convert_time_to_num)

        //////////
        // GENERAL //
        //////////

        // List of groups = header of the csv files
        var keys = data.activities

        console.log(keys)

        // color palette
        var color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeTableau10);

        //stack the data?
        var stackedData = d3.stack()
            .keys(keys)
            (activity_percetiles)
        console.log(stackedData)



        //////////
        // AXIS //
        //////////

        // Add X axis
        var x = d3.scaleLinear()
            .domain(d3.extent(person.daily_schedule[index].schedule, function(d) {
                return convert_time_to_num[d.starting_time];
            }))
            .range([0, width]);
        console.log(x(convert_time_to_num["02:00"]))

        var xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(20).tickFormat(function(d) { return data.time_conversion[d + 1] }))

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40)
            .text("Time (hour)");

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", -400)
            .attr("y", -40)
            .attr("transform", "rotate(-90)")
            .text("Percent time spent in various activities")
            .attr("text-anchor", "start")

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d * 100 + "%" }))



        //////////
        // BRUSHING AND CHART //
        //////////

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        var brush = d3.brushX() // Add the brush feature using the d3.brush function
            .extent([
                [0, 0],
                [width, height]
            ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the scatter variable: where both the circles and the brush take place
        var areaChart = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Area generator
        var area = d3.area()
            .curve(d3.curveBasisOpen)
            .x(function(d) {
                return x(convert_time_to_num[d.data.time]);
            })
            .y0(function(d) {
                return y(d[0]);
            })
            .y1(function(d) {
                return y(d[1]);
            })

        // Show the areas
        areaChart
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "myArea " + d.key.replace(/ /g, "").replace('\'', "")
            })
            .style("fill", function(d) {
                return color(d.key);
            })
            .attr("d", area)
            .on("mouseover", function() {
                console.log("here")
            })

        // Add the brushing
        areaChart
            .append("g")
            .attr("class", "brush")
            .call(brush);

        var idleTimeout

        function idled() {
            idleTimeout = null;
        }

        // A function that update the chart for given boundaries
        function updateChart() {

            extent = d3.event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain(d3.extent(person.daily_schedule[0].schedule, function(d) {
                    return convert_time_to_num[d.starting_time];
                }))
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])])
                areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and area position
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5).tickFormat(function(d) { return data.time_conversion[d + 1] }))
            areaChart
                .selectAll("path")
                .transition().duration(1000)
                .attr("d", area)
        }



        //////////
        // HIGHLIGHT GROUP //
        //////////

        // What to do when one group is hovered
        var highlight = function(d) {
            console.log(d)
                // reduce opacity of all groups
            d3.selectAll(".myArea").style("opacity", .1)
                // expect the one that is hovered
            d3.select("." + d.replace(/ /g, "").replace('\'', "")).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function(d) {
            d3.selectAll(".myArea").style("opacity", 1)
        }



        //////////
        // LEGEND //
        //////////

        // Add one dot in the legend for each name.
        var size = 20
        svg.selectAll("myrect")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", width + 5)
            .attr("y", function(d, i) {
                return 10 + i * (size + 5)
            }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d) {
                return color(d)
            })
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", width + size * 1.2 + 5)
            .attr("y", function(d, i) {
                return 10 + i * (size + 5) + (size / 2)
            }) // 100 is where the first dot appears. 25 is the distance between dots
            //.style("fill", function(d) {return color(d)})
            .text(function(d) {
                return d
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

    })
}

function createSelection(container, svg_container, humans) {
    container.attr("class", "options-container")
    var selection = container.selectAll("div").append("div").attr("class", "dropdown")
    var names = humans.map(function(human) { return human.name })

    selection.data(humans).enter()
        .append("button")
        .attr("class", "dropbtn")
        .attr("id", function(human) { return human.name + "-button" })
        .text(function(human) { return human.name })
        .attr("title", function(human) { return human.dem })
        .on("click", function(human) {
            d3.select("#" + human.name + "-button").style("background-color", "green")
            container.selectAll("button").filter(function(d) { return d.name != human.name }).style("background-color", "#3498DB")
            svg_container.select("svg").remove()

            createStackedChart(svg_container, names.indexOf(human.name))
        })
        .filter(function(human) { return names.indexOf(human.name) == 0 })
        .style("background-color", "green");

    selection.append("div").attr("id", "myDropdown").attr("class", "dropdown-content").append()
}