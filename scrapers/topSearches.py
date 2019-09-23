import time
import sys
import datetime
from datetime import datetime

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

db2 = client['googleSearchesDebug']
debug = db2.top_searches_debug

try:
    for x in returnData[0]:
        rank = x + 1;
        topic = returnData[0][x];

        searches.insert_one({'rank' : rank, 'topic' : topic})
except:
    e = sys.exc_info()[0]

    debug.insert_one(
        {
            'name' : str( 'Google Searches' ),
            'dateOfIssue' : str( "{:%B %d, %Y}".format(datetime.now()) ),
            'error' : str( 'Error with updating database: %s' % e )
        }
    )
    print("error")
