# with "out-files" as working directory 

export MAPBOX_ACCESS_TOKEN=mytoken
tilesets add-source openprecincts congressFill ./house_dat_june24.geojson
tilesets add-source openprecincts congressBoundry ./house_boundaries.geojson
tilesets add-source openprecincts state ./state_dat_june11.geojson
tilesets create openprecincts.PEC-mapV2 --recipe ../recipe.json --name "PEC map V2"

tilesets publish openprecincts.PEC-mapV2 

tilesets status openprecincts.PEC-mapV2 

# update the recipe with new data 
tilesets delete-source openprecincts state # delete old source
tilesets add-source openprecincts state2 ./state_dat_june29.geojson # upload new data.
tilesets update-recipe openprecincts.PEC-mapV2 ../recipe.json # update recipe; not sure why this is not working 



