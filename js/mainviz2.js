var geofeatures = null

//alldata local authority lookup
var lookup = null

//zoneselection: one for each local authority. Set to all zeroes to start with. Same order as places names in alldata
var state = {
    sliderVal: 1997,
    previousSliderVal: 1997, //detect change to avoid calling update too much - only change when new year selected
    selectedZones: [],
    mouseIsInSidebar: false, //if inside then use next mouseover as overall selection
    mouseIsOverLine: false, //needed cos IsInSidebar is switched off when the mouse goes over a line. Way to fix?
    //So anyway: "in rectangle is true OR true for those two. Can't use one, timings may be wrong.
    zonehoveredover: null, //record of current hover zone. Used for formatting in different places
    linesLookup: 0, //will be array of all (transformed) coordinates for lines in sidebar

    prevStyledLine: 0,
    //A subset of year data that's just the selected local authorities. For sidebar text and graph details.
    yearselectiondata: 0,
    //Another subset from all-data: for main graph showing all time points for selected local authorities
    allselectiondata: 0,
    //allselection data reshaped for graph
    graphselectionreshape: []
}

//Set some initial zone selections
state.selectedZones = ["Barnsley", "Burnley", "Camden", "Copeland", "Derby", "Hackney", "Islington", "Kensington and Chelsea", "Liverpool", "Westminster"]

//colours to median wage rank in the map
var mapColourScale = d3.scaleLinear().domain([110.5, 6520]).range([120, 0])//hsl


function update() {

    updateMap()

}




function updateMap() {

    //Path n projection set in load()
    var mapz = d3.select("g.innerg")
            .selectAll("path")
            .data(geofeatures.features, function (d) {
                return (d.properties.NAME)
            })



    mapz.enter().append("path")
            .attr("id", function (d, i) {
                return("localauthorityindex" + i)
            })
            .attr("class", "mappath")
            .attr("d", path)
            .on("click", function (d) {

                //toggle zone name in selected zones array
                state.selectedZones = _.xor(state.selectedZones, [d.properties.NAME])
                update()

            })
            .on("mouseover", function (d) {
                state.zonehoveredover = d.properties.NAME
                update()
            }
            )
            .merge(mapz)
            .style("fill", function (d) {

                var data = lookup[d.properties.NAME][state.sliderVal]
                var coltouse = Math.round(mapColourScale(data.wagem_median_rank))

                col = (data.wagemultipleFromMedian < 0 ? "rgb(150,150,150)" : //nested ternary: vals are -1 if missing. Otherwise, use whether zone selected to style
                        state.selectedZones.includes(data.NAME) ? "hsl(" + coltouse + ",85%,60%)" :
                        "hsl(" + coltouse + ",100%,40%)")

                //If hovering over this zone...
                if (state.zonehoveredover === d.properties.NAME) {
                    col = data.wagemultipleFromMedian > 0 ? "hsl(" + coltouse + ",100%,30%)" : "rgb(100,100,100)"
                }

                return col
            })
            .style('stroke', function (d) {

                //This order allows selection to toggle visibly as it gets priority
                if (state.selectedZones.includes(d.properties.NAME)) {
                    var col = "rgb(0,0,0)"
                } else if (state.zonehoveredover === d.properties.NAME) {
                    var col = "rgb(255,100,50)"
                } else {
                    var col = "rgb(150,150,150)"
                }

                return col

            })
            .style('stroke-width', function (d) {
                return state.selectedZones.includes(d.properties.NAME) | state.zonehoveredover === d.properties.NAME ? "3" : "1"
            })
            .style("stroke-linejoin", "round")



    //Needs data to be indexed for this to work since the order's being shifted about.
    mapz.filter(function (d) {
        return(state.selectedZones.includes(d.properties.NAME) | state.zonehoveredover === d.properties.NAME)
    })
            .raise()




}

function load() {

// attach event handlers etc.
    console.log("load")

    //price and wage data 1997 to 2016
    //Wrangled in dataSorting4JavascriptViz.R (currently in miscGithubBlogging...)
    d3.csv('data/prices_n_wagesByLocalAuthority_missingsAreMinusOne2.csv', function (err, csv) {

        d3.json("data/localAuthoritiesEngland2011gen3nodatalatlonsortbyname.geojson", function (err, json) {

            //for later use 
            geofeatures = json
            alldata = csv

            //define projection and path as global, used in update()

            //adapted from http://synthesis.sbecker.net/articles/2012/07/18/learning-d3-part-7-choropleth-maps
            //Trying this also for scaling...
            //http://bl.ocks.org/clhenrick/11183924    
            //No, this for UK (having converted to latlon in QGIS):
            //http://www.vapidspace.com/coding/2014/03/18/create-maps-with-d3/
            projection = d3.geoMercator()
                    .scale(4500)
//            .translate([500, 5310])
                    .translate([500, 5310])

            // create a path generator.
            path = d3.geoPath()
                    .projection(projection);


            //Graph uses alldata so initialise it here when it's loaded.
            //Initial selection of local authorities will need to have been set before
            //Note this is different from yearselectiondata - this contains all years to display all data.


            //create lookup
            //Arse: it's not in an easily indexable form if using D3 nest. Useful for actual viz but not direct lookup...
//            lookup = d3.nest()
//                    .key(function (d) {
//                        return d.mnemonic;
//                    })
//                    .key(function (d) {
//                        return d.year;
//                    })
//                    .entries(alldata);


            lookup = {}

//            var lu = lookup

//            csv.forEach(function (row) {
//                console.log("row: " + row.mnemonic)
//            })

            //Using NAME: mnemonic is -1 if there's no data.
            csv.forEach(function (row) {
                if (!_.has(lookup, row.NAME)) {
                    lookup[row.NAME] = {}
                }

                lookup[row.NAME][row.year] = row

            })



            init()
            update()


        })//end json load
    })//end alldata load



}//end load


function init() {

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
        if (state.sliderVal !== state.previousSliderVal) {
            state.previousSliderVal = state.sliderVal
            update()
        }

    });

}


//Innit though? Yeah.
load()



  