#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import time
import datetime

from datetime import timedelta, date, datetime

# from prophet.plot import plot_yearly

from matplotlib import pyplot
from numpy import polyfit
from sklearn.linear_model import LinearRegression


# In[2]:


temp_data = pd.read_csv("Temperature Data.csv", usecols = ['name','station_code','location_date','temp_mean_c','temp_min_c','temp_max_c'], parse_dates=['location_date'])
temp_data['temp_mean_c'] = temp_data['temp_mean_c'].astype(float)
temp_data['temp_min_c'] = temp_data['temp_min_c'].astype(float)
temp_data['temp_max_c'] = temp_data['temp_max_c'].astype(float)

bools = [False for x in range(len(temp_data))]
temp_data.insert(len(temp_data.columns), "projected", bools, True)
# temp_data


# In[3]:


temp_dates = pd.read_csv("Temperature Data.csv", usecols = ["location_date"], parse_dates=['location_date'])

minDate = temp_dates.values.min()
maxDate = temp_dates.values.max()
# print(temp_dates.values.max())
date_range = pd.date_range(minDate, maxDate)
# date_range


# In[4]:


cities = temp_data["name"].unique()
# cities


# In[5]:


cities_data = []
for city in cities:
    query_str = 'name == "' + city + '"'
    new_city = temp_data.query(query_str)
    cities_data.append(new_city.copy())
# cities_data


# In[6]:


for i in range(len(cities_data)):
#     fix duplicate cities && dates
    city_codes = cities_data[i].groupby("location_date")
    city_codes = city_codes.agg({"name":'first', "station_code":'first', "temp_mean_c":'mean', "temp_min_c":'mean', "temp_max_c":'mean', "projected":'first'})
    cities_data[i] = city_codes.reset_index()
#     cities_data[i]


# In[7]:


number_cities = len(cities_data)
for i in range(number_cities):
    city_name = cities_data[i]["name"].unique()[0]
    station_code = cities_data[i]["station_code"].unique()[0]
    for date in date_range:
        if date not in cities_data[i]["location_date"].values:
            missing_date = [[city_name, station_code, date, None, None, None, True]]
            df = pd.DataFrame(missing_date,  columns =  ["name", "station_code", "location_date", "temp_mean_c", "temp_min_c", "temp_max_c", "projected"])
            cities_data[i] = pd.concat([cities_data[i], df])

    cities_data[i].sort_values(by=['location_date'], inplace=True)
    cities_data[i] = cities_data[i].fillna(method="ffill")
    cities_data[i] = cities_data[i].fillna(method="bfill")


# In[8]:


pop_data = pd.read_csv("Population Data.csv", usecols = ['City', 'State', 'population','Lon','Lat'])
pop_data.drop(pop_data[(pop_data['City'] == "Columbus") & (pop_data['State'] == "Georgia")].index, inplace = True)
pop_data.drop(pop_data[(pop_data['City'] == "Richmond") & (pop_data['State'] == "Virginia")].index, inplace = True)


# In[9]:


for i in range(len(cities_data)):
    city_name = cities_data[i]["name"].unique()[0]
    if(city_name == "Detroit/Wayne"):
        cities_data[i].loc[(cities_data[i].name == 'Detroit/Wayne'),'name']='Detroit'
    if(city_name == "Chicago O'Hare"):
        cities_data[i].loc[(cities_data[i].name == "Chicago O'Hare"),'name']='Chicago'
    if(city_name == "Phoenix/Sky HRBR"):
        cities_data[i].loc[(cities_data[i].name == 'Phoenix/Sky HRBR'),'name']='Phoenix'
    if(city_name == "Raleigh/Durham"):
        cities_data[i].loc[(cities_data[i].name == 'Raleigh/Durham'),'name']='Raleigh'
    if(city_name == "Sacramento/Execu"):
        cities_data[i].loc[(cities_data[i].name == 'Sacramento/Execu'),'name']='Sacramento'
    if(city_name == "St Louis/Lambert"):
        cities_data[i].loc[(cities_data[i].name == 'St Louis/Lambert'),'name']='St. Louis'
    if(city_name == "Wash DC/Dulles"):
        cities_data[i].loc[(cities_data[i].name == 'Wash DC/Dulles'),'name']='District of Columbia'
    if(city_name == "NYC/LaGuardia"):
        cities_data[i].loc[(cities_data[i].name == 'NYC/LaGuardia'),'name']='New York'

    cities_data[i] = cities_data[i].merge(pop_data, how="left", left_on='name', right_on='City')
        


# In[10]:


population_weighted = pd.concat(cities_data)
# ["Windsor Locks", "Covington", "Albany"] <-- NaN cities
is_nans = pd.isnull(population_weighted["population"])
nan_cities = population_weighted[is_nans]

no_nans = pd.notnull(population_weighted["population"])
population_weighted = population_weighted[no_nans]
# population_weighted


# In[11]:


# model1 = LinearRegression()
# model2 = LinearRegression()
# model3 = LinearRegression()

# X = population_weighted[['population', 'Lon', 'Lat']]

# # mean
# y1 = population_weighted['temp_mean_c']
# model1.fit(X, y1)
# intercept1 = model1.intercept_
# slope1 = model1.coef_
# # print("\n")
# # print('Intercept1: \n', intercept1)
# # print('Coefficients1: \n', slope1)
# population_weighted = population_weighted.assign(temp_mean_c = lambda x: x["temp_mean_c"] - x["population"]*slope1[0])

# # min
# y2 = population_weighted['temp_min_c']
# model2.fit(X, y2)
# intercept2 = model2.intercept_
# slope2 = model2.coef_
# # print("\n")
# # print('Intercept2: \n', intercept2)
# # print('Coefficients2: \n', slope2)
# population_weighted = population_weighted.assign(temp_min_c = lambda x: x["temp_min_c"] - x["population"]*slope2[0])

# # max
# y3 = population_weighted['temp_max_c']
# model3.fit(X, y3)
# intercept3 = model3.intercept_
# slope3 = model3.coef_
# # print("\n")
# # print('Intercept3: \n', intercept3)
# # print('Coefficients3: \n', slope3)
# population_weighted = population_weighted.assign(temp_max_c = lambda x: x["temp_max_c"] - x["population"]*slope3[0])


# In[12]:


city_populations = population_weighted.groupby(["name"])
city_populations = city_populations.agg({"population":"first"})
city_populations = city_populations.reset_index()

pop_total = city_populations['population'].sum()
avg_pop = city_populations['population'].mean()

# print(avg_pop, pop_total)
city_temps = []
for city in cities:
    query_str = 'name == "' + city + '"'
    new_city = population_weighted.query(query_str)
    city_temps.append(new_city.copy())
# city_temps


# print(city_populations)
city_populations = population_weighted.groupby(["location_date"])

# print(city_temps[0])  
for i in range(len(city_temps)):
    city_temps[i] = city_temps[i].assign(temp_mean_c = lambda x: x["temp_mean_c"] * x["population"]/pop_total)
    city_temps[i] = city_temps[i].assign(temp_min_c = lambda x: x["temp_min_c"] * x["population"]/pop_total) 
    city_temps[i] = city_temps[i].assign(temp_max_c = lambda x: x["temp_max_c"] * x["population"]/pop_total) 
city_temps = pd.concat(city_temps)
# print(city_temps[0]) 
# print(nan_cities)
nan_cities = nan_cities.assign(temp_mean_c = lambda x: x["temp_mean_c"] * avg_pop/pop_total)
nan_cities = nan_cities.assign(temp_min_c = lambda x: x["temp_min_c"] * avg_pop/pop_total) 
nan_cities = nan_cities.assign(temp_max_c = lambda x: x["temp_max_c"] * avg_pop/pop_total)


# In[13]:



final_data = pd.concat([city_temps, nan_cities])
final_data.to_csv(r"cities_population_adjusted.csv", encoding='utf-8', index=False)
final_data.to_json(r"cities_population_adjusted.json", orient='table')
# final_data = ",".join(final_data)
# final_data = "[" + final_data + "]"
# file = open("cities_data.txt","w")
# file.truncate(0)
# file.write(final_data)
print("done")

