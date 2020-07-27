# with "out-files" as working directory 

export MAPBOX_ACCESS_TOKEN=mytoken
tilesets add-source openprecincts congressFill ./house_dat.geojson
tilesets add-source openprecincts congressBoundary ./house_boundaries.geojson
tilesets add-source openprecincts state ./state_dat.geojson
tilesets create openprecincts.PEC-map --recipe ../recipe.json --name "PEC map"

tilesets publish openprecincts.PEC-map 

tilesets status openprecincts.PEC-map 