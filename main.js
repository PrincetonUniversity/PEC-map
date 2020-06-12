mapboxgl.accessToken = 'pk.eyJ1Ijoib3BlbnByZWNpbmN0cyIsImEiOiJjanVqMHJtM3gwMXdyM3lzNmZkbmpxaXpwIn0.ZU772lvU-NeKNFAkukT6hw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/openprecincts/ckbazy0ec05n81imptth2lltu', // stylesheet location
});

map.on('load', function() {
    // Add a source for the state polygons.
    map.addSource('states', {
    'type': 'geojson',
    'data': './out-files/state_dat_june11.geojson'
    });

    // this can be used to add state label 
    // map.addLayer({
    //     id: "state-name",
    //     type: "symbol",
    //     source: "states",
    //     layout: {
    //         "text-field": "{STATEFP}\n",
    //         // "text-font": ["Open Sans"],
    //         "text-size": 12,
    //         'symbol-placement': "point"
    //     },
    //     paint: {
    //         "text-color": ["case",
    //             ["boolean", ["feature-state", "hover"], false],
    //             'rgba(255,0,0,0.75)',
    //             'rgba(0,0,0,0.75)'
    //         ],
    //         "text-halo-color": ["case",
    //             ["boolean", ["feature-state", "hover"], false],
    //             'rgba(255,255,0,0.75)',
    //             'rgba(255,255,255,0.75)'
    //         ],
    //         "text-halo-width": 2,
    //         "text-halo-blur": 0,
    //     }
    // });

    // Need to add a layer so that states are click-y
    map.addLayer({
        'id': 'states-layer',
        'type': 'fill',
        'source': 'states',
        'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-opacity': 0,
        }
    });

    map.on('click', 'states-layer', function(e) {
        let el = document.createElement('div');
        el.className = 'marker';

        new mapboxgl.Popup(el)
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.STATEFP)
            .setHTML('<h3>' + e.features[0].properties.State + '</h3><p>' + e.features[0].properties["Senate Cook Rating June"] + '</p>')
            .addTo(map);
        });

    map.on('mouseenter', 'states-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });
        
        // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'states-layer', function() {
         map.getCanvas().style.cursor = '';
    });


});

