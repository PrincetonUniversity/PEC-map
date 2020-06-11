# with "out-files" as working directory 

export MAPBOX_ACCESS_TOKEN=mytoken
tilesets add-source openprecincts congressional ./house_dat_june11.geojson
tilesets add-source openprecincts state ./state_dat_june11.geojson
tilesets create openprecincts.PEC-map --recipe ../recipe.json --name "PEC map V1"

tilesets publish openprecincts.PEC-map 