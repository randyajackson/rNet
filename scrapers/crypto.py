import time
import sys
from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.common.by import By
from pymongo import MongoClient
import pymongo
import threading
import datetime
from datetime import datetime

chrome_path = r"C:\Users\dell\Desktop\chromeDriver\chromedriver.exe"
driver = webdriver.Chrome(chrome_path)


url = r"https://www.cryptocompare.com/coins/list/USD/1"
driver.get(url)

time.sleep(15)

#collect grabs the state of the data every 5 seconds

def collect():
    threading.Timer(5.0, collect).start()
    table = driver.find_elements_by_class_name("table-coins")

    if table[0]:
        data = table[0].text.splitlines()
    else:
        time.sleep(60*10)
        collect()


    client = MongoClient()

    db = client['crypto']
    prices = db.crypto_data_prices

    db2 = client['cryptoDebug']
    debug = db2.crypto_debug

    x = 1
    #print(data)
    try: 
        if "crypto_data_prices" in db.list_collection_names():
            while x < len(data):  
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
                prices.insert_one(
                    {
                        'id#' : data[x],
                        'coinName' : data[x + 1],
                        'coinSName' : data[x + 2],
                        'coinPrice' : data[x + 3],
                        'coinTotal' : data[x + 4],
                        'coin24' : data[x + 5]        
                    }
                )
                x += 7
    except:
            e = sys.exc_info()[0]

            debug.insert_one(
                {
                    'dateOfIssue' : "{:%B %d, %Y}".format(datetime.now()),
                    'error' : 'Error with updating database: %s' % e
                }
            )
            print("error")

    driver.refresh()
    time.sleep(5)

collect()

    

