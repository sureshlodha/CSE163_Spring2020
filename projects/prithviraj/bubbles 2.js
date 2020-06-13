//https://namrathaprithviraj.github.io/EnhancementProject/

//Original: https://github.com/gautam0826/CMPS-165-Project

//Define Margin
var margin = {left: 80, right: 440, top: 90, bottom: 50 }, 
    width = 1200 - margin.left -margin.right,
    height = 500 - margin.top - margin.bottom;

//Define Color
var colors = d3.scaleOrdinal()
  .domain(["Mideast", "Great Lakes", "Southwest", "Southeast", "Far West", "Plains", "Rocky Mountain", "New England"])
  .range(d3.schemeCategory10);

			var color_1 = d3.scaleSqrt()
                                .domain([0,750, 1500, 3000])
                                .range(d3.schemeReds[5]);
            var color_2 = d3.scaleLinear()
                                .domain([.04, .08, .12, .16])
                                .range(d3.schemeBlues[5]);
            var formatComma = d3.format(",");

//Define SVG
var svg_a = d3.select("div#chart")
    .append("svg")
    .attr("align", "left")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //main has the clipped rectangle created above;

//Define clipping region 
svg_a.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr('x', 0)
    .attr('y', 0)
    .attr("width", width)
    .attr("height", height);

const main = svg_a.append('g')
      	.attr('class', 'main')
      	.attr('clip-path', 'url(#clip)'); //main has the clipped rectangle created above      
    

//
svg_a.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(20,4)");

//Define Scales   
//Teacher wanted a log scale...
var xScale = d3.scaleSqrt()
    .domain([0,3200])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([.04, 0.16])
    .range([height, 0]);

//Define Axis
var xAxis = d3.axisBottom(xScale).tickPadding(2);
var yAxis = d3.axisLeft(yScale).tickPadding(2);

        
//Define Tooltip here
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var year = 1990;

function circleSelected(){
    var tempvaluecircleselection = 0;
    d3.selectAll(".dot").each( function(d, i){
        var elt = d3.select(this);
        var cx = elt.attr("cx")
        if (cx != null){
                //console.log(elt)
                var opacity = elt.style("opacity")
                //console.log(opacity)
                if (opacity != 0.7) {
                    tempvaluecircleselection++;
                }
        }
        //console.log(elt.attr("opacity") > 0)
        });
    return (tempvaluecircleselection != 0);
};

                function circleSelected2(){
                        var tempvaluecircleselection = 0;
                    d3.selectAll(".dot").each( function(d, i){
                        var elt = d3.select(this);
                        var cx = elt.attr("cx")
                        if (cx != null){
                            //console.log(elt)
                            var opacity = elt.style("opacity")
                            console.log(opacity)
                            if (opacity != 0.1) {
                                tempvaluecircleselection++;
                            }
                        }
                        //console.log(elt.attr("opacity") > 0)
                    });
                    return (tempvaluecircleselection != 0);
                };
d3.csv("Data.csv").then(function(data,error){
    if (error) throw error;
    console.log(data)
    
    
    

    // Define domain for xScale and yScale
    //yScale.domain([.7*d3.min(data, function(d) {return d["Pollutant 1990"]; }),2.9*d3.max(data, function(d) {return d["Pollutant 1990"]; })]);
    var tipMouseover = function(d) {
        //console.log(d);

        var MSA = "MSA: "
        var PV = "O3 concentration: "
        var POP = "Population: "
        var PD = "Population Density: "
        var html  = MSA.bold() + d["Core Based Statistical Area"] + "<br>" + PV.bold() + d["Pollutant " + year] + "<br>" + PD.bold() + 
            parseFloat(d["Density " + year]).toFixed(0) + "<br>" + POP.bold() + formatComma(d["Population " + year]);
        tooltip.html(html)
//            .style("left", (360) + "px")
//            .style("top", (120) + "px")
                .style("left", (d3.event.pageX + 10) + "px") //position the tooltip on mouse cursor
                .style("top", (d3.event.pageY - 15) + "px") //position the tooltip on mouse cursor
            //.style("background-color", colors(d.country))
            .transition()
            .duration(200) // ms
            .style("opacity", .9) // started as 0!            

            //d3.selectAll(".dot")
            //    .style("opacity", 0.1);
            //d3.select(this)
            //    .style("opacity", 1);    

    };

    var zoom = d3.zoom()
      .scaleExtent([1, 2]) //changed from 5 to 2 //Namratha Prithviraj
      .on("zoom", zoomed);
    
    function zoomed() {
        var new_x_scale = d3.event.transform.rescaleX(xScale);
        var new_y_scale = d3.event.transform.rescaleY(yScale);
//      console.log(d3.event.transform)
        svg_a.select(".x.axis").call(xAxis.scale(new_x_scale));
        svg_a.select(".y.axis").call(yAxis.scale(new_y_scale));
        svg_a.selectAll(".dot")
        //.attr("r", function(d) { return Math.sqrt(d["Population 1990"])/75; })
        .attr("cx", function(d) {return new_x_scale(d["Density " + year]);})
        .attr("cy", function(d) {return new_y_scale(d["Pollutant " + year]);})
        .attr("transform", d3.event.transform)
};
    
    /////////////////////////////////////////////////
    //Added by Namratha Prithviraj
    //https://bl.ocks.org/mbostock/db6b4335bf1662b413e7968910104f0f/e59ab9526e02ec7827aa7420b0f02f9bcf960c7da
    //when the reset button is hit, the zoom is reset to original state
    d3.select("button")
    .on("click", function(){
        console.log("reset")
        svg.transition()
      .duration(1500)
      .call(zoom.transform, d3.zoomIdentity); //change to original zoom
    });
    
    /////////////////////////////////////////////////

    //append zoom area
    main.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom);

    var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
        //if(!clicked){
            //d3.selectAll(".dot")
            //    .style("opacity", .7);
        //}
        
    };
    
    var tipMousemove = function(d) { 
                d3.select('.tooltip')
                .style('left', (d3.event.pageX) + 'px') //position the tooltip on mouse cursor
                .style('top', d3.event.pageY + 'px') //position the tooltip on mouse cursor
    };
       
    var click = function(d){
        console.log(this)
        if (!circleSelected()) {
                d3.selectAll(".dot")
                    .style("opacity", 0.1);
            d3.select(this)
                .style("opacity", 1);
            
            //////////////////////////////////////////////////////////
            //Added by Namratha Prithviraj
                
                console.log("here");
            
                //if dot is selected, need to select on the maps
                
                
                var id1 = "1_" + d["Core Based Statistical Area"]; //get ids of the MSA on map
                var id2 = "2_" + d["Core Based Statistical Area"];
                var elt1 = document.getElementById(id1);
                var elt2 = document.getElementById(id2);

                //d.properties.selected = !d.properties.selected;

                //console.log("id " + this.id);
                //help from https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
                var id = "1" + this.id.substr(1, this.id.length);
                console.log("pathId " + id);
                //id[0] = '2';
                //console.log(id);
                var elt = document.getElementById(id);
                //console.log(elt);

                
                d3.select("path#\\3"+id1).style("fill", "yellow"); //fill MSA on both maps with yellow
                d3.select("path#\\3"+id2).style("fill", "yellow");
                    //console.log("this " + this);
                d3.select(elt1).style("fill", "yellow");
                d3.select(elt2).style("fill", "yellow");
                
                
                
                //////////////////////////////////////////////////////////
            
            
        }
        else{
            if(d3.select(this).style("opacity") == 1){
                d3.select(this)
                .style("opacity", .1);
                if (!circleSelected2()){
                                    d3.selectAll(".dot")
                    .style("opacity", 0.7);
                    
                    
                    //////////////////////////////////////////////////////////
                    //Added by Namratha Prithviraj
                    
                    //if dot is unselected, then unselect on the map
                    
                    console.log("here");
                    
                    var id1 = "1_" + d["Core Based Statistical Area"];
                    var id2 = "2_" + d["Core Based Statistical Area"];
                    var elt1 = document.getElementById(id1);
                    var elt2 = document.getElementById(id2);
                    
                    
                    d3.select("path#\\3"+id1).style("fill", function(d){ //change the color back to original color
                        var value_2 = d.properties["Pollutant " + year];
                        return color_2(value_2);
                    });
                    d3.select(elt1).style("fill", function(d){
                        var value_1 = d.properties["Density " + year];
                        return color_1(value_1);
                    });

                    d3.select(elt2).style("fill", function(d){ 
                        var value_2 = d.properties["Pollutant " + year];
                        return color_2(value_2);
                    });
                    
                    //////////////////////////////////////////////////////////
                    
                }
            }
            else{
                d3.select(this)
                .style("opacity", 1);
                
                
            }
        }
    }
    
    function order(a, b) {
        return +b["Population " + year] - +a["Population " + year];
    }
    
    //Draw Scatterplot
    main.selectAll(".dot")        
        .data(data.sort(order))
        .enter().append("circle")
        .style("opacity", .7)
        .attr("class", "dot")
        .attr("id", function(d) {
            return "d_" + d.MSA_GEOID;
        })
        //.data(data.filter(function(d){return +d["Population 1990"] < 1000000;}))
        .attr("msanum", function (d) { return d["MSA GEOID"]; })
        .attr("region", function (d) { return d["region"].split(" ").join(""); })
        .attr("clicked", 0)
        .attr("r", function(d) { return Math.sqrt(d["Population " + year])/75; })//Math.pow(d["Population " + val], (1/3))/5
        .attr("cx", function(d) {return xScale(d["Density " + year]);})
        .attr("cy", function(d) {return yScale(d["Pollutant " + year]);})
        .style("fill", function (d) { return colors(d["region"]); })
        .attr("clip-path", "url(#clip)")        
        .on("mouseover", tipMouseover)
        .on("mouseout", tipMouseout)
        .on("mousemove", tipMousemove)
        .on("click", click);
 
    //x-axis
    svg_a.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 35)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Population Density (Population per Sq. mile)");

    //Y-axis
    svg_a.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -85)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("O3 Concentration (Parts per million)");
    
    //http://d3-legend.susielu.com/#color-ordinal
    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(130)())
        .shapePadding(4)
        .cellFilter(function(d){ return d.label !== "" })
        .scale(colors);

    svg_a.select(".legendOrdinal")
        .call(legendOrdinal);
        
})

            var g = svg_a.append("g")
                .attr("class", "legendThreshold1")
                .attr("transform", "translate(" + (width + margin.left+30) + "," + (margin.top - 20) + ")");
                g.append("text")
                .attr("class", "caption")
                .attr("x", 0)
                .attr("y", -20)
                .attr("font-weight", "bold")
                .text("Population Density")
                g.append("text")
                .attr("x", 0)
                .attr("y", -8)
                .text("(per sq mile)");
            
            var g = svg_a.append("g")
                .attr("class", "legendThreshold2")
                .attr("transform", "translate(" + (width + margin.left+30) + "," + (margin.top + 220) + ")");
                g.append("text")
                .attr("class", "caption")
                .attr("x", 0)
                .attr("y", -20)
                .attr("font-weight", "bold")
                .text("O3 Concentration")
                g.append("text")
                .attr("x", 0)
                .attr("y", -8)
                .text("(parts per million)");

            var legend = d3.legendColor()
//                .labels(function (d) { return labels[d.i]; })
            .cells(6)
                .shapePadding(4)
                .labelFormat(d3.format(","))
                .scale(color_1);
                svg_a.select(".legendThreshold1")
                .call(legend);
            var legend_2 = d3.legendColor()
//                .labels(function (d) { return labels[d.i]; })
            .cells(5)
                .shapePadding(4)
                .labelFormat(d3.format(".2f"))
                .scale(color_2);
                svg_a.select(".legendThreshold2")
                .call(legend_2);

//https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
var slider2 = d3.sliderHorizontal()
    .min(1990)
    .max(2010)
    .step(1)
    .width(700)
    .tickFormat(d3.format("d"))
    .on('onchange', val => {
        year = +val;
        d3.select("p#value2").text(val);
        var tipMouseover = function(d) {
            //Trying to decrease opacity of other dots when hovering
            //https://stackoverflow.com/questions/39564878/opacity-update-on-all-d3-svg-circles-except-for-the-class-hovered
            //d3.selectAll(".dot")
            //    .style("opacity", 0.1);
            //d3.select(this)
            //    .style("opacity", 1);  
            
            //console.log(d);
            var MSA = "MSA: "
        var PV = "O3 concentration: "
        var POP = "Population: "
        var PD = "Population Density: "
        var html  = MSA.bold() + d["Core Based Statistical Area"] + "<br>" + PV.bold() + d["Pollutant " + val] + "<br>" + PD.bold() + d["Density " + val] + "<br>" + POP.bold() + formatComma(d["Population " + val]);
            tooltip.html(html)
                .style("left", (360) + "px")
                .style("top", (120) + "px")
                //.style("left", (d3.event.pageX) + "px")
                //.style("top", (d3.event.pageY - 15) + "px")
                //.style("background-color", colors(d.country))
                .transition()
                .duration(200) // ms
                .style("opacity", .9) // started as 0!
        };
        main.selectAll(".dot") //svg_a.selectAll(".dot[region='Mideast']")
            .attr("class", "dot")
            .attr("r", function(d) { return Math.pow(d["Population " + val], (1/2))/75; }) //Math.pow(d["Population " + val], (1/3))/5
            .attr("cx", function(d) {return xScale(d["Density " + val]);})
            .attr("cy", function(d) {return yScale(d["Pollutant " + val]);})
            .attr("clip-path", "url(#clip)");
//            .on("mouseover", tipMouseover);
//        d3.selectAll(".mass[class*=msa1]")
//			.style("fill", function(d) {
//				  var value_1 = d.properties["Density " + val];
//                  return color_1(value_1);
//            });
//        d3.selectAll(".mass[class*=msa2]")
//			.style("fill", function(d) {
//				  var value_2 = d.properties["Pollutant " + val];
//                  return color_2(value_2);
//            });        //d3.selectAll(".mass")
        //    .style("fill", "blue");
    });

var g = d3.select("div#slider2").append("svg")
    .attr("class", "slider")
    .attr("width", 1000)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(30,10)");

g.call(slider2);

d3.select("p#value2").text((slider2.value()));