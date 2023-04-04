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
# chrome_options.add_argument('log-level=3')
driver = webdriver.Chrome("/usr/bin/chromedriver", chrome_options = chrome_options)
# driver = webdriver.Chrome(r"C:\\Users\\Randy\\Desktop\\Programming\\crypto\\chromedriver\\chromedriver.exe", chrome_options = chrome_options)

client = MongoClient()

db2 = client['cryptoDebug']
debug = db2.crypto_debug

db = client['crypto']
prices = db.crypto_data_prices

proceed = True

def collect():
    global proceed
    # print(driver)
    table = driver.find_elements_by_class_name("rc-table-row.rc-table-row-level-0")

    data = []
    
    try:
        for x, output in enumerate(table):
            data.append(table[x].text.splitlines())
    except:
        proceed = False
        return
    
    x = 0
    # print("*****************************TEST")
    # print(data)
    # print('Coin Name' + data[0][0]) 
    # print('Short Name' + data[0][1]) 
    # print('Price' + data[0][2])
    # print('Total Volume' + data[0][4])   
    # print('24' + data[0][3]) 
    
    if "crypto_data_prices" in db.list_collection_names():
        while x < len(data): 
            try:
                prices.update_one(
                    {"coinName" : data[x][0]},
                        {"$set" :
                            {
                                'id#' : x,
                                'coinName' : data[x][0],
                                'coinSName' : data[x][1],
                                'coinPrice' : data[x][2],
                                'coinTotal' : data[x][4],
                                'coin24' : data[x][3]
                            }
                        }
                )
                x += 1
            except IndexError:
                proceed = False
                return
    else:
        # print(data)
        # print(x)
        # print(data[x][0])
        # print(data[x][1])
        # print(data[x][2])
        # print(data[x][7])
        # print(data[x][3])
      
        while x < len(data):
            try:
                prices.insert_one(
                    {
                        'id#' : x,
                        'coinName' : data[x][0],
                        'coinSName' : data[x][1],
                        'coinPrice' : data[x][2],
                        'coinTotal' : data[x][4],
                        'coin24' : data[x][3]
                    }
                )
                x += 1
            except IndexError:
                proceed = False
                return


    driver.refresh()
    time.sleep(5)
    return
    
def connect():
    url = r"https://www.binance.us/en/markets"
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
