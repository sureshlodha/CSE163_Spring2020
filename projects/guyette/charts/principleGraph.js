/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

//Jacob Guyette

const pcheck = document.getElementById('principle');
const icheck = document.getElementById('interest');
const ycheck = document.getElementById('years');

pcheck.addEventListener('input', check1);
icheck.addEventListener('input', check2);
ycheck.addEventListener('input', check3);

 //input validation
   function check1() {
        var principle = document.getElementById("principle").value
           
            if((principle<=0 || isNaN(principle)) && principle !== ""){
                document.getElementById("principle").className = "input is-danger"; 
                
            }
            else{
                document.getElementById("principle").className = "input";
            }
        return
    }
     function check2() {
        var interest = document.getElementById("interest").value
           
            if((interest<0 || isNaN(interest)) && interest !== ""){
                document.getElementById("interest").className = "input is-danger"; 
                
            }
            else{
                document.getElementById("interest").className = "input";
            }
        return
    }
     function check3() {
        var years = document.getElementById("years").value
        console.log("hi")
            if((years<=0 || isNaN(years)) && years !== ""){
                document.getElementById("years").className = "input is-danger"; 
                
            }
            else{
                document.getElementById("years").className = "input";
            }
         return    
    }

function Principle() {
   

    // create Principle chart 
    // when the input range changes update value 
    d3.select("#calc").on("click", function updatey() {
        //get input
        var principle = document.getElementById("principle").value
        var interest = document.getElementById("interest").value
        var years = document.getElementById("years").value
        
        
        
        //exit if invalid params
        if(principle <=0 || interest<0 || years<=0 ||isNaN(principle)||isNaN(interest)||isNaN(years)){   
            if(principle == ""){
                document.getElementById("principle").className = "input is-danger"; 
            }
            if(interest == ""){
                document.getElementById("interest").className = "input is-danger"; 
            }
            if(years == ""){
                document.getElementById("years").className = "input is-danger"; 
            }
            //clear titles
            document.getElementById("payoff").innerHTML = ""
            document.getElementById("monthlyPayment").innerHTML ="$" + 0;
            document.getElementById("totalInterest").innerHTML = "$" +0;
            document.getElementById("totalPayment").innerHTML = 0+"%";
            document.getElementById("titleip").innerHTML = "";
            return
        }
        //reset input 
        document.getElementById("principle").className = "input"; 
        document.getElementById("interest").className = "input"; 
        document.getElementById("years").className = "input"; 
        //set headers for charts
        document.getElementById("titleip").innerHTML = years + " Year" + " Loan Summary(" +
            interest + "% APR)";
        if(interest == 0){
            interest = 0.000000001
        }
        
        //calculate
        //values to return
        let payments = 0;
        let totalD = 0;
        let totalI = 0;
        let a = principle;
        //monthly rate
        let r = (interest / 100) / 12;
        //years
        let n = 12 * years;
        //input validation

        //console.log("a: " + a + " r: " + r + " n: " + n);
        let output = a / (((Math.pow((1 + r), n)) - 1) / (r * (Math.pow((1 + r), n))))

        payments = output.toFixed(2);
        totalD = (output * n).toFixed(2);
        let I = ((((output * n).toFixed(2)) - a) / a) * 100;
        totalI = I.toFixed(2);
        if(interest == 0.000000001){
            totalD = principle
        }
        //console.log(payments+" "+totalD+" "+totalI);
        //send back computed
        document.getElementById("monthlyPayment").innerHTML = "$" + payments;
        document.getElementById("totalInterest").innerHTML = Math.abs(totalI) + "%";
        document.getElementById("totalPayment").innerHTML = "$" + totalD;

        let nointerest = principle / n
        let winterest = totalD / n

        //console.log(nointerest)


        let margin = {
                top: 15,
                right: 70,
                bottom: 53,
                left: 70
            },
            w = 800 - margin.left - margin.right,
            h = 490 - margin.top - margin.bottom;

        var svgContainer = d3.select('#chart3');
        //set size of svg
        let svg = svgContainer.append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //append axes
        //add initially hidden tool tip to svg
        var tooltip = svgContainer.append('div');

        //----------------------------tool tip-------------------------------------------
        //add initially hidden tool tip to svg
        //var tooltip = svgContainer.append('div');
        // tooltip mouseover event handler
        var onMouseOver = function (d) {
            //console.log(d.data.Date)
            //console.log(d[1])
            var Date = (d.data.Date).toDateString()
            var P = (d[1]).toFixed(2)
            var I = (d[1] - d[0]).toFixed(2)
            var debt = (d[1]).toFixed(2);
            //console.log(d[1])
            //console.log("here"+d[0])
            var html = "";
           if (d[0] == 0) {
                //html code principle tooltip
                html = "<div class='level' id='tip'><div class='level-item'><div class='notification is-link '><p  class='subtitle is-5'><b>"+Date+"</b></p><p></p><p class='subtitle is-5'>Remaining Principle: $"+P+"</p></div></div></div>"

                ;
            } else {
                //html code interest tooltip
                html = "<div class='level' id='tip'><div class='level-item'><div class='notification is-danger '><p  class='subtitle is-5'><b>"+Date+"</b></p><p></p><p class='subtitle is-5'>Remaining Interest: $"+I+"</p><p class='subtitle is-5'>Remaining Debt: $"+debt+"</p></div></div></div>"

                ;

            }
            //get html code above into tooltip
            tooltip.html(html)
                //postion tooltip
                .style("left", (d3.event.pageX + 6) + "px")
                .style("top", (d3.event.pageY) + "px")
                .transition()
                .duration(1) // instant
                .style("opacity", 1) // now visable

        };
        // tooltip mouseout event handler
        var onMouseOut = function () {
            tooltip.transition()
                .duration(1000) // 12 seconds until hidden
                .style("opacity", 0) // now hidden
                .on("end", function () {
                    document.getElementById("tip").innerHTML = ""; 
                });
            
        };

        //----------------------------create x and y axes----------------------------------
        //set x and y scales
        let yScale = d3.scaleLinear()
            //find min and max of stock prices
            .domain([0, totalD])

            .range([h, 0]).nice();

        //console.log("__here__")
        var today = new Date();
        var start = new Date(today.getFullYear(), (today.getMonth()), (today.getDate()));
        var myData = []

        let i = 0
        let count = n
        //console.log(n);
        for (i = 0; i <= n; i++) {
            let money = principle - (parseFloat(nointerest) * (i));
            let moneyi = totalD - (parseFloat(winterest) * (i))
            let interest = ((totalD / n) - (principle / n)).toFixed(2);
            let Tinterest = interest * count
            if (i == n) {
                moneyi = 0
            }
            //console.log(interest);
            myData.push({
                Date: (new Date(start)),
                Money: parseFloat(money),
                Interest: parseFloat(interest),
                Moneyi: moneyi,
                Tinterest: Tinterest
            });
            start.setMonth(start.getMonth() + 1);
            count--;
        }

        //console.log(myData)


        var xScale = d3.scaleBand()
            .domain(d3.values(myData).map(function (d) {
                return d.Date;

            }))
            .range([0, w])
            .padding(0.1);

        let yAxis = d3.axisLeft(yScale).ticks(10, "$,f");
        //----------------------------append x and y axes----------------------------------
        // add Y axis 
        svg.append("g")
            .attr("class", "axis")
            //position yaxis
            .attr("transform", "translate(0,0)")
            //creates yaxis
            .call(yAxis);

        // add X axis with ticks every 6 business days
        svg.append("g")
            .attr("class", "axis")
            //position xaxis
            .attr("transform", "translate(0," + h + ")")
            //creates xaxis
            .call(d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function (d, i) {
                    if (years > 1 && years <= 3) {
                        return !(i % 2)
                    }
                    if (years > 3 && years <= 8) {
                        return !(i % 3)
                    }
                    if (years > 8 && years <= 15) {
                        return !(i % 6)
                    }
                    if (years > 15) {
                        return !(i % 12)
                    } else {
                        return true
                    }


                }))
                .tickFormat(d3.timeFormat("%b %Y"))

            )

            //rotate labels for better readability
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(70)")
            .style("text-anchor", "start");

        //console.log(myData)
        //----------------------------draw principle and interest bars----------------------------------       
        //console.log(d3.keys(myData));
        //colors for bars
        var z = d3.scaleOrdinal()
            .range(['hsl(217, 71%, 53%)', 'hsl(348, 100%, 61%)']);

        var keys = ["Money", "Tinterest"];

        //console.log(d3.stack().keys(keys)(myData));

        myData.forEach(function (d) {
            d.total = 0;
            keys.forEach(function (k) {
                d.total += d[k];
            })
        });

        z.domain(keys);

        svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(myData))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xScale(d.data.Date);
            })
            .attr("y", function (d) {
                //console.log(yScale(d[1]));
                return yScale((d[1]));
            })
            .attr("height", function (d) {
                let hb = yScale(d[0]) - yScale(parseFloat(d[1]))
                
                if (hb >0){
                    return hb;
                }
                
            })
            .attr("width", xScale.bandwidth())

            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut);


        //----------------------------Add color Legend----------------------------------       
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", w - 30)
            .attr("width", 21)
            .attr("height", 21)
            .attr("fill", z);

        legend.append("text")
            .attr("x", w - 35)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d, i) {
                if (i == 0) {
                    return "Total Interest"
                } else {
                    return "Principle"
                }
            });
        //-----------------------------slider------------------------
        //source: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518
          // Time
          
        if(years>=2){
         var dataTime = d3.range(1,(parseFloat(years)+1)).map(function(d) {
            
            return new Date(today.getFullYear() + d, (today.getMonth()), (today.getDate()));
          });
        //console.log(dataTime)
        //console.log(dtest)
        var current = today.getFullYear()
          var sliderTime = d3
            .sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(600)
            .tickFormat(d3.timeFormat('%Y'))
            //.tickValues(dataTime)
            .tickValues(dataTime.filter(function (d, i) {
                    if (years > 23) {
                        return !(i % 2)
                    
                    } 
                    else {
                        return true
                    }
            }))
            .default(start)
            .on('onchange', val => {
              //set new postion of slider
              d3.select('p#value-time').text(d3.timeFormat('%Y')(val))
                
              var yearsUpdate = parseFloat(d3.timeFormat('%Y')(sliderTime.value()))- parseFloat(today.getFullYear()) + 1
            //console.log(yearsUpdate)
              //update graph if year changes
              if (d3.timeFormat('%Y')(val) != current){
                  
                 update(yearsUpdate-1, totalD);   
              }
              current = d3.timeFormat('%Y')(val) 
            });

          var gTime = d3
            .select('div#slider-time')
            .append('svg')
            .attr('width', 800)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(110,30)');

          gTime.call(sliderTime);

          d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));
        document.getElementById("payoff").innerHTML = "Find out how much you can save by paying off your loan early";
        }
       
        

        //----------------------------set graph title----------------------------------        

        
        

    });
    
    function update(years, oldtotal) {
            
        
        
        //get rid of old graph
        document.getElementById("chart3").innerHTML = "";
         
        
        //console.log(years);
        var principle = document.getElementById("principle").value
        var interest = document.getElementById("interest").value
        
        //set headers for charts
        document.getElementById("titleip").innerHTML = years + " Year" + " Loan Summary(" +
            interest + "% APR)";
        if(interest == 0){
            interest = 0.000000001
        }
        //calculate
        //values to return
        let payments = 0;
        let totalD = 0;
        let totalI = 0;
        let a = principle;
        //monthly rate
        let r = (interest / 100) / 12;
        //years
        let n = 12 * years;
        //input validation

        //console.log("a: " + a + " r: " + r + " n: " + n);
        let output = a / (((Math.pow((1 + r), n)) - 1) / (r * (Math.pow((1 + r), n))))

        payments = output.toFixed(2);
        totalD = (output * n).toFixed(2);
        let I = ((((output * n).toFixed(2)) - a) / a) * 100;
        totalI = I.toFixed(2);
        
        //calculate savings
        var savings = (parseFloat(oldtotal - totalD)).toFixed(2);
        if (savings == 0){
           document.getElementById("save").innerHTML = ""; 
        }
        else{
            document.getElementById("save").innerHTML = "You will save $<b>" + savings+" </b> in interest!";
        }
        
        if(interest == 0.000000001){
            totalD = principle
        }
        //send back computed
        document.getElementById("monthlyPayment").innerHTML = "$" + payments;
        document.getElementById("totalInterest").innerHTML = Math.abs(totalI) + "%";
        document.getElementById("totalPayment").innerHTML = "$" + totalD;

        let nointerest = principle / n
        let winterest = totalD / n

        //console.log(nointerest)


        let margin = {
                top: 15,
                right: 70,
                bottom: 53,
                left: 70
            },
            w = 800 - margin.left - margin.right,
            h = 490 - margin.top - margin.bottom;

        var svgContainer = d3.select('#chart3');
        //set size of svg
        let svg = svgContainer.append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //append axes
        //add initially hidden tool tip to svg
        var tooltip = svgContainer.append('div');

        //----------------------------tool tip-------------------------------------------
        //add initially hidden tool tip to svg
        //var tooltip = svgContainer.append('div');
        // tooltip mouseover event handler
        var onMouseOver = function (d) {
            //console.log(d.data.Date)
            //console.log(d[1])
            var Date = (d.data.Date).toDateString()
            var P = (d[1]).toFixed(2)
            var I = (d[1] - d[0]).toFixed(2)
            var debt = (d[1]).toFixed(2);
            //console.log(d[1])
            //console.log("here"+d[0])
            var html = "";
            if (d[0] == 0) {
                //html code principle tooltip
                html = "<div class='level' id='tip'><div class='level-item'><div class='notification is-link '><p  class='subtitle is-5'><b>"+Date+"</b></p><p></p><p class='subtitle is-5'>Remaining Principle: $"+P+"</p></div></div></div>"

                ;
            } else {
                //html code interest tooltip
                html = "<div class='level' id='tip'><div class='level-item'><div class='notification is-danger'><p  class='subtitle is-5'><b>"+Date+"</b></p><p></p><p class='subtitle is-5'>Remaining Interest: $"+I+"</p><p class='subtitle is-5'>Remaining Debt: $"+debt+"</p></div></div></div>"

                ;
            }
            //get html code above into tooltip
            tooltip.html(html)
                //postion tooltip
                .style("left", (d3.event.pageX + 6) + "px")
                .style("top", (d3.event.pageY) + "px")
                .transition()
                .duration(1) // instant
                .style("opacity", 1) // now visable

        };
        // tooltip mouseout event handler
        var onMouseOut = function () {
            tooltip.transition()
                .duration(1000) // 12 seconds until hidden
                .style("opacity", 0) // now hidden
                .on("end", function () {
                    document.getElementById("tip").innerHTML = ""; 
                });
        };

        //----------------------------create x and y axes----------------------------------
        //set x and y scales
        let yScale = d3.scaleLinear()
            //find min and max of stock prices
            .domain([0, totalD])

            .range([h, 0]).nice();

        //console.log("__here__")
        var today = new Date();
        var start = new Date(today.getFullYear(), (today.getMonth()), (today.getDate()));
        var myData = []

        let i = 0
        let count = n
        //console.log(n);
        for (i = 0; i <= n; i++) {
            let money = principle - (parseFloat(nointerest) * (i));
            let moneyi = totalD - (parseFloat(winterest) * (i))
            let interest = ((totalD / n) - (principle / n)).toFixed(2);
            let Tinterest = interest * count
            if (i == n) {
                moneyi = 0
            }
            //console.log(interest);
            myData.push({
                Date: (new Date(start)),
                Money: parseFloat(money),
                Interest: parseFloat(interest),
                Moneyi: moneyi,
                Tinterest: Tinterest
            });
            start.setMonth(start.getMonth() + 1);
            count--;
        }

        //console.log(myData)


        var xScale = d3.scaleBand()
            .domain(d3.values(myData).map(function (d) {
                return d.Date;

            }))
            .range([0, w])
            .padding(0.1);

        let yAxis = d3.axisLeft(yScale).ticks(10, "$,f");
        //----------------------------append x and y axes----------------------------------
        // add Y axis 
        svg.append("g")
            .attr("class", "axis")
            //position yaxis
            .attr("transform", "translate(0,0)")
            //creates yaxis
            .call(yAxis);

        // add X axis with ticks every 6 business days
        svg.append("g")
            .attr("class", "axis")
            //position xaxis
            .attr("transform", "translate(0," + h + ")")
            //creates xaxis
            .call(d3.axisBottom(xScale)
                .tickValues(xScale.domain().filter(function (d, i) {
                    if (years > 1 && years <= 3) {
                        return !(i % 2)
                    }
                    if (years > 3 && years <= 8) {
                        return !(i % 3)
                    }
                    if (years > 8 && years <= 15) {
                        return !(i % 6)
                    }
                    if (years > 15) {
                        return !(i % 12)
                    } else {
                        return true
                    }


                }))
                .tickFormat(d3.timeFormat("%b %Y"))

            )

            //rotate labels for better readability
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(70)")
            .style("text-anchor", "start");

        //console.log(myData)
        //----------------------------draw principle and interest bars----------------------------------       
        //console.log(d3.keys(myData));
        //colors for bars
        var z = d3.scaleOrdinal()
            .range(['hsl(217, 71%, 53%)', 'hsl(348, 100%, 61%)']);

        var keys = ["Money", "Tinterest"];

        //console.log(d3.stack().keys(keys)(myData));

        myData.forEach(function (d) {
            d.total = 0;
            keys.forEach(function (k) {
                d.total += d[k];
            })
        });

        z.domain(keys);

        svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(myData))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return xScale(d.data.Date);
            })
            .attr("y", function (d) {
                //console.log(yScale(d[1]));
                return yScale((d[1]));
            })
            .attr("height", function (d) {
                let hb = yScale(d[0]) - yScale(parseFloat(d[1]))
                if (hb >0){
                    return hb;
                }
            })
            .attr("width", xScale.bandwidth())

            .on("mouseover", onMouseOver)
            .on("mouseout", onMouseOut);


        //----------------------------Add color Legend----------------------------------       
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", w - 30)
            .attr("width", 21)
            .attr("height", 21)
            .attr("fill", z);

        legend.append("text")
            .attr("x", w - 35)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d, i) {
                if (i == 0) {
                    return "Total Interest"
                } else {
                    return "Principle"
                }
            });
        
        document.getElementById("payoff").innerHTML = "Find out how much you can save by paying off your loan early";     
        
    }

}
Principle();

