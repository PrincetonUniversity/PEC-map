/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9, 
      height = window.innerHeight * 0.7, 
      margin = { top: 20, bottom: 50, left: 60, right: 40 };

mapboxgl.accessToken = 'pk.eyJ1IjoibWRoYWxsZWUiLCJhIjoiY2tjcWVscWkyMTN6czM0bGJ4eXB1dDNzMSJ9.ZqDUoCfQVWMN_ASDB9Mhdg';

const zoomThreshold = 4;

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mdhallee/ckd567qcu0baj1iqlnk8sg99b?optimize=true',

});

const bbox = [[-63.588704947691994, 50.715649574086314], [-127.55862265048071, 22.645896726596078]];
map.fitBounds(bbox, {
    padding: {top: 10, bottom:25, left: 15, right: 5},
    linear: true,
});

const svg = d3
      .select("#map-container")
      .append("svg")    
      .attr("width", width)
      .attr("height", height);

map.on('load', function() {

    map.addSource('congressional-layer', {
        type: 'geojson',
        data: 'https://princetonuniversity.github.io/PEC-map/out-files/house_dat.geojson'
    });

    map.addSource('states-layer', {
        type: 'geojson',
        data: 'https://princetonuniversity.github.io/PEC-map/out-files/state_dat.geojson'
    });

    map.addSource('state-house', {
        type: 'geojson',
        data: 'https://princetonuniversity.github.io/PEC-map/out-files/lower_state_moneyball_simple.geojson'
    });

    map.addSource('state-senate', {
        type: 'geojson',
        data: 'https://princetonuniversity.github.io/PEC-map/out-files/upper_state_moneyball_simple.geojson'
    });

    map.addLayer(
        {
            'id': 'states-layer',
            'source': 'states-layer',
            'minzoom': 0,
            'maxzoom': zoomThreshold,
            'paint': {
                'fill-opacity': [
                    'match',
                    ['get', 'State color'],
                    'yes', 0.7, 
                    0
                    ],
                'fill-color': [
                    'match',
                    ['get', 'State color'],
                    'yes', '#F58025', 
                    'white'
                    ],
                'fill-outline-color': 'white'
            },
            'type': 'fill',
        }
    );

    map.addLayer(
        {
            'id': 'congressional-layer',
            'source': 'congressional-layer',
            'minzoom': zoomThreshold,
            'paint': {
                'fill-opacity': [
                    'match',
                    ['get', 'June Cook Ratings'],
                    'Toss-Up', 0.8, 
                    'Lean R', 0.8, 
                    'Lean D', 0.8,
                    0
                    ],
                'fill-color': [
                    'match',
                    ['get', 'June Cook Ratings'],
                    // old colors (PEC style guide)
                    // 'Toss-Up', '#c79e4a', 
                    // 'Lean R', '#C62535', 
                    // 'Lean D', '#1660CE',
                    'Toss-Up', "hsla(232, 82%, 69%, 0.75)", 
                    'Lean R', "hsla(312, 99%, 55%, 0.88)", 
                    'Lean D', "hsla(193, 82%, 74%, 0.75)",
                    'white'
                    ]                
            },
            'type': 'fill',
            'layout': {
                'visibility': 'visible'
                },        
        }
    );

    map.addLayer(
        {
            'id': 'congressional-border',
            'type': 'line',
            'source': 'congressional-layer',
            'minzoom': zoomThreshold,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#001940',
                'line-width': 1.5
            },
        });

    map.addLayer(
        {
            'id': 'state-house',
            'source': 'state-house',
            'minzoom': zoomThreshold-1,
            'paint': {
                'fill-outline-color': '#c4c4c4',
                'fill-opacity': [
                    'match',
                    ['get', 'VOTER_POWER'],
                    0, 0.5, 
                    0.8
                    ],
                'fill-color': [
                    "case",
                    [
                      ">=",
                      ["get", "VOTER_POWER"],
                      75
                    ],
                    "hsla(312, 99%, 55%, 0.88)",
                    [
                      ">=",
                      ["get", "VOTER_POWER"],
                      45
                    ],
                    "hsla(288, 88%, 56%, 0.85)",
                    [
                      ">=",
                      ["get", "VOTER_POWER"],
                      30
                    ],
                    "hsla(232, 82%, 69%, 0.75)",
                    [
                      ">=",
                      ["get", "VOTER_POWER"],
                      20
                    ],
                    "hsla(193, 82%, 74%, 0.75)",
                    "hsla(0, 0%, 100%, 0)"
                  ]
                },
            'type': 'fill', 
            'layout': {
                'visibility': 'none'
                },  
        }
    );

    map.addLayer(
        {
            'id': 'state-senate',
            'source': 'state-senate',
            'minzoom': zoomThreshold-1,
            'paint': {
                'fill-outline-color': '#a3a3a3',
                'fill-opacity': [
                    'match',
                    ['get', 'VOTER_POWER'],
                    0, 0.5, 
                    0.8
                    ],
                    'fill-color': [
                        "case",
                        [
                          ">=",
                          ["get", "VOTER_POWER"],
                          75
                        ],
                        "hsla(312, 99%, 55%, 0.88)",
                        [
                          ">=",
                          ["get", "VOTER_POWER"],
                          45
                        ],
                        "hsla(288, 88%, 56%, 0.85)",
                        [
                          ">=",
                          ["get", "VOTER_POWER"],
                          30
                        ],
                        "hsla(232, 82%, 69%, 0.75)",
                        [
                          ">=",
                          ["get", "VOTER_POWER"],
                          20
                        ],
                        "hsla(193, 82%, 74%, 0.75)",
                        ['all', [">=", ["get", "VOTER_POWER"], 7], ["==", ["get", "POSTAL"], "NC"]],
                        "hsla(193, 82%, 74%, 0.75)",
                        "hsla(0, 0%, 100%, 0)"
                      ]
                    },
            'type': 'fill',
            'layout': {
                'visibility': 'none'
                },  
        }
    );

    // State-layer click and pop-up stuff
    map.on('click', 'states-layer', function(e) {
        map.flyTo({center: e.lngLat, zoom:zoomThreshold});
        let prop = e.features[0].properties
        let clickedStateBox = document.getElementById('clicked-info') 

        let clickedStateInfo = document.getElementById('state-info')
        clickedStateInfo.innerHTML = ""

        clickedStateBox.appendChild(clickedStateInfo)

        /* Add state name. */
        let title = clickedStateInfo.appendChild(document.createElement('div'));
        title.className = 'title';
        title.innerHTML = prop.NAME;
        
        /* Add details to the individual state info. */
        let details = clickedStateInfo.appendChild(document.createElement('div'));
        if (prop['Overall blurb'] != 'null') {
            details.innerHTML += prop['Overall blurb']+ "<br /> <br />";
        }
        if (prop['Redistricting blurb'] != 'null') {
            details.innerHTML += 'Redistricting process: '.bold() + prop['Redistricting blurb']+ "<br />";
        }
        if (prop['Competitive Congressional Districts'] != 'null') {
            details.innerHTML += 'Competitive Congressional Districts: '.bold() + prop['Competitive Congressional Districts'] + "<br />";
        }
        if (prop['State House'] != 'null') {
            details.innerHTML += 'State House: '.bold()
            if ((prop['State House'] == "Not competitive") | (prop['State House'] == "No election")) {
                stateHouse = "<span style='background-color:#cbafe9; color:#001940'>" + prop['State House'] + "</span>";
                details.innerHTML += stateHouse + "<br />";
            }
            else {
                stateHouse = "<span style='background-color:#f8f67e; color:#001940'>" + prop['State House'] + "</span>";
                details.innerHTML += stateHouse + "<br />";
            }
        }
        if (prop['State House Seat'] != 'null') {
            details.innerHTML += 'Competitive State House Races: '.bold() + prop['State House Seat'] + "<br />";
        }
        if (prop['State Senate'] != 'null') {
            details.innerHTML += 'State Senate: '.bold()
            if ((prop['State Senate'] == "Not competitive") | (prop['State Senate'] == "No election")) {
                stateSenate = "<span style='background-color:#cbafe9; color:#001940'>" + prop['State Senate'] + "</span>";
                details.innerHTML += stateSenate + "<br />";
            }
            else {
                stateSenate = "<span style='background-color:#f8f67e; color:#001940'>" + prop['State Senate'] + "</span>";
                details.innerHTML += stateSenate + "<br />";
            }
        }
        if (prop['State Senate Seat'] != 'null') {
            details.innerHTML += 'Competitive State Senate Races: '.bold() + prop['State Senate Seat'] + "<br />";
        }
        if (prop['Governor Cook Rating June'] != 'null') {
            details.innerHTML += 'Cook Rating (Governor): '.bold()
            if ((prop['Governor Cook Rating June'] == "Safe D") | (prop['Governor Cook Rating June'] == "Safe R")) {
                cookGovJune = "<span style='background-color:#cbafe9; color:#001940'>" + prop['Governor Cook Rating June'] + "</span>";
                details.innerHTML += cookGovJune + "<br />";
            }
            else {
                cookGovJune = "<span style='background-color:#f8f67e; color:#001940'>" + prop['Governor Cook Rating June'] + "</span>";
                details.innerHTML += cookGovJune + "<br />";
            }
        }
        if (prop['Senate Cook Rating June'] != 'null') {
            details.innerHTML += 'Cook Rating (Senate): '.bold()
            if ((prop['Senate Cook Rating June'] == "Safe D") | (prop['Senate Cook Rating June'] == "Safe R")) {
                cookSenateJune = "<span style='background-color:#cbafe9; color:#001940'>" + prop['Senate Cook Rating June'] + "</span>";
                details.innerHTML += cookSenateJune + "<br />";
            }
            else {
                cookSenateJune = "<span style='background-color:#f8f67e; color:#001940'>" + prop['Senate Cook Rating June'] + "</span>";
                details.innerHTML += cookSenateJune + "<br />";
            }
        }
        if (prop['Ballot Measures Include'] != 'null') {
            details.innerHTML += 'Ballot Measures Include: '.bold() + prop['Ballot Measures Include']+ "<br />";
        }
        if (prop['State Supreme Court Elections'] != 'null') {
            details.innerHTML += 'State Supreme Court Elections: '.bold() + prop['State Supreme Court Elections']+ "<br />";
        }
        if (prop['PGP Link'] != 'null') {
            let pgp_link = details.appendChild(document.createElement('a'));
            pgp_link.href = prop['PGP Link'];
            pgp_link.className = 'a';
            pgp_link.id = "link-" + prop.id;
            pgp_link.innerHTML = 'Princeton Gerrymandering Project Link'+ "<br />";
        }
        if (prop['Ballotpedia Link'] != 'null') {
            let ballot_link = details.appendChild(document.createElement('a'));
            ballot_link.href = prop['Ballotpedia Link'];
            ballot_link.className = 'a';
            ballot_link.id = "link-" + prop.id;
            ballot_link.innerHTML = 'More info on ballot measures' ;
        }
        });
    // Congressional-layer click and pop-up stuff
    map.on('click', 'congressional-layer', function(e) {
        e.originalEvent.cancelBubble = true; 
        let prop = e.features[0].properties
        let el = document.createElement('div');
        el.className = 'marker'
        console.log("clicked prop", prop);

        let myCongressionalTable = '<table> <tr> <th>' + "District" + '</th> <td>' + prop.District + '</td>' + 
                                   '<tr> <th>' + "Cook Rating" + '</th> <td>' + prop["June Cook Ratings"] + '</td>' + 
                                    '</table>'


        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myCongressionalTable)
            .addTo(map);
        });

    // State-House-layer click and pop-up stuff
    map.on('click', 'state-house', function(e) {
        e.originalEvent.cancelBubble = true; 
        let prop = e.features[0].properties
        let el = document.createElement('div');
        el.className = 'marker'
        console.log("clicked prop", prop);

        let myCongressionalTable = '<table> <tr> <th>' + "District" + '</th> <td>' + prop.DISTRICT + '</td>' + 
                                   '<tr> <th>' + "Lean" + '</th> <td>' + prop.LEAN + '</td>' + 
                                   '<tr> <th>' + "Dem. Cand." + '</th> <td>' + prop.NOM_D + '</td>' + 
                                   '<tr> <th>' + "Rep. Cand" + '</th> <td>' + prop.NOM_R + '</td>' + 


                                    '</table>'


        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myCongressionalTable)
            .addTo(map);
        });

    // State-House-layer click and pop-up stuff
    map.on('click', 'state-senate', function(e) {
        e.originalEvent.cancelBubble = true; 
        let prop = e.features[0].properties
        let el = document.createElement('div');
        el.className = 'marker'
        console.log("clicked prop", prop);

        let myCongressionalTable = '<table> <tr> <th>' + "District" + '</th> <td>' + prop.DISTRICT + '</td>' + 
                                   '<tr> <th>' + "Lean" + '</th> <td>' + prop.LEAN + '</td>' + 
                                   '<tr> <th>' + "Dem. Cand." + '</th> <td>' + prop.NOM_D + '</td>' + 
                                   '<tr> <th>' + "Rep. Cand" + '</th> <td>' + prop.NOM_R + '</td>' + 


                                    '</table>'


        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myCongressionalTable)
            .addTo(map);
        });

    // add legend on zoom
    var congressionalLegendEl = document.getElementById('congressional-legend');
    map.on('zoom', function() {
        if (map.getZoom() >= zoomThreshold) {
            congressionalLegendEl.style.display = 'block';
        } else {
        congressionalLegendEl.style.display = 'none';
        }
    });

    // add "Reset Map" 
    document.getElementById('zoom').addEventListener('click', function() {
        map.zoomTo(zoomThreshold);
        map.fitBounds(bbox, {
            linear: true,
            });
        map.setLayoutProperty('states-layer', 'visibility', 'visible');
    });

    // add address search thing
    map.addControl(
        new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
        })
    );

    // add plus/minus zoom button
    map.addControl(new mapboxgl.NavigationControl());
    
    // handle drop-down layer selections
    const stateLegLegend = document.getElementById('voter-power-legend')
    d3.select("#dropdown").on("change", function(e) {
        console.log("new selected layer is", this.value);
        clickedLayer = this.value;
        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
        // toggle layer visibility by changing the layout object's visibility property
        if (clickedLayer === 'congressional-layer') {
            map.setLayoutProperty('congressional-layer', 'visibility', 'visible');
            map.setLayoutProperty('congressional-border', 'visibility', 'visible');
            map.setLayoutProperty('states-layer', 'visibility', 'none');
            map.setLayoutProperty('state-house', 'visibility', 'none');
            map.setLayoutProperty('state-senate', 'visibility', 'none');
            congressionalLegendEl.style.display = 'block';
            stateLegLegend.style.display = 'none';
        } else if (clickedLayer === 'states-layer'){
            map.setLayoutProperty('states-layer', 'visibility', 'visible');
            map.setLayoutProperty('congressional-border', 'visibility', 'none');
            map.setLayoutProperty('congressional-layer', 'visibility', 'none');
            map.setLayoutProperty('state-house', 'visibility', 'none');
            map.setLayoutProperty('state-senate', 'visibility', 'none');
            congressionalLegendEl.style.display = 'none';
            stateLegLegend.style.display = 'none';
        } else if (clickedLayer === 'state-house'){
            map.setLayoutProperty('states-layer', 'visibility', 'none');
            map.setLayoutProperty('congressional-border', 'visibility', 'none');
            map.setLayoutProperty('congressional-layer', 'visibility', 'none');
            map.setLayoutProperty('state-house', 'visibility', 'visible');
            map.setLayoutProperty('state-senate', 'visibility', 'none');
            congressionalLegendEl.style.display = 'none';
            stateLegLegend.style.display = 'block';
        } else if (clickedLayer === 'state-senate'){
            map.setLayoutProperty('states-layer', 'visibility', 'none');
            map.setLayoutProperty('congressional-border', 'visibility', 'none');
            map.setLayoutProperty('congressional-layer', 'visibility', 'none');
            map.setLayoutProperty('state-house', 'visibility', 'none');
            map.setLayoutProperty('state-senate', 'visibility', 'visible');
            congressionalLegendEl.style.display = 'none';
            stateLegLegend.style.display = 'block';
        }
      });
});
