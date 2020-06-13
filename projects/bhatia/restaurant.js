//https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
//https://www.d3indepth.com/force-layout/
//https://people.ucsc.edu/~mrbhatia/
//set the width and height for the svg
var width = 1500;
var height = 800;
//define a scale to make the nodes different colors using schemeCategory10 (10 different colors)
var color = d3.scaleOrdinal(["#9499F9", "#EF8AAF", "#FDE24A"]);


//Define Tooltip here
    //start with an opacity of 0 so it is not shown
    var tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);


//parse in the json file using d3.json and callback a function with the data in the graph variable
//used this link to gain clarity https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
d3.json("restaurant.json").then(function(graph) {
//log the data to see in the console
    console.log("Data"); 
    console.log(graph); 

    //create an object called label that contains 2 empty arrays 
    //the first array is called nodes and will hold nodes and the second called links which will hold links
    var label = {
        'nodes': [],
        'links': []
    };

    //to see what label looks like 
    console.log("Label object");
    console.log(label); 

    //loop through the nodes array in the data 
    //d is a node with a name and i is number
    graph.nodes.forEach(function(d, i) {
        //push the node into the label object twice
        //one will be a source one will be target
        label.nodes.push({node: d});
        label.nodes.push({node: d});
        //push a source and target value of i * 2 and i * 2 + 1 respectivley
        //even id will be a source odd willl be a target
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        });
    });

    //set positions for x and y center for node grouping
    var xCenter = [0, 100, 500, 800]
    var yCenter = [0, 250, 550, 250]
    //create a var for the how labels will show up on svg 
    //use the command d3.forceSimulation run on the nodes in the label object 
    //first use of d3.forceSimulation command Refer to more details in slides or on command lookup document
    //https://github.com/d3/d3-force
    //set a force simulation for the labels, command automatically starts the simulation
    var labelLayout = d3.forceSimulation(label.nodes)
        //add a force called charge using d3.forceManyBody which creates a equal force on all nodes of given parameters
        //this has a -negative strength of 50 which causes nodes (labels in this case) to repel each other
        .force("charge", d3.forceManyBody().strength(-50))
        //this creates a link force on the input label links with a strength 
        //sets distance to 0 and gives a strength of the force 2 
        .force("link", d3.forceLink(label.links).distance(0).strength(2));
    
    //create the laytout template for the graph 
    //uses the command d3.forceSimulation again but this time on the actual graph node data 
    //https://github.com/d3/d3-force
    //https://bl.ocks.org/d3indepth/9491e05b23ca7a02fca8d4ddf12df5df
    var graphLayout = d3.forceSimulation(graph.nodes)
        //add a charge force for all nodes with negative high strength so they repel \
        .force("charge", d3.forceManyBody().strength(-2000))
        // //https://github.com/d3/d3-force
        //add a center force to the nodes centered in the middle of the svg
        .force("center", d3.forceCenter(width / 2, height / 2))
        //add a x force for the node with a mild strength of 1 in the middle of the width
        //set based on location using xCenter and yCenter and element group id (set by python script)
        .force("x", d3.forceX(function(d){ return xCenter[d.group] }).strength(1))
        //add a y force in the middle of the svg with mild strength
        .force("y", d3.forceY(function(d){ return yCenter[d.group] }).strength(1.5))
        //create a link force using forceLink on the links array from the data 
        //use .name to give an accessor name for the link, id values are the name of the charecters
        //set a distance for the links and given a strength of 1
        .force("link", d3.forceLink(graph.links).id(function(d) {return d.name; }).distance(50).strength(1))
        //listen for a tick event (a tick of the simulations internal timer) and call function ticked 
        .on("tick", ticked);

//FORCES APPLIED SO FAR
    //made a force simulation for the labels for the graph 
        //added a force to all the labels and made them repel each other with a strength of -50 
        //added a link force between the labels that are linked and given a strength of 2 and link distance of 0 
    //made a force simulation for nodes and links on the graph 
        //added forces to all nodes and given centering force to drag nodes back to where they belong
        //give links a force with strength of 1 
    
    //create a new array 
    var adjlist = [];

    //loop through all links data and for each one set adjlist array element of source - target index to true 
    //set index for target - source index for the link to be true as well 
    //creates an array where all the links are recorded by index "2-5" (2 is linked to 5)
    graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });
    
    console.log("adjList");
    console.log(adjlist); 

    //this function returns false if there is no link between the 2 index or true if there is
    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }

    //select the svg created in the html file and give it a var name svg to call later 
    //set the svg attr width and height with the variables given above
    var svg = d3.select("#viz").attr("width", width).attr("height", height);
    //create element called ontainer and append it to the DOM 
    var container = svg.append("g");

    //call the svg 
    svg.call(
        //add zoom functionality with scale extent from 0.1 to 4 zoom in and out
        d3.zoom()
            .scaleExtent([.1, 4])
            //when user zooms with scroll fucntion is called to transform the position of the graph accordingly
            //pan drag and zoom
            .on("zoom", function() { container.attr("transform", d3.event.transform); })
    );

        
    //create an object called link to stores the lines linking nodes in the graph 
    //append the the container object created earlier and give them a class of links
    var link = container.append("g").attr("class", "links")
        //select html line property 
        .selectAll("line")
        //iterate through the link data stored in graphs and create a new line for each object
        .data(graph.links)
        //create the lines for appending
        .enter()
        //append lines
        .append("line")
        //add style to the links making them #aaa stroke and giving the lines a width of 1px 
        .attr("stroke", "white")
        .attr("stroke-width", "3px");

    //create an object called node and append to container, give class of nodes 
    var node = container.append("g").attr("class", "nodes")
        //select all dom elements
        .selectAll("g")
        //iteratre through node data and make a new node for each object
        .data(graph.nodes)
        .enter()
        //make these circles
        .append("circle")
        //give the circles a radius of 5
        .attr("r", 5)
        //color the circles using the color scale defined earlier by the star that they have been placed in 
        .attr("fill", function(d) { return color(d.star); });
    

    //when a node is mousedover call function focus, when the mouse leave call function unfocus 
    node.on("mouseover", function(d){
            tooltip.transition()
            .duration(800)
            .style("opacity", 1); 
            tooltip.html("<div class='ttip'><p style='text-align:center;'>" + d.name + "<p/>" + 
                         "<p><span>Location<span/><span style='float:right'>" + d.city + "<span/><p/>" +
                         "<p><span>Cuisine<span/><span style='float:right'>" + d.cuisine + "<span/><p/>" +
                         "<p><span>Price<span/><span style='float:right'>" + d.price + "<span/><p/>" +
                         "<p><span>Zip Code<span/><span style='float:right'>" + d.zipCode + "<span/><p/>" +
                         "<br/><p style='text-align:center;'>Click for Michelin Guide Link<p/><div/>"); 
        })
        .on("mouseout", function(d){
            tooltip.transition()
                .duration(800)
                .style("opacity", 0); 
        });
    
    //on node and link click open the appropriate URL
    node.on("click", function(d){ window.open(d.url)}); 
    
    link.on("click", function(d){ window.open("https://www.google.com/maps/place/" + d["source"].zipCode)}); 
    
    //when the enter key is pressed get the zip code and call focus function
    //after a certain time limit call unfocus to show all graph again
    d3.selectAll("input").on("keypress", function(){
        if(d3.event.keyCode === 13){
            console.log("ENTER"); 
            focus(document.getElementById("zipInput").value);
            //https://github.com/d3/d3-timer
            var t = d3.timer(function(elapsed) {
                if (elapsed > 1500) unfocus();
                if (elapsed > 1500) t.stop();
            }, 0);
        }
    }); 
    
    //call the nodes to display on the screen
    node.call(
        //add pan + drag capability and call functions for dragging and stopping the drag
        d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

    //create the label node element to contain the labels and append to container 
    var labelNode = container.append("g").attr("class", "labelNodes")
        //select html text 
        .selectAll("text")
        //loop through all the node labels and create a new text element for each label
        .data(label.nodes)
        .enter()
        .append("text")
        //add the text to the element, return the node id if it is the correct element
        //if the nodes are even numbered then make a label for them (avoids the double entry of nodes)
        .text(function(d, i) { return i % 2 == 0 ? "" : d.node.name; })
        //add style and font to the labels and make pointer events none to prevent it being caught by drag functions 
        .style("fill", "white")
        .style("font-family", "Book Antiqua")
        .style("font-size", 12)
        .style("pointer-events", "none"); // to prevent mouseover/drag capture
    
    console.log("labelNode"); 
    console.log(labelNode); 
    
    //label each of the groups SF LA and NY and set original positions
    //will love with pan drag and zoom since appended to container
   container.append("text")
        .attr("class", "locationTag")
        .attr("y", 650)
        .attr("x", 100)
        .text("San Francisco")
        .style("fill", "white")
        .style("font-family", "Book Antiqua")
        .style("font-size", 30); 
    
    container.append("text")
        .attr("class", "locationTag")
        .attr("y", 1050)
        .attr("x",700)
        .text("Los Angeles")
        .style("fill", "white")
        .style("font-family", "Book Antiqua")
        .style("font-size", 30); 
    
    container.append("text")
        .attr("class", "locationTag")
        .attr("y", 700)
        .attr("x", 1300)
        .text("New York")
        .style("fill", "white")
        .style("font-family", "Book Antiqua")
        .style("font-size", 30); 
    
    //not sure why this is called twice 
   // node.on("mouseover", focus).on("mouseout", unfocus);

    //fucntion for the tick event for the forceSimulation for the graph
    function ticked() {
        
        //print ticked to see when the simulation stops and when its restarted    
        console.log("ticked"); 
        
        //call node and call the fucntion to update the node
        node.call(updateNode);
        //call the links and call function to update them 
        link.call(updateLink);

        //call the labelLayout simulation and call .alphaTarget which sets the current decay halt to 0.3 and restarts the simulation
        //decays the simulation and moves labels to the right position when the graph is dragged or zoomed by updating the simulation
        labelLayout.alphaTarget(0.3).restart();
        //for each label on each node loop through and reset the position closer to the node
        labelNode.each(function(d, i) {
            //if the label is an even label (gets rid of duplicates)
            if(i % 2 == 0) {
                //update position of label
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                //gets the coordinates of the bounding box for the label text
                var b = this.getBBox();
                
                //sets thr position differences
                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                //finds distance from label to node using ditance formula
                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                //shift x 
                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                //move the label by given x and y based off label size and distance form node
                //label is always at the same place relative to the node
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);

    }

    //function to check if given value is finite using isFinite 
    //returns the number if it is and 0 if not 
    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    //focus function called by mouseover command
    //kind of a tooltip that blurs rest of nodes and links not associated with the node being mousedover 
    function focus(zip) {
       //set a node opacity to 1 if it is the same as input zip code and 0.1 if not
        node.style("opacity", function(o) {
            //check if node has the right zip
            return o.zipCode == zip ? 1 : 0.1;
        });
        //blur or keep label if attached to correct zip
        labelNode.attr("display", function(o) {
          return o.node.zipCode == zip ? "block": "none";
        });
        //if link is connected to node with correct zip keep if not blur
        link.style("opacity", function(o) {
            return o.source.zipCode == zip || o.target.zipCode == zip ? 1 : 0.1;
        });
    }
    
    //function to unfocus on mouseout 
    function unfocus() {
        //restore all labels to block 
       labelNode.attr("display", "block");
        //set opacitys for all links and nodes to 1 
       node.style("opacity", 1);
       link.style("opacity", 1);
    }

    //function to update a link for every tick of the simulation (called by ticked function)
    function updateLink(link) {
        //reset the x1 y1 x2 and y2 positions of the link if they are finite values for the source and target
        //makes sure the number is still a number and not infinity to avoid errors or nodes moved out of range
        //resets link to the new positions of source and target
        link.attr("x1", function(d) { return fixna(d.source.x); })
            .attr("y1", function(d) { return fixna(d.source.y); })
            .attr("x2", function(d) { return fixna(d.target.x); })
            .attr("y2", function(d) { return fixna(d.target.y); });
    }

    //updates the nodes on a simulation tick 
    function updateNode(node) {
        //translates by the new x and y positions as long as they are finite
        node.attr("transform", function(d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    //function to start drag
    //set fixed x and y to current positions to stop each node from being free flowing by itself and make it move with cursor and forces
    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    //reset the positions of the graph to new positions 
    //set all nodes with fixed positions so they all move according to cursor drag and forces
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    //once the drag stops set the fixed positions to null so they are free to move around with forces applied only 
    //https://stackoverflow.com/questions/51544007/d3-forcesimulation-and-dragging-what-is-node-fx-node-fy
    function dragended(d) {
        //once the event is stopped, set the target to 0 so stop the simulation decay
        if (!d3.event.active) graphLayout.alphaTarget(0);
        //set fixed pos to null to allow each node to move around freely together
        d.fx = null;
        d.fy = null;
    }
    
    
    
}); // d3.json