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
driver = webdriver.Chrome("/usr/bin/chromedriver", chrome_options = chrome_options)

client = MongoClient()

db2 = client['cryptoDebug']
debug = db2.crypto_debug

db = client['crypto']
prices = db.crypto_data_prices

proceed = True

def collect():
    global proceed

    table = driver.find_elements_by_class_name("table-coins")
    
    try:
        data = table[0].text.splitlines()
    except:
        proceed = False
        return

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
            try:
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
            except IndexError:
                proceed = False
                return


    else:
        while x < len(data):
            # print(data[x])
            # print(data[x + 1])
            # print(data[x + 2])
            # print(data[x + 3])
            # print(data[x + 4])
            # print(data[x + 6]) 
            try:
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
            except IndexError:
                proceed = False
                return


    driver.refresh()
    time.sleep(5)
    return
    
def connect():
    url = r"https://www.cryptocompare.com/coins/list/USD/1"
    driver.get(url)
    time.sleep(15)
    return

def gatherer():
    
    connect()

    while(True):
        global proceed

        if (proceed == True):
            collect()
        else:
            print("sleeping")
            time.sleep(60*10)
            proceed = True

            name = str( 'Cryptocurrency' )
            dateOfIssue = str( "{:%B %d, %Y}".format(datetime.now()) )
            error = str( 'Error with updating database' )

            debug.insert_one(
                {
                    'name' : name,
                    'dateOfIssue' : dateOfIssue,
                    'error' : error
                }
            )
            connect()

#this function starts the process on first run
gatherer()
