
# from bs4 import BeautifulSoup
# import requests

# r = requests.get(r"https://www.cryptocompare.com/")

# data = r.text
# soup = BeautifulSoup(data, 'html5lib')

# div = soup.div
# crypto = div.select("div", _class="panel-body")

# print(crypto)


import time
from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.common.by import By
from pymongo import MongoClient

chrome_path = r"C:\Users\dell\Desktop\chromeDriver\chromedriver.exe"
driver = webdriver.Chrome(chrome_path)

url = r"https://www.cryptocompare.com/coins/list/USD/1"
driver.get(url)

time.sleep(15)
table = driver.find_elements_by_class_name("table-coins")

data = table[0].text.splitlines()

client = MongoClient()
db = client['crypto']
prices = db.crypto_data_prices

x = 7

while x < len(data):
    entry = {}
    entry['id#'] = data[x]
    entry['coinName'] = data[x + 1]
    entry['coinSName'] = data[x + 2]
    entry['coinPrice'] = data[x + 3]
    entry['coinTotal'] = data[x + 4]
    entry['coin24'] = data[x + 5]
    x += 6
    prices.insert_one(entry)
    

