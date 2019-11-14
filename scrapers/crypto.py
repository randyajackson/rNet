import time
import sys
from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from pymongo import MongoClient
import pymongo
import threading
import datetime
from datetime import datetime

#ready for launch
#chromedriver --url-base=/wd/hub

chrome_options = Options()
chrome_options.headless = True
#chrome_options.add_argument('--headless')
#chrome_options.add_argument('window-size=1920x1080')
driver = webdriver.Chrome("/usr/bin/chromedriver", chrome_options = chrome_options)


url = r"https://www.cryptocompare.com/coins/list/USD/1"
driver.get(url)

time.sleep(15)
client = MongoClient()

#collect grabs the state of the data every 5 seconds
db2 = client['cryptoDebug']
debug = db2.crypto_debug

def collect():
    threading.Timer(5.0, collect).start()
    table = driver.find_elements_by_class_name("table-coins")

    if table[0]:
        data = table[0].text.splitlines()
    else:
        time.sleep(60*10)
        collect()
    
    db = client['crypto']
    prices = db.crypto_data_prices

    #if sponsored exists, set x to 11
    x = 1
    # print(data)
    
     
    if "crypto_data_prices" in db.list_collection_names():
        while x < len(data): 
            # print(data[x])
            # print(data[x + 1])
            # print(data[x + 2])
            # print(data[x + 3])
            # print(data[x + 4])
            # print(data[x + 6]) 
            prices.update_one(
                {"coinName" : data[x + 1] },
                    {"$set" :
                        {
                            'id#' : data[x],
                            'coinName' : data[x + 1],
                            'coinSName' : data[x + 2],
                            'coinPrice' : data[x + 3],
                            'coinTotal' : data[x + 4],
                            'coin24' : data[x + 6]
                        }
                    }
            )
            x += 7
    else:
        while x < len(data):
            # print(data[x])
            # print(data[x + 1])
            # print(data[x + 2])
            # print(data[x + 3])
            # print(data[x + 4])
            # print(data[x + 6]) 

            prices.insert_one(
                {
                    'id#' : data[x],
                    'coinName' : data[x + 1],
                    'coinSName' : data[x + 2],
                    'coinPrice' : data[x + 3],
                    'coinTotal' : data[x + 4],
                    'coin24' : data[x + 6]        
                }
            )
            x += 7

    driver.refresh()
    time.sleep(5)

try:
    collect()
except:
        e = str( sys.exc_info()[0] )

        name = str( 'Cryptocurrency' )
        dateOfIssue = str( "{:%B %d, %Y}".format(datetime.now()) )
        error = str( 'Error with updating database: %s' % e )

        debug.insert_one(
            {
                'name' : name,
                'dateOfIssue' : dateOfIssue,
                'error' : error
            }
        )
        
        print("error")
    

