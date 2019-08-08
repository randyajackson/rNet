import PIL
from PIL import Image
import pandas as pd
import numpy as np
from pymongo import MongoClient

#creating art-data database in mongodb
client = MongoClient()
db = client['art-data']
pictures = db.art_data_full

print(pictures)

Image.MAX_IMAGE_PIXELS = None

data = pd.read_csv("all_data_info_in_train.csv")
missing = 0

#I ran into issues with going over the MongoDB 16mb/collection
#Tried solutions like reducing the size and that does work
#however, when reporting the results I wanted them true to scale.

for z in range(505, 1000):
    im = Image.open("img/" + data['new_filename'][z], 'r')
    
    # basewidth = 1000
    
    # wpercent = (basewidth / float(im.size[0]))
    # hsize = int((float(im.size[1]) * float(wpercent)))
    # im = im.resize((basewidth, hsize), PIL.Image.ANTIALIAS)

    #print statement to keep up with which picture is being processed
    print("in " + str(z))
    
    #total is the whole collection with other data
    total = {}

    #full dict is a sub dict, which after several iterations returns the best runtimes
    #i first assumed that mongodb worked like a hashtable so put all fields in one big collection
    #it doesn't.
    #an array of sub dicts with key value combinations ended up being the way to go with this one.
    fullDict = {}
    
    intoMongo = []

    initial = 1
    id = 0

    for x in iter(im.getdata()):
        if(str(x) not in fullDict):
            fullDict[str(x)] = initial

        else:
            temp = fullDict[str(x)]
            temp += 1
            fullDict[str(x)] = temp

    for key in fullDict:
        entry = {}
        entry['color'] = key
        entry['value'] = fullDict[key]
        intoMongo.append(entry)
    
    total['colors'] = intoMongo
    total['artist'] = data['artist'][z]
    total['date'] = data['date'][z]
    total['genre'] = data['genre'][z]
    total['style'] = data['style'][z]
    total['title'] = data['title'][z]
    total['fileName'] ="colorsearch/img/" + data['new_filename'][z]
    try:
        result = pictures.insert_one(total)
    except:
        continue
    
