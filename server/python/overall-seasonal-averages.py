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


intial_data = pd.read_csv("cities_population_adjusted.csv", usecols = ['name','location_date','temp_mean_c','temp_min_c','temp_max_c'], parse_dates=['location_date'])


# In[3]:


temp_data = intial_data.groupby(["location_date"])
temp_data = temp_data.agg({'temp_mean_c':"mean",'temp_min_c':"mean",'temp_max_c':"mean"})
temp_data = temp_data.reset_index()
temp_data = temp_data.sort_values("location_date")
# temp_data


# In[4]:



X = [i%365 for i in range(0, len(temp_data['temp_mean_c']))]
y = temp_data['temp_mean_c'].values
degree = 4
coef = polyfit(X, y, degree)
curve = list()
for j in range(len(X)):
    value = coef[-1]
    for d in range(degree):
        value += X[j]**(degree-d) * coef[d]
    curve.append(value)
values = temp_data['temp_mean_c'].values
diff = list()
# print(curve)
temp_data['seasonal'] = curve
# pyplot.plot(values)
# pyplot.plot(curve, color='red', linewidth=3)
# pyplot.show()

# intial_data = concat([initial_data, ])


# In[5]:


final_data = temp_data
final_data.to_json(r"overall_cities_seasonal.json", orient='table')
# print(final_data)


# In[ ]:




