// Loosely speaking this is a 'flux' pattern e.g. look at Redux as the most common implementation
// Update pattern: https://bl.ocks.org/mbostock/3808218
// Update pattern: http://d3indepth.com/enterexit/

//Other library links
//https://github.com/seiyria/bootstrap-slider

//Why isn't this needed? Update can see it even when called from slider.on
//How?
var alldata = null

//zoneselection: one for each local authority. Set to all zeroes to start with. Same order as places names in alldata
var state = {
    sliderVal: 1997,
    zoneselection: Array.apply(null, Array(326)).map(Number.prototype.valueOf, 0)
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




//https://github.com/d3/d3-selection using selection.call
function setZoneStyle(selection) {

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
                    },
//                    stroke: "rgb(0,0,0)",
                    stroke: function (d) {
//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                        var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                        return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                                d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                                "hsl(" + coltouse + ",100%,40%)")
                    },
                    "stroke-width": function (d) {
                        return(d.zoneselected === 0 ? 1 : 6)
                    }
                })


        //trying this: https://bost.ocks.org/mike/constancy/
        //Or might need to start here: https://bost.ocks.org/mike/transition/
        //OK, ignore that for now: just added transition() ... and it worked. WOW. How on earth...?? THAT'S AMAZING.
//        d3.selectAll(".sidebarline")
//                .data(yeardata, function (d) {
//                    return d.NAME;
//                })
//                .transition()
//                .attr("transform", function (d) {
//                    return "translate(0," + y(d.NAME) + ")";
//                });

    }


    updateMap()
    updateSideBar()
//    updateStatus()
//    updateLineChart()    

    console.log(state.sliderVal)



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
    var yeardata = d3.csv('data/prices_n_wagesByLocalAuthority_missingsAreMinusOne2.csv', function (err, csv) {

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
        //test
//        testy = yeardata
//        console.log(
//                Math.round(sideBarVerticalScale(function (d) {
//                    d.wagem_median_rank
//                })))


        d3.select("g.sidebar")
                .selectAll("line")
                .data(yeardata)
                .enter()
                .append("line")
                .attr("class", "sidebarline")
                .attrs({
                    x1: 1,
                    y1: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    },
                    x2: 34,
                    y2: function (d) {
                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                    },
//                    stroke: "rgb(0,0,0)",
                    stroke: function (d) {
//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                        var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                        return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                                d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                                "hsl(" + coltouse + ",100%,40%)")
                    },
                    "stroke-width": 2
                })




    })



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
                    return("polygon" + i)
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

                    d3.select(this)
//                            .style("stroke-width", "0.75")
                            .style("fill", function (d, i) {
                                var colScale = d3.scaleLinear().domain([110.5, 6520]).range([120, 0])//hsl
                                var coltouse = Math.round(colScale(d.wagem_median_rank))
                                return(d.wagemultipleFromMedian > 0 ? "hsl(" + coltouse + ",100%,30%)" : "rgb(100,100,100)")
                            })
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


