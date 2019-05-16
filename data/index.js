const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();