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
cong = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - House.csv")
gov = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - Governors.csv")
redistrict = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - Redistricting.csv")
referenda = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - Referenda.csv")
senate = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - Senate.csv")
stleg = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - State Legislatures.csv")
supreme = pd.read_csv("/Users/hopecj/projects/PEC/PEC-map/data/PEC Map Data 2020  - State Supreme Court.csv")

# Shapefiles
cong_shp = gpd.read_file("/Users/hopecj/projects/PEC/PEC-map/data/cb_2019_us_cd116_500k/cb_2019_us_cd116_500k.shp")
state_shp = gpd.read_file("/Users/hopecj/projects/PEC/PEC-map/data/cb_2018_us_state_500k/cb_2018_us_state_500k.shp")

# State-code-to-state-FIPS crosswalk
fips = pd.read_csv("/Users/hopecj/Downloads/StateFIPSicsprAB.csv")

################################
#  CREATE CONGRESSIONAL DATA   #
################################
cong = cong.merge(fips, left_on='State', right_on='AB')

cd_code = cong["District"].str.split(pat = "-", expand=True)
cong["CD"] = cd_code[1]
cong["fips"] = cong['FIPS'].map("{:02}".format)

cong["Code"] = cong["fips"] + cong["CD"] # this is what we'll need to match to state legislative boundaries (mapbox)
cong['Code'] = cong['Code'].astype(str)
cong.groupby(['June Cook Ratings']).agg(['count']) # check for any misspelling 
cong.groupby(['April Cook Ratings']).agg(['count']) # check for any misspelling 

# Congressional map
cong_shp['Code'] = cong_shp["STATEFP"] + cong_shp["CD116FP"]
cong_shp['Code'] = cong_shp['Code'].astype(str)

# Merge them 
cong_out = cong_shp.merge(cong, on='Code')
cong_out = cong_out[["NAME", "District", "Code", "D", "R", "April Cook Ratings",
           "June Cook Ratings", "Opposition Primary", "geometry"]]

# next: merge with full congressional map in QGIS
# then save as geojson
cong_out.to_file("cong_dat.shp")

###############################
#      CREATE STATE DATA      #
###############################
senate['State'] = senate['State'].str.replace(' ', '')
gov['State'] = gov['State'].str.replace(' ', '')
stleg['State'] = stleg['State'].str.replace(' ', '')


st_data = senate.merge(gov, how='outer')
st_data = st_data.merge(stleg, how='outer')
st_data = st_data.merge(redistrict, how='outer')
st_data = st_data.merge(referenda, how='outer')
st_data = st_data.merge(supreme, how='outer')
list(st_data.columns)
st_data['STUSPS'] = st_data['State']
st_data.groupby(['STUSPS']).agg(['count']) 

st_out = state_shp.merge(st_data, on='STUSPS')
st_out = st_out[['STATEFP', 'State', 'Senate Special', 'Senate D',
       'Senate R', 'Senate Cook Rating April', 'Senate Comments',
       'Senate Cook Rating June', 'Governor D', 'Governor R',
       'Governor Opposition Primary', 'Governor Cook Rating April',
       'Governor Comments', 'Governor Cook Rating June', 'State House',
       'State Senate', 'State Legislature April CNalysis rating',
       'State Legislature Comments', 'State Legislature June CNalysis rating',
       'PGP Link', 'Ballot Measures Include', 'Ballotpedia Link',
       'State Supreme Court Elections', 'State Supreme Court Ballotpedia Link',
       'State Supreme Court Retention', 'State Supreme Court Comments', 'geometry']]
st_out.to_file("state_dat.shp")
st_out.to_file("/Users/hopecj/projects/PEC/PEC-map/out-files/state_dat_june11.geojson", driver="GeoJSON")

###############################################
# update features /(column names) of geojson files
#
# names will be changed if I merge it with another 
# shapefile in geojson due to column name limits
###############################################

#congressional
out_cong = gpd.read_file("/Users/hopecj/projects/PEC/PEC-map/out-files/house_dat.geojson")
out_cong.columns
out_cong = out_cong.rename(columns={'Opposition': 'Opposition Primary'})
out_cong.to_file("/Users/hopecj/projects/PEC/PEC-map/out-files/house_dat_june11.geojson", driver="GeoJSON")

# cong = gpd.read_file("/Users/hopecj/projects/PEC/PEC-map/out-files/house_dat_june11.geojson")
# list(cong.columns)


# #state
# out_st = gpd.read_file("/Users/hopecj/projects/PEC/state_dat.shp")
# list(out_st.columns)
# out_st = out_st.rename(columns={'Senate Spe': 'Senate Special',
#                                 'Senate Coo': 'Senate Cook April',
#                                 'Senate Com': 'Senate Comments',
#                                 'Senate C_1': 'Senate Cook June',
#                                 'Governor O': 'Governor Opposition Primary',
#                                 'Governor C': 'Governor Cook April',
#                                 'Governor_1': 'Governor Comments',
#                                 'Governor_2': 'Governor Cook June',
#                                 'State Hous': 'State House',
#                                 'State Sena': 'State Senate',
#                                 'State Legi': 'State Legislature April CNalysis rating',
#                                 'State Le_1': 'State Legislature Comments',
#                                 'State Le_2': 'State Legislature June CNalysis rating',
#                                 'Ballot Mea': 'Ballot Measures Include',
#                                 'Ballotpedi': 'Ballotpedia Link',
#                                 'State Supr': 'State Supreme Court Elections',
#                                 'State Su_1': 'State Supreme Court Ballotpedia Link',
#                                 'State Su_2': 'State Supreme Court Retention',
#                                 'State Su_3': 'State Supreme Court Comments'})
