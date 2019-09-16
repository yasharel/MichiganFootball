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


#%%
cnxn  = pyodbc.connect(
    driver = '*****', \
    server = '*****', \
    database = '****', \
    uid = '*****', \
    pwd = '****')

cursor = cnxn.cursor()


#%%

url = 'https://www.espn.com/college-football/boxscore?gameId=401112222'

browser = webdriver.Chrome()
browser.get(url)

#%%
homePassing = browser.find_element_by_xpath("//*[@id='gamepackage-passing']/div/div[2]/div/div/div/div").text
awayPassing = browser.find_element_by_xpath("//*[@id='gamepackage-passing']/div/div[1]/div/div/div/div").text


if homePassing == "Michigan Passing":

    passingTable = browser.find_element_by_xpath("//*[@id='gamepackage-passing']/div/div[2]/div/div/table/tbody")

    passingPlayers = passingTable.find_elements(By.TAG_NAME, "tr")

    for player in passingPlayers:
        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        yards = str(player.find_elements(By.TAG_NAME, "td")[2].text)
        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[4].text)
        interceptions = str(player.find_elements(By.TAG_NAME, "td")[5].text)
        string = "update Players set throwingYards = '" + yards
        string = string + "', touchdowns = '" + touchdowns
        string = string + "', interceptions = '" + interceptions
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()
#%%

if homePassing == "Michigan Passing":
    
    rushingTable = browser.find_element_by_xpath("//*[@id='gamepackage-rushing']/div/div[2]/div/div/table")

    rushingPlayers = rushingTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in rushingPlayers:
        if i == 0:
            i = i + 1
            continue

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        yards = str(player.find_elements(By.TAG_NAME, "td")[2].text)
        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[4].text)
        string = "update Players set rushingYards = '" + yards
        string = string + "', touchdownsRushing = '" + touchdowns
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()

#%%

if homePassing == "Michigan Passing":
    
    recievingTable = browser.find_element_by_xpath("//*[@id='gamepackage-receiving']/div/div[2]/div/div/table/tbody")

    recievingPlayers = recievingTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in recievingPlayers:

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        yards = str(player.find_elements(By.TAG_NAME, "td")[2].text)
        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[4].text)
        string = "update Players set recievingYards = '" + yards
        string = string + "', touchdownsRecieving = '" + touchdowns
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()


#%%
if homePassing == "Michigan Passing":
    
    defenseTable = browser.find_element_by_xpath("//*[@id='gamepackage-defensive']/div/div[2]/div/div/table/tbody")

    defensePlayers = defenseTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in defensePlayers:

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        sacks = str(player.find_elements(By.TAG_NAME, "td")[3].text)
        tackles = str(player.find_elements(By.TAG_NAME, "td")[1].text)
        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[7].text)

        if touchdowns == "":
            touchdowns = "0"
        
        string = "update Players set sacks = '" + sacks
        string = string + "', touchdowns = '" + touchdowns
        string = string + "', tackles = '" + tackles
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()

#%%
if homePassing == "Michigan Passing":
    
    interTable = browser.find_element_by_xpath("//*[@id='gamepackage-interceptions']/div/div[2]/div/div/table/tbody")

    interPlayers = interTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in interPlayers:

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        interceptions = str(player.find_elements(By.TAG_NAME, "td")[1].text)
        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[3].text)
        string = "update Players set interceptions = '" + interceptions
        string = string + "', touchdowns = '" + touchdowns
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()

#%%

if homePassing == "Michigan Passing":
    
    kickTable = browser.find_element_by_xpath("//*[@id='gamepackage-kickReturns']/div/div[2]/div/div/table/tbody")

    kickPlayers = kickTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in kickPlayers:

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        touchdowns = str(player.find_elements(By.TAG_NAME, "td")[5].text)
        string = "update Players set "
        string = string + "touchdowns ='" + touchdowns
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()

#%%
if homePassing == "Michigan Passing":
    
    kickerTable = browser.find_element_by_xpath("//*[@id='gamepackage-kicking']/div/div[2]/div/div/table/tbody")

    kickerPlayers = kickerTable.find_elements(By.TAG_NAME, "tr")
    i = 0
    
    for player in kickerPlayers:

        name = str(player.find_elements(By.TAG_NAME, "td")[0].text)
        if name == "Team":
            continue

        fieldGoals = str(player.find_elements(By.TAG_NAME, "td")[1].text)
        fieldGoals = fieldGoals[0]
        extraPoints = str(player.find_elements(By.TAG_NAME, "td")[4].text)
        extraPoints = extraPoints[0]
        string = "update Players set fieldGoals = '" + fieldGoals
        string = string + "', extraPoints = '" + extraPoints
        string = string + "' where abvName = '" + name
        string = string + "' and weekindex = 1"
        cursor.execute(string)
        cnxn.commit()


browser.close()