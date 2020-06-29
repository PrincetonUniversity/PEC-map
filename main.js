// legend code and zoom by layer help from this code
// https://docs.mapbox.com/mapbox-gl-js/example/updating-choropleth/

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9, // this is in the CSS for map-container
      height = window.innerHeight * 0.7, // this is in the CSS for map-container
      margin = { top: 20, bottom: 50, left: 60, right: 40 };

mapboxgl.accessToken = 'pk.eyJ1Ijoib3BlbnByZWNpbmN0cyIsImEiOiJjanVqMHJtM3gwMXdyM3lzNmZkbmpxaXpwIn0.ZU772lvU-NeKNFAkukT6hw';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/openprecincts/ckbazy0ec05n81imptth2lltu', // stylesheet location    
});
// bounding box, defines extent of USA view
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

const zoomThreshold = 5;
let hoveredDistrictId = null;
var hoveredStateId = null;


map.on('load', function() {
    map.addSource('PEC-map', {
        'type': 'vector',
        'url': 'mapbox://openprecincts.PEC-mapV2'
    });

    map.addLayer(
        {
            'id': 'congressional-border',
            'type': 'line',
            'source': 'PEC-map',
            'source-layer': 'congressBoundary', 
            'minzoom': zoomThreshold,
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    'red',
                    'silver'
                ],
                'line-width': 1.5
            },
            
        });

    map.addLayer(
        {
            'id': 'states-layer',
            'source': 'PEC-map',
            'source-layer': 'state',
            'minzoom': 0,
            'maxzoom': zoomThreshold,
            // 'paint': { 'fill-opacity': 0 },
            'paint': {
                // 'fill-color': [
                //     'case',
                //     ['boolean', ['feature-state', 'hover'], false],
                //     'red',
                //     'blue'
                // ],
                // 'fill-opacity': .5
                'fill-opacity': 0
            },
            'type': 'fill',
        }
    );

    map.addLayer(
        {
            'id': 'congressional-layer',
            'source': 'PEC-map',
            'source-layer': 'congressFill',
            'minzoom': zoomThreshold,
            'paint': {
                'fill-opacity': 0,
                    },
            'type': 'fill',
        }
    );

    // State-layer click and pop-up stuff
    map.on('click', 'states-layer', function(e) {
        let prop = e.features[0].properties
        let el = document.createElement('div'); //parent
        let clickedStateBox = document.getElementById('clicked-info') 

        let clickedStateInfo = document.getElementById('state-info')
        clickedStateInfo.innerHTML = ""
        clickedStateBox.appendChild(clickedStateInfo)
        
        /* Add hyperlinked state name. */
        let title = clickedStateInfo.appendChild(document.createElement('div'));
        title.className = 'title';
        title.innerHTML = prop.State;
        
        /* Add details to the individual state info. */
        let details = clickedStateInfo.appendChild(document.createElement('div'));
        if (prop['Ballot Measures Include']) {
            details.innerHTML += 'Ballot Measures Include: '.bold() + prop['Ballot Measures Include']+ "<br />";
        }
        if (prop['State House']) {
            details.innerHTML += 'State House: '.bold()
            if ((prop['State House'] == "Not competitive") | (prop['State House'] == "No election")) {
                stateHouse = "<span style='background-color:purple; color:white'>" + prop['State House'] + "</span>";
                details.innerHTML += stateHouse + "<br />";
            }
            else {
                stateHouse = "<span style='background-color:green; color:white'>" + prop['State House'] + "</span>";
                details.innerHTML += stateHouse + "<br />";
            }
        }
        if (prop['State Senate']) {
            details.innerHTML += 'State Senate: '.bold()
            if ((prop['State Senate'] == "Not competitive") | (prop['State Senate'] == "No election")) {
                stateSenate = "<span style='background-color:purple; color:white'>" + prop['State Senate'] + "</span>";
                details.innerHTML += stateSenate + "<br />";
            }
            else {
                stateSenate = "<span style='background-color:green; color:white'>" + prop['State Senate'] + "</span>";
                details.innerHTML += stateSenate + "<br />";
            }
        }
        if (prop['Governor Cook Rating June']) {
            details.innerHTML += 'June Cook Rating (Governor): '.bold()
            if ((prop['Governor Cook Rating June'] == "Safe D") | (prop['Governor Cook Rating June'] == "Safe R")) {
                cookGovJune = "<span style='background-color:purple; color:white'>" + prop['Governor Cook Rating June'] + "</span>";
                details.innerHTML += cookGovJune + "<br />";
            }
            else {
                cookGovJune = "<span style='background-color:green; color:white'>" + prop['Governor Cook Rating June'] + "</span>";
                details.innerHTML += cookGovJune + "<br />";
            }
        }
        if (prop['Senate Cook Rating June']) {
            details.innerHTML += 'June Cook Rating (Senate): '.bold()
            if ((prop['Senate Cook Rating June'] == "Safe D") | (prop['Senate Cook Rating June'] == "Safe R")) {
                cookSenateJune = "<span style='background-color:purple; color:white'>" + prop['Senate Cook Rating June'] + "</span>";
                details.innerHTML += cookSenateJune + "<br />";
            }
            else {
                cookSenateJune = "<span style='background-color:green; color:white'>" + prop['Senate Cook Rating June'] + "</span>";
                details.innerHTML += cookSenateJune + "<br />";
            }
        }
        if (prop['State Supreme Court Elections']) {
            details.innerHTML += 'State Supreme Court Elections: '.bold() + prop['State Supreme Court Elections']+ "<br />";
        }
        if (prop['State Supreme Court Retention']) {
            details.innerHTML += 'State Supreme Court Retention? '.bold() + prop['State Supreme Court Retention']+ "<br />";
        }
        if (prop['PGP Link']) {
            let pgp_link = details.appendChild(document.createElement('a'));
            pgp_link.href = prop['PGP Link'];
            pgp_link.className = 'a';
            pgp_link.id = "link-" + prop.id;
            pgp_link.innerHTML = 'PGP Link'+ "<br />";
        }
        if (prop['Ballotpedia Link']) {
            let ballot_link = details.appendChild(document.createElement('a'));
            ballot_link.href = prop['Ballotpedia Link'];
            ballot_link.className = 'a';
            ballot_link.id = "link-" + prop.id;
            ballot_link.innerHTML = 'Ballotpedia Link' ;
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
                                   '<tr> <th>' + "June Cook Rating" + '</th> <td>' + prop["June Cook Ratings"] + '</td>' + 
                                    '</table>'


        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myCongressionalTable)
            .addTo(map);
        });
    
    // // When user moves mouse over the congressional-layer, update the feature state for the feature under the mouse
    // map.on('mousemove', 'congressional-border', function(e) {
    //     if (e.features.length > 0) {
    //         if (hoveredDistrictId) {
    //             map.setFeatureState(
    //                 { source: 'congressBoundary', id: hoveredDistrictId },
    //                 { hover: false }
    //             );
    //         }
    //         hoveredDistrictId = e.features[0].Code;
    //         map.setFeatureState(
    //             { source: 'congressBoundary', id: hoveredDistrictId },
    //             { hover: true }
    //         );
    //     }
    // });
        
    // // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'congressional-border', function(e) {
    //     if (hoveredDistrictId) {
    //         map.setFeatureState(
    //             { source: 'congressBoundary', id: hoveredDistrictId },
    //             { hover: false }
    //             );
    //         }
    //     hoveredStateId = null;
    // });
    
    map.on('mousemove', 'states-layer', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        hoveredStateId = parseInt(e.features[0].properties.STATEFP);
        console.log('hover state id second', hoveredStateId);
        map.setFeatureState({ 
            source: 'PEC-map', 
            sourceLayer: 'state', 
            id: hoveredStateId,
        },
            { hover: true }
        );
        map.getFeatureState({
            source: 'PEC-map', 
            sourceLayer: 'state', 
            id: hoveredStateId 
            });
        });
         
        // When the mouse leaves the state-fill layer, update the feature state of the
        // previously hovered feature.
        map.on('mouseleave', 'states-layer', function() {
        if (hoveredStateId) {
        map.setFeatureState({ 
            source: 'PEC-map', 
            sourceLayer: 'state', 
            id: hoveredStateId 
        },
        { hover: false }
        );
        }
        hoveredStateId = null;
        map.getCanvas().style.cursor = '';
        });


    // add legend on zoom
    var congressionalLegendEl = document.getElementById('congressional-legend');
    map.on('zoom', function() {
        if (map.getZoom() > zoomThreshold) {
            congressionalLegendEl.style.display = 'block';
        } else {
        congressionalLegendEl.style.display = 'none';
        }
    });

});


