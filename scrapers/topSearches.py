from pymongo import MongoClient
import pymongo
from pytrends.request import TrendReq

pytrend = TrendReq()

interest_over_time_df = pytrend.trending_searches(pn='united_states')
returnData = interest_over_time_df.to_dict()

for x in returnData[0]:
    place = x + 1;
    topic = returnData[0][x];
    print(place, ' ', topic)