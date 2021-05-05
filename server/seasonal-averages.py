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


# In[3]:


temp_data = temp_data.sort_values(by=['location_date'])
# temp_data


# In[4]:


cities = temp_data['name'].unique()
cities_data = []
for city in cities:
    query_str = 'name == "' + city + '"'
    new_city = temp_data.query(query_str)
    cities_data.append(new_city.copy())
# cities_data


# In[5]:


for i in range(len(cities_data)):
    X = [i%365 for i in range(0, len(cities_data[i]['temp_mean_c']))]
    y = cities_data[i]['temp_mean_c'].values
    degree = 4
    coef = polyfit(X, y, degree)
    curve = list()
    for j in range(len(X)):
        value = coef[-1]
        for d in range(degree):
            value += X[j]**(degree-d) * coef[d]
        value = "{:.2f}".format(value)
        curve.append(value)
    values = cities_data[i]['temp_mean_c'].values
    diff = list()
#     print(curve)
    cities_data[i]['seasonal'] = curve
#     pyplot.plot(values)
#     pyplot.plot(curve, color='red', linewidth=3)
#     pyplot.show()
# cities_data


# In[6]:


final_data = pd.concat(cities_data)
final_data.to_json(r"cities_seasonal.json", orient='table')
# print(final_data)


# In[ ]:




