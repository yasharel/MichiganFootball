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
cnxn  = pyodbc.connect(
    driver = '*****', \
    server = '*****', \
    database = '****', \
    uid = '*****', \
    pwd = '****')

cursor = cnxn.cursor()


#%%

url = 'https://www.sports-reference.com/cfb/schools/michigan/2019.html'

browser = webdriver.Chrome()
browser.get(url)

#%%

passingTable = browser.find_element_by_xpath("//*[@id='passing']/tbody")

passingPlayers = passingTable.find_elements(By.TAG_NAME, "tr")

for player in passingPlayers:
    name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
    yards = str(player.find_elements(By.TAG_NAME, "td")[4].text)
    touchdowns = str(player.find_elements(By.TAG_NAME, "td")[7].text)
    interceptions = str(player.find_elements(By.TAG_NAME, "td")[8].text)
    string = "update SeasonStats set throwingYards = '" + yards
    string = string + "', touchdowns = '" + touchdowns
    string = string + "', interceptions = '" + interceptions
    string = string + "' where fullName = '" + name
    string = string + "'"
    cursor.execute(string)
    cnxn.commit()
#%%


rushingTable = browser.find_element_by_xpath("//*[@id='rushing_and_receiving']/tbody")

rushingPlayers = rushingTable.find_elements(By.TAG_NAME, "tr")

for player in rushingPlayers:

    name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
    yards = str(player.find_elements(By.TAG_NAME, "td")[2].text)
    if yards == "":
        yards = "0"
    touchdowns = str(player.find_elements(By.TAG_NAME, "td")[4].text)
    if touchdowns == "":
        touchdowns = "0"
    yardsRec = str(player.find_elements(By.TAG_NAME, "td")[6].text)
    if yardsRec == "":
        yardsRec = "0"
    touchdownsRec = str(player.find_elements(By.TAG_NAME, "td")[8].text)
    if touchdownsRec == "":
        touchdownsRec = "0"
    string = "update SeasonStats set rushingYards = '" + yards
    string = string + "', touchdownsRushing = '" + touchdowns
    string = string + "', touchdownsReceiving = '" + touchdownsRec
    string = string + "', receivingYards = '" + yardsRec
    string = string + "' where fullName = '" + name
    string = string + "'"

    cursor.execute(string)
    cnxn.commit()


#%%
 
defenseTable = browser.find_element_by_xpath("//*[@id='defense_and_fumbles']/tbody")

defensePlayers = defenseTable.find_elements(By.TAG_NAME, "tr")

for player in defensePlayers:

    name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
    if name == "J'Marick Woods":
        continue
    sacks = str(player.find_elements(By.TAG_NAME, "td")[5].text)
    if sacks == "":
        sacks = "0"
    tackles = str(player.find_elements(By.TAG_NAME, "td")[3].text)
    if tackles == "":
        tackles = "0"
    touchdowns = str(player.find_elements(By.TAG_NAME, "td")[9].text)
    if touchdowns == "":
        touchdowns = "0"
    touchdowns2 = str(player.find_elements(By.TAG_NAME, "td")[9].text)
    if touchdowns2 == "":
        touchdowns2 = "0"
    touchdowns = int(touchdowns) + int(touchdowns2)
    touchdowns = str(touchdowns)
    interceptions = str(player.find_elements(By.TAG_NAME, "td")[6].text)
    if interceptions == "":
        interceptions = "0"
    
    string = "update SeasonStats set sacks = '" + sacks
    string = string + "', touchdowns = '" + touchdowns
    string = string + "', interceptions = '" + interceptions
    string = string + "', tackles = '" + tackles
    string = string + "' where fullName = '" + name
    string = string + "'"
    cursor.execute(string)
    cnxn.commit()

#%%

interTable = browser.find_element_by_xpath("//*[@id='kicking_and_punting']/tbody")

interPlayers = interTable.find_elements(By.TAG_NAME, "tr")

for player in interPlayers:

    name = str(player.find_elements(By.TAG_NAME, "td")[0].text)

    xp = str(player.find_elements(By.TAG_NAME, "td")[1].text)
    fg = str(player.find_elements(By.TAG_NAME, "td")[4].text)
    string = "update SeasonStats set extraPoints = '" + xp
    string = string + "', fieldGoals = '" + fg
    string = string + "' where fullName = '" + name
    string = string + "'"
    cursor.execute(string)
    cnxn.commit()

#%%

browser.close()