mapboxgl.accessToken = 'pk.eyJ1Ijoib3BlbnByZWNpbmN0cyIsImEiOiJjanVqMHJtM3gwMXdyM3lzNmZkbmpxaXpwIn0.ZU772lvU-NeKNFAkukT6hw';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/openprecincts/ckbazy0ec05n81imptth2lltu', // stylesheet location
});

map.on('load', function() {
    // Add a source for the state polygons.
    map.addSource('PEC-map', {
        'type': 'vector',
        'url': 'mapbox://openprecincts.PEC-map'
    });

    map.addLayer(
        {
            'id': 'state',
            'source': 'PEC-map',
            'source-layer': 'state',
            'minzoom': 0,
            'maxzoom': 5,
            'paint': {
            // 'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-opacity': 0,
                },
            'type': 'fill',
        }
    );

    map.addLayer(
        {
            'id': 'congressional',
            'source': 'PEC-map',
            'source-layer': 'congressional',
            'minzoom': 5,
            'paint': {
                // 'fill-color': 'rgba(200, 200, 140, 0.4)',
                'fill-opacity': 0,
                    },
            'type': 'fill',
        }
    );










    // // Need to add a layer so that states are click-y
    // map.addLayer({
    //     'id': 'states-layer',
    //     'type': 'fill',
    //     'source': 'states',
    //     'maxzoom': zoomThreshold,
    //     'paint': {
    //         'fill-color': 'rgba(200, 100, 240, 0.4)',
    //         'fill-opacity': 0,
    //     }
    // });

    // map.on('click', 'states-layer', function(e) {
    //     let el = document.createElement('div');
    //     el.className = 'marker';

    //     new mapboxgl.Popup(el)
    //         .setLngLat(e.lngLat)
    //         .setHTML(e.features[0].properties.STATEFP)
    //         .setHTML('<h3>' + e.features[0].properties.State + '</h3><p>' + e.features[0].properties["Senate Cook Rating June"] + '</p>')
    //         .addTo(map);
    //     });

    // map.on('mouseenter', 'states-layer', function() {
    //     map.getCanvas().style.cursor = 'pointer';
    // });
        
    //     // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'states-layer', function() {
    //      map.getCanvas().style.cursor = '';
    // });


});

