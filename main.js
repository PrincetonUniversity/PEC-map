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
    center: [-96.527, 38.233],
    zoom: 3.5
});

const svg = d3
      .select("#map-container")
      .append("svg")    
      .attr("width", width)
      .attr("height", height);

const zoomThreshold = 5;

map.on('load', function() {
    map.addSource('PEC-map', {
        'type': 'vector',
        'url': 'mapbox://openprecincts.PEC-map'
    });

    map.addLayer(
        {
            'id': 'states-layer',
            'source': 'PEC-map',
            'source-layer': 'state',
            'minzoom': 0,
            'maxzoom': zoomThreshold,
            'paint': {
            'fill-opacity': 0,
                },
            'type': 'fill',
        }
    );

    map.addLayer(
        {
            'id': 'congressional-layer',
            'source': 'PEC-map',
            'source-layer': 'congressional',
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

        let clickedStateInfo = clickedStateBox.appendChild(el)

        clickedStateInfo.insertBefore(el, clickedStateInfo.firstElementChild)


        clickedStateInfo.id = "state-" + prop.State;
        clickedStateInfo.className = 'item';
        
        /* Add hyperlinked state name. */
        let link = clickedStateInfo.appendChild(document.createElement('a'));
        link.href = prop['PGP Link'];
        link.className = 'title';
        link.id = "link-" + prop.id;
        link.innerHTML = prop.State;
        
        /* Add details to the individual state info. */
        let details = clickedStateInfo.appendChild(document.createElement('div'));
        if (prop['Ballot Measures Include']) {
            details.innerHTML += 'Ballot Measures Include: '.bold() + prop['Ballot Measures Include']+ "<br />";
        }
        if (prop['State House']) {
            details.innerHTML += 'State House: '.bold() + prop['State House'] + "<br />";
        }
        if (prop['State Senate']) {
            details.innerHTML += 'State Senate: '.bold() + prop['State Senate'] + "<br />";
        }
        if (prop['Governor Cook Rating June']) {
            details.innerHTML += 'June Cook Rating (Governor): '.bold() + prop['Governor Cook Rating June']+ "<br />";
        }
        if (prop['Senate Cook Rating June']) {
            details.innerHTML += 'June Cook Rating (Senate): '.bold() + prop['Senate Cook Rating June']+ "<br />";
        }
        if (prop['State Supreme Court Elections']) {
            details.innerHTML += 'State Supreme Court Elections: '.bold() + prop['State Supreme Court Elections']+ "<br />";
        }
        if (prop['State Supreme Court Retention']) {
            details.innerHTML += 'State Supreme Court Retention? '.bold() + prop['State Supreme Court Retention']+ "<br />";
        }
        if (prop['Ballotpedia Link']) {
            let ballot_link = details.appendChild(document.createElement('a'));
            ballot_link.href = prop['Ballotpedia Link'];
            ballot_link.className = 'a';
            ballot_link.id = "ballot_link-" + prop.id;
            ballot_link.innerHTML = 'Ballotpedia Link';
        }
        });

    // Congressional-layer click and pop-up stuff
    map.on('click', 'congressional-layer', function(e) {
        let prop = e.features[0].properties
        let el = document.createElement('div');
        el.className = 'marker'

        let myCongressionalTable = '<table> <tr> <th>' + "District" + '</th> <td>' + prop.District + '</td>' + 
                                   '<tr> <th>' + "June Cook Rating" + '</th> <td>' + prop["June Cook"] + '</td>' + 
                                '</table>'

        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myCongressionalTable)
            .addTo(map);
        });

    map.on('mouseenter', 'congressional-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });
        
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'congressional-layer', function() {
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

