import pymongo
import json
from pymongo import MongoClient, InsertOne

client = pymongo.MongoClient('mongodb+srv://dramaTrack:stemisbae123@cluster0.cr2ng.mongodb.net/myFirstDatabase')
db = client.myfirstdatabase
collection = db.dramaTrack
requesting = []


with open(r"betterjson.json") as f:
    data = json.load(f)
    for jsonObj in data:
        requesting.append(InsertOne(jsonObj))

result = collection.bulk_write(requesting)
client.close()