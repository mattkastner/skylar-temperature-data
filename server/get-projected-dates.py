#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np


# In[2]:


projected_data = pd.read_csv("cities_population_adjusted.csv", usecols = ['name', 'location_date', "temp_mean_c", "temp_min_c", "temp_max_c", 'projected'])


# In[3]:


# print(projected_data)


# In[4]:


projected_data.to_json(r"projected_temps.json", orient='table')
print("done")

