from pymongo import MongoClient
import pymongo

from pytrends.request import TrendReq

pytrend = TrendReq()

interest_over_time_df = pytrend.trending_searches(pn='united_states')
returnData = interest_over_time_df.to_dict()

client = MongoClient()
db = client['googleSearches']
db.top_searches.drop()
searches = db.top_searches

for x in returnData[0]:
    rank = x + 1;
    topic = returnData[0][x];

    searches.insert_one({'rank' : rank, 'topic' : topic})