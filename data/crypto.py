import os
import time
#from bs4 import BeautifulSoup
from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.common.by import By

chrome_path = r"C:\Users\dell\Desktop\chromeDriver\chromedriver.exe"
driver = webdriver.Chrome(chrome_path)
url = r"https://www.cryptocompare.com/coins/list/USD/1"
driver.get(url)

table = driver.find_elements_by_class_name("table-coins")

prices = []

data = table[0].text.splitlines()

for x in data:
    prices.append(x)