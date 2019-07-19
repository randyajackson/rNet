import time
from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.common.by import By
from pymongo import MongoClient
import threading

chrome_path = r"C:\Users\dell\Desktop\chromeDriver\chromedriver.exe"
driver = webdriver.Chrome(chrome_path)


url = r"https://www.cryptocompare.com/coins/list/USD/1"
driver.get(url)

time.sleep(15)

#collect grabs the state of the data every 5 seconds

def collect():
    threading.Timer(5.0, collect).start()
    table = driver.find_elements_by_class_name("table-coins")

    data = table[0].text.splitlines()

    client = MongoClient()
    db = client['crypto']
    prices = db.crypto_data_prices

    x = 7

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
                        'coin24' : data[x + 5]
                    }
                }
        )
        x += 6

    driver.refresh()
    time.sleep(5)

collect()

    

