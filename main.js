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
            // 'fill-color': 'rgba(200, 100, 240, 0.4)',
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
                // 'fill-color': 'rgba(200, 200, 140, 0.4)',
                'fill-opacity': 0,
                    },
            'type': 'fill',
        }
    );

    // State-layer click and pop-up stuff
    map.on('click', 'states-layer', function(e) {
        let el = document.createElement('div');
        el.className = 'marker';

        // let myTable = '<h3>' + e.features[0].properties.State + '</h3> <p>' + e.features[0].properties["Ballotpedia Link"] + '</p>'
        let myTable = '<table> <tr> <th>' + "State" + '</th> <td>' + e.features[0].properties.State + '</td>' + 
                      '<tr> <th>' + "State House" + '</th> <td>' + e.features[0].properties["State House"] + '</td>' + 
                      '<tr> <th>' + "State Senate" + '</th> <td>' + e.features[0].properties["State Senate"] + '</td>' + 
                      '<tr> <th>' + "Senate Cook Rating June" + '</th> <td>' + e.features[0].properties['Senate Cook Rating June'] + '</td>' + 
                      '<tr> <th>' + "Governor Cook Rating June" + '</th> <td>' + e.features[0].properties["Governor Cook Rating June"] + '</td>' + 
                    '</table>'

        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(myTable)
            .addTo(map);
        });

    map.on('mouseenter', 'states-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });
        
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'states-layer', function() {
         map.getCanvas().style.cursor = '';
    });

    // Congressional-layer click and pop-up stuff
    map.on('click', 'congressional-layer', function(e) {
        let el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.STATEFP)
            .setHTML('<h3>' + e.features[0].properties.District + '</h3><p>' + e.features[0].properties["June Cook"] + '</p>')
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

