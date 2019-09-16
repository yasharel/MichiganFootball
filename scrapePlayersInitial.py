import pyodbc
import pandas as pd 
import time
import os
import random
import selenium 
from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC
from datetime import date, timedelta
import calendar

#%%
url = 'https://www.ourlads.com/ncaa-football-depth-charts/roster/michigan/91119'

browser = webdriver.Chrome()
browser.get(url)

#%%
cnxn  = pyodbc.connect(
    driver = '*****', \
    server = '*****', \
    database = '****', \
    uid = '*****', \
    pwd = '****')

cursor = cnxn.cursor()

#%%
mainTable = browser.find_element_by_xpath("//*[@id='ctl00_phContent_dcTBody']")
rows = mainTable.find_elements(By.TAG_NAME, "tr")

i = 0

for players in rows:

    if(i != 0):
        weekIndex = 2

        j = 0
        position = ""

        fullName = players.find_elements(By.TAG_NAME, "td")[0].text

        tempName = ','.join(reversed(fullName.split(', ')))
        tempName = tempName[0] + '. '

        commaPosition = fullName.find(',')
        
        abvName = fullName[:commaPosition]
        abvName = tempName + abvName

        fullName = ' '.join(reversed(fullName.split(', ')))

        position = players.find_elements(By.TAG_NAME, "td")[2].text

        if position == "QB":
            position = "Quarterback"
        elif position == "RB":
            position = "Running Back"
        elif position == "TE":
            position = "Tight End"
        elif position == "WR":
            position = "Wide Reciever"
        elif position == "PK":
            position = "Kicker"   
        elif position == "P":
            position = "Punter"
        else:
            position = "Defender"

        string = "insert into Players(weekIndex, fullName, position, touchdowns, interceptions, sacks, rushingYards, recievingYards, tackles, extraPoints, fieldGoals, throwingYards, touchdownsRushing, touchdownsRecieving, abvName) values ('"
        string = string + str(weekIndex)
        string = string + "', '"
        string = string + fullName
        string = string + "', '"
        string = string + position
        string = string + "', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'"
        string = string + ", '"
        string = string + abvName
        string = string + "')"
        cursor.execute(string)
        cnxn.commit()
    
    i = i + 1
browser.close()