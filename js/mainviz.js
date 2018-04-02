// Loosely speaking this is a 'flux' pattern e.g. look at Redux as the most common implementation
// Update pattern: https://bl.ocks.org/mbostock/3808218
// Update pattern: http://d3indepth.com/enterexit/

//Other library links
//https://github.com/seiyria/bootstrap-slider

//Why isn't this needed? Update can see it even when called from slider.on
//How? Oh - because anything declared without var is automatically a global variable.
var alldata = null
var yeardata = null

var geofeatures = null

//alldata local authority lookup
var lookup = null

//Selection of highest / lowest wage multiple local authorities
//Maybe just use names to create flag array huh?
var topbottom = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

var bottomten = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

//zoneselection: one for each local authority. Set to all zeroes to start with. Same order as places names in alldata
var state = {
    sliderVal: 1997,
    previousSliderVal: 1997, //detect change to avoid calling update too much - only change when new year selected
    zoneselection: Array.apply(null, Array(326)).map(Number.prototype.valueOf, 0),
    mouseIsInSidebar: false, //if inside then use next mouseover as overall selection
    mouseIsOverLine: false, //needed cos IsInSidebar is switched off when the mouse goes over a line. Way to fix?
    //So anyway: "in rectangle is true OR true for those two. Can't use one, timings may be wrong.
    zonehoveredover: -1, //record of current hover zone. Used for formatting in different places
    linesLookup: 0, //will be array of all (transformed) coordinates for lines in sidebar

    prevStyledLine: 0,
    //A subset of year data that's just the selected local authorities. For sidebar text and graph details.
    yearselectiondata: 0,
    //Another subset from all-data: for main graph showing all time points for selected local authorities
    allselectiondata: 0,
    //allselection data reshaped for graph
    graphselectionreshape: []
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
//British National Grid flipped on y axis
var xScale = d3.scaleLinear().domain([82679, 655605]).range([0, 500])
var yScale = d3.scaleLinear().domain([5357, 657535]).range([1000, 0])


//use to set graph size as well
var graphxrange = 350
var graphyrange = 250

//graph scalers
var xScaleGraph = d3.scaleLinear().domain([1997, 2016]).range([0, graphxrange])//year
var yScaleGraph = function () {}//Set yScale in init of alldata when we know the data extent for the subset
//var yScaleGraph = d3.scaleLinear().domain([1.5744, 42.45156]).range([graphyrange, 0])//wage multiple from median house price


//Graph lines. Uses reshape of the data so all year data points are in a subarray
//So each object passed in can create a line for each local authority
var graphLineGenerator = d3.line()

graphLineGenerator
        .x(function (d) {
            return xScaleGraph(d.year)
        })//year
        .y(function (d) {
            return yScaleGraph(d.wagemultiple)
        })//wage multiple


//https://stackoverflow.com/questions/39649525/how-do-i-generate-axis-tick-for-every-year-in-d3
var xAxisYearScale = d3.scaleTime()
        .domain([new Date(1997, 0, 1), new Date(2016, 0, 1)])
//    .rangeRound([20,graphxrange - 20]);
        .rangeRound([0, graphxrange]); //without this, doesn't work. Don't know what that's all doing yet.


//********************
//BUTTONZ----
//Function to deal with IE behaviour by temp replacing label via
//https://stackoverflow.com/questions/487056/retrieve-button-value-with-jquery
//var getButtonValue = function (button) {
//    var label = button.text
//    button.text('')//needs de-jquerying
//    var buttonValue = button.val
//    button.text(label)
//    return buttonValue
//}

//https://stackoverflow.com/questions/11720141/set-onclick-event-using-script
$(".testb").click(function () {
//    window.console.log("Handler for .click() called.")
//    window.console.log(getButtonValue(this));
//    window.console.log(this.value);

    switch (this.value) {
        case "1":

            state.zoneselection = topbottom
            update()

            break;

        case "2":

            state.zoneselection = bottomten
            update()

            break;

        case "3"://randomise. 

            //326 zeroes
            state.zoneselection = Array.apply(null, Array(326)).map(Number.prototype.valueOf, 0)

            //make sure ten are selected. Smarter ways of doing this, so I read, but since we're using a flag...
            //needs initialising here so the while can get started
            var sum = 0

            while (sum < 10) {

                //test on small number!
//            for (var i = 0; i < 10; i++) {

                state.zoneselection[Math.floor(Math.random() * state.zoneselection.length)] = 1

                var sum = 0
                state.zoneselection.forEach(function (x) {
//                    window.console.log("x: " + x);
                    sum = (x === 1 ? ++sum : sum)
                })

//                window.console.log(sum);

            }//end while

            update()


    }

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



//Taking in a y coordinate from mouseover the sidebar rectangle
//and we have to find the nearest
//(exact matches call setLineStyle directly so don't need this)
function findNearestZoneLine(numorobject) {

    var match = 0;
    match = returnNearestPlace(numorobject)

//    window.console.log(match.NAME);


    //This is currently a copy of a row. Can find a quicker way to get ref I think
    //"Order" starts at 1, as is R's wont. i index is yer standard array start-at-zero
    setLineStyle(d3.select("line#localauthorityindex" + (match.order - 1)), (match.order - 1))

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

    //Does this work? Hmm, can't currently figure
    //I think I'd need to set the array up differently in the first place
//    bisect = d3.bisector(function(d) {return d.xpos}).left    
//    window.console.log("bisect:" + bisect(state.linesLookup,num));

//    return(bisect(state.linesLookup,num))
    return result

}



//https://github.com/d3/d3-selection using selection.call
function setZoneStyle(selection, j) {

    selection
            .style("fill", function (d, i) {

//                j = i

                var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                        d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                        "hsl(" + coltouse + ",100%,40%)")
            })
            .style("stroke", "rgb(150,150,150)")
            .style("stroke-width", "0.75")
//            .style("stroke", function (d) {
//                return(d.zoneselected === 0 ? "rgb(150,150,150)" : "rgb(0,0,0)")
//            })
//            .style("stroke-width", function (d) {
//                return(d.zoneselected === 0 ? "0.75" : "2.75")
//            })

    //https://stackoverflow.com/questions/10607732/how-to-access-the-parentnode-of-a-d3-js-selection
    //https://stackoverflow.com/questions/17917072/choropleth-maps-changing-stroke-color-in-mouseover-shows-overlapping-boundari
    //This messes with the order. Which we're using. So that's not the way to do it. 
    //Have a feeling I might have hard-coded this problem in for myself.
//    console.log(selection.node().parentNode.appendChild(selection.node()))



}



//For mouseover and when other features want it highlighted, same behaviour
function setMapHoverStyle(selection, i) {

    selection.
            style("fill", function (d, i) {
                var colScale = d3.scaleLinear().domain([110.5, 6520]).range([120, 0])//hsl
                var coltouse = Math.round(colScale(d.wagem_median_rank))
                return(d.wagemultipleFromMedian > 0 ? "hsl(" + coltouse + ",100%,30%)" : "rgb(100,100,100)")
            })


    setName(selection)

}



function setLineStyle(selection, j) {

    var currentname = 0, prevname = 0

    //Keep a record of what's being hovered over for e.g. click behaviour in the bar
    state.zonehoveredover = j

    //incoming selection will always have selection style
    selection.style("stroke-width", "10")

    //Putting highlights for other things here for now. 
    //Will try and think of more eventy way of doing this.
    setMapHoverStyle(d3.select("path#localauthorityindex" + j + ".mappath"))


//    window.console.log("j:" +j);


    //if the current and previous are different
    //revert the previous to its original style
    if (state.prevStyledLine !== 0) {
//        if (state.prevStyledLine !== selection.data()[0].order - 1) {
        if (state.prevStyledLine.data()[0].NAME !== selection.data()[0].NAME) {

            //Do map first. Ooo isn't that neat? Err. NO.
            setZoneStyle(d3.select("path#localauthorityindex" + (state.prevStyledLine.data()[0].order - 1) + ".mappath"), j)


            //and graph... (where I'm using the actual order value just to confuse matters
            //mnemonic is id
//            window.console.log("selection data order: " + selection.data()[0].mnemonic);
            d3.select("path#" + selection.data()[0].mnemonic)
                    .style("stroke-width", "6")
                    .style("stroke", "blue")

            d3.select("path#" + state.prevStyledLine.data()[0].mnemonic)
                    .style("stroke-width", "2")
                    .style("stroke", "black")


            //Try accessing directly. Tick.
//            window.console.log("access: " + d3.select("line#localauthorityindex"+j).data()[0].NAME)

            state.prevStyledLine
                    .style("stroke-width", function (d) {
                        return(d.zoneselected === 0 ? 2 : 6)
                    })
                    .style("stroke", function (d) {//               
//                        prevname = d.NAME
//                        window.console.log("In previous selection: " + prevname);

//                        return(Math.round(mapColourScale(d.wagem_median_rank)))
                        var coltouse = Math.round(mapColourScale(d.wagem_median_rank))
                        return(d.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                                d.zoneselected === 0 ? "hsl(" + coltouse + ",85%,60%)" :
                                "hsl(" + coltouse + ",100%,40%)")
                    })

        }
    }

//    window.console.log(selection.data());

    setName(selection)

//store a copy to compare to next call
    state.prevStyledLine = selection


}


function setName(selection) {
    //bit of a hack... set the name here
    d3.select("text#nameofla")
            .data([selection.data()[0]])
            .text(function (d) {
                return(d.NAME)
            })
//            .attr("y", function (d) {
//                return(400 + Math.round(sideBarVerticalScale(d.wagem_median_rank))/3)
//            })



}

function getWageMultipleExtent() {

//Pull out the wage multiple values from the selection - for all years - into an extent
//To set y axis limits
    allwagemultiples = []

//    alldata.forEach(function (x) {
//        if (x.wagemultipleFromMedian !== "-1") {
//            allwagemultiples.push(parseFloat(x.wagemultipleFromMedian))
//        }
//    })

    //Try again - that was for all data. We want for subset
    state.graphselectionreshape.forEach(function (x) {
        x.datapoints.forEach(function (y) {
            if (y.wagemultiple !== "-1") {
                allwagemultiples.push(parseFloat(y.wagemultiple))
            }
        })
    })


    wageMultipleExtent = d3.extent(allwagemultiples)

    return(wageMultipleExtent)

}


//Reshape alldata into a form where the path generator can iterate and get year/wagemultiple pairs
function setGraphLineData() {

//FOR LATER: REFACTOR
//Just need to make a full list of path objects for all local authorities
//then subset that
//Though this doesn't seem too slow, repeating it is unnecessary. (Slightly smaller memory print though.)

    state.graphselectionreshape = []

    //Reshape it into a form the graph can use. This format:
//        test = [
//            {name: "Sheffield", datapoints: [
//                    {year: 1997, wagemultiple: 3.5},
//                    {year: 1998, wagemultiple: 4}
//                ]
//            }
//        ]
//        window.console.log(test[0].name + "," + test[0].datapoints[0].year, test[0].datapoints[0].wagemultiple);
//        window.console.log(test[0].name + "," + test[0].datapoints[1].year, test[0].datapoints[1].wagemultiple);
    //   For each d in D3 and path generator we then have:
    //   d.year / d.wagemultiple

    //Two stage: names first, then datapoints as an inner array of the named object.
    //Just pick one year randomly, names will be (should be) in same order
    state.allselectiondata.filter(function (d) {
        return d.year == 1997//coerce
    }).forEach(function (x) {
        state.graphselectionreshape.push(
                {
                    name: x.NAME,
                    id: x.mnemonic//cos no spaces like name and css doesn't like numbers for IDs
                }
        )
    })

    //Iterate over each name. Use filter to get year line values for each
    state.graphselectionreshape.forEach(function (x) {

        var place = state.allselectiondata.filter(function (d) {
            return d.NAME == x.name//coerce
        })

//            window.console.log("place! " + place[0].NAME);

        //Got all years for each place in date order. One datapoint for each please thank you!
        //Add an array for the datapoints to the object
        x.datapoints = []

        //get the year and wage multiple data for this place, for each year
        place.forEach(function (y) {
            x.datapoints.push({year: y.year, wagemultiple: y.wagemultipleFromMedian})
        })

    })

    //test in the line generator
//        testlg = graphLineGenerator(state.graphselectionreshape[0].datapoints)
//        window.console.log(testlg);


}




//variableForText: from the yearselectiondata.
//appendText for the "x" for the wage muliple currently
function sidebartext(variableForText, appendText, xpos) {

    d3.select("g#sidebar")
            .selectAll("text")
            .data(state.yearselectiondata, function (d) {
                return d.order
            })//use key as will be changing its basic order
            .enter()
            .append("text")
            .text(function (d, i) {

                //https://stackoverflow.com/a/12830454
                //Which also has an option for rounding if in numeric format. (Text here.)
                return parseFloat(d[variableForText]).toFixed(2) + appendText;
            })
            .attrs({
                x: xpos,
                y: function (d) {
                    return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                },
                dy: 4,
                "font-size": "12"
            })

    d3.select("g#sidebar")
            .selectAll("text")
            .data(state.yearselectiondata, function (d) {
                return d.order
            })//use key as will be changing its basic order
            .exit()
            .remove()

    d3.select("g#sidebar")
            .selectAll("text")
            .data(state.yearselectiondata, function (d) {
                return d.order
            })
            .transition()
            .text(function (d, i) {

                //https://stackoverflow.com/a/12830454
                //Which also has an option for rounding if in numeric format. (Text here.)
                return parseFloat(d[variableForText]).toFixed(2) + appendText;
            })
            .attrs({
                x: xpos,
                y: function (d) {
                    return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
                },
                dy: 4
            })

}





function update() {


//get single year's data
//Reminder to self: functions get the scope of functions that call them.
//This'll work as it's pass by reference
    yeardata = alldata.filter(function (d) {

//triple equals doesn't work here. Ah - year value is a string:
//"== is === with type converting (aka coercion)"
//https://stackoverflow.com/questions/523643/difference-between-and-in-javascript
        return d.year == state.sliderVal
    })


    //Update alldata zoneselected field
    for (var j = 0; j < 20; j++) {
        for (var i = 0; i < 326; i++) {
            alldata[i + (j * 326)].zoneselected = state.zoneselection[i]
        }
    }

//Get subset of data objects for all years
    state.allselectiondata = alldata.filter(function (d) {
        return d.zoneselected === 1//also set in HTML
    })


    //Get selection subset as its own data, for sidebar text and graphs
    state.yearselectiondata = yeardata.filter(function (d) {

        return d.zoneselected === 1//also set in HTML

    })

//    window.console.log("graph data size: " + state.graphselectionreshape.length);


    function updateGraph() {

        setGraphLineData()

        //Y AXIS: SET EXTENT BASED ON SUBSET DATA
        var wageMultipleExtent = getWageMultipleExtent()

        //Always starting at zero for now
        yScaleGraph = d3.scaleLinear().domain([0, wageMultipleExtent[1]]).range([graphyrange, 0])//wage multiple from median house price
//        yScaleGraph = d3.scaleLinear().domain([wageMultipleExtent[0], wageMultipleExtent[1]]).range([graphyrange, 0])//wage multiple from median house price

//       
        var yAxis = d3.axisLeft(yScaleGraph)

        d3.select('g.yaxis')
                .transition()
                .call(yAxis)
                .attr("transform", "translate(0," + (0) + ")")

        //Deal with any additions / removals

        var graphselection = d3.select("g.graphlines")
                .selectAll("path")
                .data(state.graphselectionreshape, function (d) {
                    return d.name
                })
                .style("stroke-width", "2")


        graphselection
                .enter().append("path")
//                .attr("id", function (d, i) {
////                    return("localauthorityindex" + i)
////                    window.console.log(d);
//                })
                .attr("class", "graphpath")
                .attr("d", function (d) {
                    return(graphLineGenerator(d.datapoints))
                })
                .attr("id", function (d) {
                    return(d.id)
                })


        graphselection.exit().remove()

        //And plain old update
        graphselection
                .transition()
                .attr("d", function (d) {
                    return(graphLineGenerator(d.datapoints))
                })





        //Vertical year marker line
        d3.select("rect.graphyearbar")
                .data([state.sliderVal])
                .attr(
                        "x", function (d) {
                            return(xScaleGraph(d) - 5)
                        })


    }



    function updateMap() {



        //Draw new features to make sure thicker line is at top of draw pile
        var topselection = d3.select("g#topselect")
                .selectAll("path")
                .data(geofeatures.features.filter(function (x, index) {
                    return(state.zoneselection[index])
                    //This is just using state.zoneselection's boolean flag. Index returned contains 1 or 0
                    //They're truthy/falsey same as in R. Index is the index of the original array
                    //So this returns what we want.
                }), function (d) {
                    return (d.properties.CODE)
                }//index the data in D3
                )

        topselection.enter()
                .append("path")
                .attr("d", path)
                .style("fill", "none")
                .style("stroke", "rgb(0,0,0)")
                .style("stroke-width", "3")
                .style("stroke-linejoin", "round")

        topselection.exit().remove()

//        topselection.attr("d", path)
//                .style("fill", "none")
//                .style("stroke", "rgb(0,0,0)")
//                .style("stroke-width", "5.5")

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



        //sidebar text
        //Deal with changes in data first
        //I should probably pull this out into a function: we have two of them currently.
        //Oh scratch that. Update called in init. Just once now. Need to go refactor all that.

        sidebartext("wagemultipleFromMedian", "x", 44)
        //Which didn't work for two reasons: it's trying to convert to number
        //And it's over-writing the previous data join
        //Would need its own container
//        sidebartext("NAME","",-30)


//        d3.select("g#sidebar")
//                .selectAll("text")
//                .data(state.yearselectiondata, function (d) {
//                    return d.order
//                })//use key as will be changing its basic order
//                .enter()
//                .append("text")
//                .text(function (d, i) {
//
//                    //https://stackoverflow.com/a/12830454
//                    //Which also has an option for rounding if in numeric format. (Text here.)
//                    return parseFloat(d.wagemultipleFromMedian).toFixed(2) + "x";
//                })
//                .attrs({
//                    x: 44,
//                    y: function (d) {
//                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
//                    },
//                    dy: 4,
//                    "font-size": "12"
//                })
//
//        d3.select("g#sidebar")
//                .selectAll("text")
//                .data(state.yearselectiondata, function (d) {
//                    return d.order
//                })//use key as will be changing its basic order
//                .exit()
//                .remove()
//
//        d3.select("g#sidebar")
//                .selectAll("text")
//                .data(state.yearselectiondata, function (d) {
//                    return d.order
//                })
//                .transition()
//                .text(function (d, i) {
//
//                    //https://stackoverflow.com/a/12830454
//                    //Which also has an option for rounding if in numeric format. (Text here.)
//                    return parseFloat(d.wagemultipleFromMedian).toFixed(2) + "x";
//                })
//                .attrs({
//                    x: 44,
//                    y: function (d) {
//                        return(Math.round(sideBarVerticalScale(d.wagem_median_rank)))
//                    },
//                    dy: 4
//                })



    }


    updateMap()
    updateSideBar()
    updateGraph()

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
    //Wrangled in dataSorting4JavascriptViz.R (currently in miscGithubBlogging...)
    alldata = d3.csv('data/prices_n_wagesByLocalAuthority_missingsAreMinusOne2.csv', function (err, csv) {
        alldata = csv

        //Graph uses alldata so initialise it here when it's loaded.
        //Initial selection of local authorities will need to have been set before
        //Note this is different from yearselectiondata - this contains all years to display all data.
//        state.allselectiondata = alldata.filter(function(d){
//            return alldata
//        })





        //create lookup
        lookup = d3.nest()
                .key(function (d) {
                    return d.mnemonic;
                })
                .key(function (d) {
                    return d.year;
                })
                .entries(alldata);





        //add zone selection flag to all data
        //Every 326 is one year ordered the same, long form
        //HARDCODING 20 YEARS IN DATA
        for (var j = 0; j < 20; j++) {
            for (var i = 0; i < 326; i++) {
                alldata[i + (j * 326)].zoneselected = state.zoneselection[i]
            }
        }

        //Get subset of data objects for all years
        state.allselectiondata = alldata.filter(function (d) {
            return d.zoneselected === 1//also set in HTML
        })

        setGraphLineData()


        //INITIALISE AXES
        //https://stackoverflow.com/questions/39649525/how-do-i-generate-axis-tick-for-every-year-in-d3
        var xAxis = d3.axisBottom(xAxisYearScale).tickFormat(d3.timeFormat("%y"))

        d3.select('g.yearaxis')
                .call(xAxis.ticks(d3.timeYear))
                .attr("transform", "translate(0," + (graphyrange + 10) + ")")


        //Y AXIS: SET EXTENT BASED ON SUBSET DATA
        var wageMultipleExtent = getWageMultipleExtent()

        //Always starting at zero for now
//        yScaleGraph = d3.scaleLinear().domain([0, wageMultipleExtent[1]]).range([graphyrange, 0])//wage multiple from median house price
        yScaleGraph = d3.scaleLinear().domain([wageMultipleExtent[0], wageMultipleExtent[1]]).range([graphyrange, 0])//wage multiple from median house price


        var yAxis = d3.axisLeft(yScaleGraph)

        d3.select('g.yaxis')
                .call(yAxis)
                .attr("transform", "translate(0," + (0) + ")")



        //INITIALISE PER-LOCAL-AUTHORITY ALL-YEAR GRAPH
        d3.select("g.graphlines")
                .selectAll("path")
                .data(state.graphselectionreshape, function (d) {
                    return d.name
                })
                .enter().append("path")
//                .attr("id", function (d, i) {
////                    return("localauthorityindex" + i)
////                    window.console.log(d);
//                })
                .attr("class", "graphpath")
                .attr("id", function (d) {
                    return(d.id)
                })
                .attr("d", function (d) {
                    return(graphLineGenerator(d.datapoints))
                })
                .attr("stroke-width", "10")


        //Initialise vertical year marker bar on graph
        //Note using datum here.
        //https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
        d3.select("g.box1")
                .selectAll("rect")
                .data([state.sliderVal])
                .enter()
                .append("rect")
//                .attr("x", 10)
//                .attr("y", 10)
//                .attr("width", 50)
//                .attr("height", 100)
                .attrs({
                    x: function (d) {
                        return(xScaleGraph(d) - 5)
                    },
                    y: 0,
                    width: 10,
                    height: graphyrange,
                    class: "graphyearbar",
                    "fill-opacity": "0.25"
                })


    })//load alldata








    //Subset for testing (which I run again to get a separate copy to make sure it'll load)
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
        //DONT NEED THIS since (a) alldata was given the zoneselected field and (b) pass by reference
//        for (var i = 0; i < 326; i++) {
//            yeardata[i].zoneselected = state.zoneselection[i]
//        }

        //Get selection subset as its own data, for sidebar text and graphs
        state.yearselectiondata = yeardata.filter(function (d) {
            return d.zoneselected === 1//also set in HTML
        })


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

//                    styleFromSelectedIndexNumber(i)
                    //pass index number to be used for styling other parts of viz
                    setLineStyle(d3.select(this), i)

                })
                .on("click", function () {

                    //This code needs repeating for when mouse is near lines via sidebarrect behaviour
                    //I have a feeling there's a sensible way to do this once. Don't know what yet.

                    //state.zonehoveredover set when setLineStyle called. Used to select
                    //Toggle
                    state.zoneselection[state.zonehoveredover] = (state.zoneselection[state.zonehoveredover] === 0 ? 1 : 0)
                    update()

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
            .on("click", function () {

                //This code needs repeating for when mouse is directly over lines
                //I have a feeling there's a sensible way to do this once. Don't know what yet.

                //state.zonehoveredover set when setLineStyle called. Used to select
                state.zoneselection[state.zonehoveredover] = (state.zoneselection[state.zonehoveredover] === 0 ? 1 : 0)
                update()

            })
//            .on("mouseleave", function () {
//                state.mouseIsInSidebar = false
//                console.log("out!")
//            })

    //attempt at closure, come back to
//    var didSliderValChange = (function(currentVal) {
//
//        var lastVal = -1
//
//        function compare() {
////            return(currentVal != lastVal ? true : false)
//            if (currentVal != lastVal) {
//                lastVal = currentVal
//                return true
//            } else {
//                return false
//            }
//        }
//
//        return(compare())
//
//    })()




    //bootstrap slider
    var slider = new Slider('#ex1', {
        formatter: function (value) {
            return 'Current value: ' + value;
        }
    });
    slider.on("slide", function (sliderValue) {
        //document.getElementById("ex6SliderVal").textContent = sliderValue;
        state.sliderVal = sliderValue
//        window.console.log("slider call");

        //Only update if value changed
        if (state.sliderVal != state.previousSliderVal) {
            state.previousSliderVal = state.sliderVal
            update()
        }

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
    path = d3.geoPath()
            .projection(projection);
    // create a container for local authorities - all paths selected on it in d3.json below
    //All this inner / outer g was to attempt to avoid jitter, didn't work
    //https://stackoverflow.com/questions/10988445/d3-behavior-zoom-jitters-shakes-jumps-and-bounces-when-dragging

    // load the la shape data
    d3.json("data/localAuthoritiesEngland2011gen3nodatalatlonsortbyname.geojson", function (json) {

        //for later use 
        geofeatures = json

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

        //Draw a new feature to make sure thicker line is at top of draw pile
//        d3.select("g#topselect")
//                .selectAll("path")
//                .data(json.features.filter(function (x, index) {
//                    return(state.zoneselection[index])
//                    //This is just using state.zoneselection's boolean flag. Index returned contains 1 or 0
//                    //They're truthy/falsey same as in R. Index is the index of the original array
//                    //So this returns what we want.
//                })
//                        )
//                .enter()
//                .append("path")
//                .attr("d", path)
//                .style("fill", "none")
//                .style("stroke", "rgb(0,0,0)")
//                .style("stroke-width", "2.5")



        //add local authority name as tool tip
//        d3.selectAll("path.mappath")
//                .data(yeardata)
//                .append("title")
//                .text(function (d) {
//                    return(d.NAME)
//                })

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


