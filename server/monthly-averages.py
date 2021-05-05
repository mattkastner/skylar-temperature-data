#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import time
import datetime

# from prophet.plot import plot_yearly

from matplotlib import pyplot
from numpy import polyfit
from sklearn.linear_model import LinearRegression


# In[2]:


temp_data = pd.read_csv("cities_population_adjusted.csv", usecols = ['name','location_date','temp_mean_c','temp_min_c','temp_max_c'], parse_dates=['location_date'])
# print(temp_data)
# date_range


# In[3]:


temp_data['month'] = temp_data['location_date'].dt.month
temp_data['year'] = temp_data['location_date'].dt.year
temp_data['month_year'] = temp_data.apply(lambda row: str(row.month) + "/" + str(row.year)[2:], axis = 1)
# temp_data


# In[4]:


cities = temp_data['name'].unique()
cities_data = []
for city in cities:
    query_str = 'name == "' + city + '"'
    new_city = temp_data.query(query_str)
    cities_data.append(new_city)
# cities_data
# print(temp_data[temp_data["month_year"].isnull()])


# In[5]:


# shrink to fewer months

for i in range(len(cities_data)):
    month_years = cities_data[i]["month_year"].unique()
#     print(month_years)
#     print(cities[i])
    if(len(month_years) > 1):
        months = cities_data[i].groupby("month_year")
        months = months.agg({"name":'first', "location_date" :'first', "temp_mean_c":'mean', "temp_min_c":'mean', "temp_max_c":'mean'})
        cities_data[i] = months
    cities_data[i].sort_values(by=['location_date'], inplace=True)
#     print(cities[i])
# cities_data


# In[6]:


final_data = pd.concat(cities_data)
# print(final_data)
final_data.to_json(r"monthly_temperatures.json", orient='table')
print("done")


# In[ ]:




