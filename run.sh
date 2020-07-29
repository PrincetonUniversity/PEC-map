# with "out-files" as working directory 

export MAPBOX_ACCESS_TOKEN=mytoken
tilesets add-source openprecincts congressFill ./house_dat.geojson
tilesets add-source openprecincts congressBoundry ./house_boundaries.geojson
tilesets add-source openprecincts state ./state_dat_june11.geojson
tilesets create openprecincts.PEC-mapV3 --recipe ../recipe.json --name "PEC map V3"

tilesets publish openprecincts.PEC-mapV3 

tilesets status openprecincts.PEC-mapV3 

# update the recipe with new data 
tilesets delete-source openprecincts state # delete old source
tilesets add-source openprecincts state2 ./state_dat_june29.geojson # upload new data.
tilesets update-recipe openprecincts.PEC-mapV3 ../recipe.json # update recipe; not sure why this is not working 


## update-recipe error message:
# Traceback (most recent call last):
#   File "/usr/local/bin/tilesets", line 10, in <module>
#     sys.exit(cli())
#   File "/usr/local/lib/python3.7/site-packages/click/core.py", line 764, in __call__
#     return self.main(*args, **kwargs)
#   File "/usr/local/lib/python3.7/site-packages/click/core.py", line 717, in main
#     rv = self.invoke(ctx)
#   File "/usr/local/lib/python3.7/site-packages/click/core.py", line 1137, in invoke
#     return _process_result(sub_ctx.command.invoke(sub_ctx))
#   File "/usr/local/lib/python3.7/site-packages/click/core.py", line 956, in invoke
#     return ctx.invoke(self.callback, **ctx.params)
#   File "/usr/local/lib/python3.7/site-packages/click/core.py", line 555, in invoke
#     return callback(*args, **kwargs)
#   File "/usr/local/lib/python3.7/site-packages/mapbox_tilesets/scripts/cli.py", line 286, in update_recipe
#     raise errors.TilesetsError(r.text)
# mapbox_tilesets.errors.TilesetsError