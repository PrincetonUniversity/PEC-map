'''
Expected input: 
- Sheets from PEC map data: https://docs.google.com/spreadsheets/d/1ZeLXuXxy4Lq-ql3mik143eVWQyGHHWaEi9NF6jjyR1s/edit?ts=5ed01946#gid=0
- Shapefile of congressional districts
- Shapefile of US states

Expected output:
- geojson of congressional districts with congressional data to display
- geojson of US states with state data to display
'''
import pandas as pd 
import geopandas as gpd

# PEC data 
cong = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - House.csv")
gov = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - Governors.csv")
redistrict = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - Redistricting.csv")
referenda = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - Referenda.csv")
senate = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - Senate.csv")
stleg = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - State Legislatures.csv")
supreme = pd.read_csv("/Users/hopecj/projects/PEC/map/data/PEC Map Data 2020  - State Supreme Court.csv")

# Shapefiles of US congressional districts and US states
cong_shp = gpd.read_file("/Users/hopecj/projects/PEC/map/data/cb_2019_us_cd116_500k/cb_2019_us_cd116_500k.shp")


# State code to state FIPS crosswalk
fips = pd.read_csv("/Users/hopecj/Downloads/StateFIPSicsprAB.csv")

cong = cong.merge(fips, left_on='State', right_on='AB')

cd_code = cong["District"].str.split(pat = "-", expand=True)
cong["CD"] = cd_code[1]
cong["fips"] = cong['FIPS'].map("{:02}".format)

cong["Code"] = cong["fips"] + cong["CD"] # this is what we'll need to match to state legislative boundaries (mapbox)
cong['Code'] = cong['Code'].astype(str)

# Congressional map
cong_shp['Code'] = cong_shp["STATEFP"] + cong_shp["CD116FP"]
cong_shp['Code'] = cong_shp['Code'].astype(str)
out.groupby(['June Cook Ratings']).agg(['count']) # check for any misspelling 
out.groupby(['April Cook Ratings']).agg(['count']) # check for any misspelling 

# Merge them 
out = cong_shp.merge(cong, on='Code')
out = out[["NAME", "District", "Code", "D", "R", "April Cook Ratings",
           "June Cook Ratings", "Opposition Primary", "geometry"]]

# next: merge with full congressional map in QGIS
# then save as geojson
out.to_file("cong_dat.shp")