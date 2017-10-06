// Loosely speaking this is a 'flux' pattern e.g. look at Redux as the most common implementation
// Update pattern: https://bl.ocks.org/mbostock/3808218
// Update pattern: http://d3indepth.com/enterexit/

//Other library links
//https://github.com/seiyria/bootstrap-slider

//Why isn't this needed? Update can see it even when called from slider.on
//How?
var alldata = null
var yeardata = null

//zoneselection: one for each local authority. Set to all zeroes to start with. Same order as places names in alldata
var state = {
    sliderVal: 1997,
    zoneselection: Array.apply(null, Array(326)).map(Number.prototype.valueOf, 0),
    mouseIsInSidebar: false, //if inside then use next mouseover as overall selection
    mouseIsOverLine: false, //needed cos IsInSidebar is switched off when the mouse goes over a line. Way to fix?
    //So anyway: "in rectangle is true OR true for those two. Can't use one, timings may be wrong.
    zonehoveredover: -1, //record of current hover zone. Used for formatting in different places
    linesLookup: 0, //will be array of all (transformed) coordinates for lines in sidebar

    prevStyledLine: 0
}

//Set some initial zone selections for testing
for (var i = 0; i < 10; i++) {
    state.zoneselection[i] = 1
}

//colours to median wage rank in the map
var mapColourScale = d3.scaleLinear().domain([110.5, 6520]).range([120, 0])//hsl

//same for vertical sidebar
//221 is where non-null ranked entries start. (Will change when I update data.)
var sideBarVerticalScale = d3.scaleLinear().domain([221, 6520]).range([750, 0])//hsl



//global cos using later
//map extent and range to map to
//via qgis: xMin,yMin 82679.8,5357.8 : xMax,yMax 655604.70,657534.10
//And I think again, with BNG, it's flipped on y axis
var xScale = d3.scaleLinear().domain([82679, 655605]).range([0, 500])
var yScale = d3.scaleLinear().domain([5357, 657535]).range([1000, 0])

//For making SVG path to pass
var lineGenerator = d3.line();
lineGenerator
        .x(function (d, i) {
            return  xScale(i)
        })
        .y(function (d) {
            return yScale(d)
        })


//********************
//GLOBAL FUNCTIONS----

function setLinesCoordinates() {

    //Get y positions of lines in sidebar in one array
    //For working out which is nearest to mouse position if using nearest
    //In findNearestZoneLine
    state.linesLookup = []

    yeardata.forEach(function (x) {

        //lookup: y position to get the array entry. 
        //Why? Cos we want to get nearest sometimes
        //Not just the thing in itself.
        //Which turns out to be some faff.
        state.linesLookup.push(
                {
                    ypos: Math.round(sideBarVerticalScale(x.wagem_median_rank)),
                    ref: x
                }
        )

    })

//    window.console.log(state.linesCoordinates);

}

//find nearest value in array
//Returns a copy of the whole row's data
function returnNearestPlace(num) {

    var result = 0
    var lastdiff = 100000

    state.linesLookup.forEach(function (x) {

        diff = Math.abs(num - x.ypos)

        if (Math.abs(num - x.ypos) < lastdiff) {
            result = x.ref
            lastdiff = diff

        }

    })

    return(result)

}

//Taking in a D3 element that actually *is* the line
//Or a y coordinate and we have to find the nearest
//isNearest: if false, it's the exact y point (or should be)
function findNearestZoneLine(numorobject) {

    var match = 0;

    if (typeof (numorobject) !== 'object') {


        match = returnNearestPlace(numorobject)

        window.console.log("are we here? " + match.order);

        //This is currently a copy of a row. Can find a quicker way to get ref I think
        setLineStyle(d3.select("line#localauthorityindex" + (match.order - 1)))

//        window.console.log("nearest: " + match.NAME);


    } else {

        match = numorobject
//        window.console.log("exact: " + match.NAME);

    }


}


//https://github.com/d3/d3-selection using selection.call
function setZoneStyle(selection, j) {


    selection
            .style("fill", function (d, i) {

                var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                        d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                        "hsl(" + coltouse + ",100%,40%)")
            })
            .style("stroke", function (d) {
                return(d.zoneselected === 0 ? "rgb(150,150,150)" : "rgb(0,0,0)")
            })
            .style("stroke-width", function (d) {
                return(d.zoneselected === 0 ? "0.75" : "2.75")
            })

}


//For mouseover and when other features want it highlighted, same behaviour
function setMapHoverStyle(selection, i) {

    selection.
            style("fill", function (d, i) {
                var colScale = d3.scaleLinear().domain([110.5, 6520]).range([120, 0])//hsl
                var coltouse = Math.round(colScale(d.wagem_median_rank))
                return(d.wagemultipleFromMedian > 0 ? "hsl(" + coltouse + ",100%,30%)" : "rgb(100,100,100)")
            })

}

function setLineStyle(selection, j) {

    var currentname = 0, prevname = 0

    //incoming selection will always have selection style
    selection.style("stroke-width", "10")

    //if the current and previous are different
    //revert the previous to its original style
    if (state.prevStyledLine !== 0) {
//        if (state.prevStyledLine !== selection.data()[0].order - 1) {
        if (state.prevStyledLine.data()[0].NAME !== selection.data()[0].NAME) {

            //Try accessing directly. Tick.
//            window.console.log("access: " + d3.select("line#localauthorityindex"+j).data()[0].NAME)

            //So using either direct access or the stored selection, same outcome. Bizarre.

            state.prevStyledLine
                    .style("stroke-width", function (d) {
                        return(d.zoneselected === 0 ? 2 : 6)
                    })
                    .style("stroke", function (d) {//               
                        prevname = d.NAME
//                        window.console.log("In previous selection: " + prevname);

//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                        var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                        return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                                d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                                "hsl(" + coltouse + ",100%,40%)")
                    })
//            d3.select("line#localauthorityindex" + state.prevStyledLine)
//                    .attrs({
//                        stroke: function (d) {
//               
//                            prevname = d.NAME
//                            window.console.log("In previous selection: " + prevname);
//                            
////                        return(Math.round(mapColourScale(d.wagem_median_rank)))
//                            var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
//                            return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
//                                    d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
//                                    "hsl(" + coltouse + ",100%,40%)")
//                        },
//                        "stroke-width": 25
//                    })

//            window.console.log(state.prevStyledLine.data()[0])

//            window.console.log("does this ever? " + currentname + "," + prevname);
        }
    }

//    window.console.log("previous: " + prevname + ", current: " + currentname);

//    if (state.prevStyledLine !== 0) {
//        if (prevname !== currentname) {
//            state.prevStyledLine = selection
//        }
//    }


//store a copy to compare to next call
    state.prevStyledLine = selection
//    window.console.log(selection.data()[0].order -1)
//    state.prevStyledLine = selection.data()[0].order - 1


}



function update() {

    //get single year's data
    //Reminder to self: functions get the scope of functions that call them.
    //Although... I don't understand how alldata can be accessible 
    //when update is called via the on.slider
    yeardata = alldata.filter(function (d) {

        //triple equals doesn't work here. Ah - year value is a string:
        //"== is === with type converting (aka coercion)"
        //https://stackoverflow.com/questions/523643/difference-between-and-in-javascript
        return d.year == state.sliderVal
    })

    //add zone selection to year data for ease of access
    for (var i = 0; i < 326; i++) {
        yeardata[i].zoneselected = state.zoneselection[i]
    }


    function updateStatus() {
        para.text("year: " + time);
        econoutput.text("Economic output per year: " + economy.output);
    }




    function updateMap() {

        d3.selectAll("path.mappath")
                .data(yeardata)
//                .transition()//This works!!
                .call(setZoneStyle)

    }

    function updateSideBar() {

        d3.selectAll(".sidebarline")
                .data(yeardata)
                .transition()
                .attrs({
                    x1: function (d) {
                        return(d.zoneselected === 0 ? 1 : -4)
                    },
                    y1: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    },
                    x2: function (d) {
                        return(d.zoneselected === 0 ? 34 : 39)
                    },
                    y2: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    }
                })
                .style("stroke", function (d) {
//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                    var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                    return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                            d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                            "hsl(" + coltouse + ",100%,40%)")
                })
                .style("stroke-width", function (d) {
                    return(d.zoneselected === 0 ? 2 : 6)
                })



        setLinesCoordinates()


    }


    updateMap()
    updateSideBar()
//    updateStatus()
//    updateLineChart()    

//    console.log(state.sliderVal)



//        function updateLineChart() {

    //this is returning a function - kind of a factory
    //d3 4 would be d3.line();
    //Moved to global
//        var lineGenerator = d3.svg.line();

//        lineGenerator
//                .x(function(d,i) {return  xScale(i)})
//                .y(function(d) {return yScale(d)})
//        
//        var pathData = lineGenerator(store)

    //console.log(pathData)

//        d3.select("svg .line-chart path")
//                .attr("d", pathData)
//    }


}


function init() {

    // attach event handlers etc.
    console.log("init")

    //price and wage data 1997 to 2016
    //It doesn't matter whether I declare var alldata as global at the start.
    //I don't know why.
    alldata = d3.csv('data/prices_n_wagesByLocalAuthority_missingsAreMinusOne2.csv', function (err, csv) {
        alldata = csv
    })


    //Subset for testing (which I run again to get a separate copy to make sure it'll load)
    //This subset is got from data above once initially loaded
    yeardata = d3.csv('data/prices_n_wagesByLocalAuthority_missingsAreMinusOne2.csv', function (err, csv) {

        //Test filtering data then applying to paths
        //"Filtering in v4":
        //https://bl.ocks.org/d3noob/47b319ec0250b4063063942c64f0f949
        //subz = data.filter(function(d) {return d.year == "1997"})
        yeardata = csv
        yeardata = yeardata.filter(function (d) {
            return d.year === "1997"//also set in HTML
        })

        //add zone selection flag to year data
        for (var i = 0; i < 326; i++) {
            yeardata[i].zoneselected = state.zoneselection[i]
        }


        //VERTICAL DATA SIDEBAR INIT
        //Here to make sure data is loaded
        d3.select("g#sidebar")
                .selectAll("line")
                .data(yeardata)
                .enter()
                .append("line")
                .attr("class", "sidebarline")
                .attr("id", function (d, i) {
//                    window.console.log(i);
                    return("localauthorityindex" + i)
                })
                .attrs({
                    x1: function (d) {
                        return(d.zoneselected === 0 ? 1 : -4)
                    },
                    y1: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    },
                    x2: function (d) {
                        return(d.zoneselected === 0 ? 34 : 39)
                    },
                    y2: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    }
                })
                .style("stroke", function (d) {
//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                    var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                    return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                            d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                            "hsl(" + coltouse + ",100%,40%)")
                })
                .style("stroke-width", function (d) {
                    return(d.zoneselected === 0 ? 2 : 6)
                })
                .on("mousemove", function (d, i) {
                    //Using mousemove here AND in the rect should let us know where we are at all times
                    state.mouseIsOverLine = true
//                    console.log("still in! " + d3.mouse(this)[0] + "," + d3.mouse(this)[1])

                    //No need to find nearest zone line - pass element then check when there
//                    findNearestZoneLine(this)
//                    
                    //false: this is not the nearest, this is the exact position
//                    findNearestZoneLine(Math.round(sideBarVerticalScale(d.wagem_median_rank)), false)
                    //Just pass the object!
//                    findNearestZoneLine(d)

//                    styleFromSelectedIndexNumber(i)
                    //pass index number to be used for styling other parts of viz
                    setLineStyle(d3.select(this), i)

                })


        //Now they're made, get a record of their positions for finding nearest with mouse y
        setLinesCoordinates()


    })

    //Keep a flag updated for whether the mouse is in the side bar rectangle
    //Note 1: needed to give it a fill in CSS - otherwise, fill: none and the 
    //mouse behaviour only detects the edge line.
    //Note 2: it thinks it's outside the rectangle when it's over lines. Can't find a way to stop that.
    //Will attempt for now just to set mouseIsInSideBar to true when it's also over the lines.
    d3.select("#sidebarrect")
            .on("mousemove", function () {
                state.mouseIsInSidebar = true

//                console.log("in!" + d3.mouse(this)[0] + "," + d3.mouse(this)[1])
//                findNearestZoneLine([d3.mouse(this)[0], d3.mouse(this)[1]])

                //true: this is the nearest point, not the exact point
                findNearestZoneLine(Math.round(d3.mouse(this)[1]))

            })
//            .on("mouseleave", function () {
//                state.mouseIsInSidebar = false
//                console.log("out!")
//            })


    //bootstrap slider
    var slider = new Slider('#ex1', {
        formatter: function (value) {
            return 'Current value: ' + value;
        }
    });


    slider.on("slide", function (sliderValue) {
        //document.getElementById("ex6SliderVal").textContent = sliderValue;
        state.sliderVal = sliderValue
        update()
    });



    //adapted from http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
    //Trying this also for scaling...
    //http://bl.ocks.org/clhenrick/11183924    
    //No, this for UK (having converted to latlon in QGIS):
    //http://www.vapidspace.com/coding/2014/03/18/create-maps-with-d3/
    var projection = d3.geoMercator()
            .scale(4500)
//            .translate([500, 5310])
            .translate([500, 5310])

    // create a path generator.
    var path = d3.geoPath()
            .projection(projection);

    // create a container for local authorities - all paths selected on it in d3.json below
    //All this inner / outer g was to attempt to avoid jitter, didn't work
    //https://stackoverflow.com/questions/10988445/d3-behavior-zoom-jitters-shakes-jumps-and-bounces-when-dragging

    // load the la shape data
    d3.json("data/localAuthoritiesEngland2011gen3nodatalatlonsortbyname.geojson", function (json) {

        // create paths for each LA using the json data
        // and the geo path generator to draw the shapes
        //attach e.g. "polygon0" "polygon1" as ids to each path
        //Put the paths in the inner g
        d3.select("g.innerg").selectAll("path")
                .data(json.features)
                .enter().append("path")
                .attr("id", function (d, i) {
                    return("localauthorityindex" + i)
                })
                .attr("class", "mappath")
                .attr("d", path);



        //add local authority name as tool tip
        d3.selectAll("path.mappath")
                .data(yeardata)
                .append("title")
                .text(function (d) {
                    return(d.NAME)
                })


        //Mouseover and out behaviour. Styles set in setZoneStyle
        //Also called on update()
        d3.selectAll("path.mappath")
                .data(yeardata)
                .on("mouseover", function () {

                    //Call set hover style in its own function so other viz elements can do it too.
                    d3.select(this)            
                            .call(setMapHoverStyle)

                })
                .on("mouseout", function () {
                    //Needs doing this way because the call needs the selection passed explicitly
                    //as the first argument into setZoneStyle
                    //But it does then create just one place to change the style code
                    //For these zones.
                    d3.select(this).call(setZoneStyle)
                })
                .on("click", function (d, i) {
                    //toggle zone selection state
//                    state.zoneselection[i] = !state.zoneselection[i]//will convert to boolean but doesn't matter
                    state.zoneselection[i] = (state.zoneselection[i] === 0 ? 1 : 0)
                    update()

                })


        //I'm not sure but I *think* this works here because it's giving the data time to load above
        update()

    })





    //initial update - sorts styles for zones
//    update()



}


init()


