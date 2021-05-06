#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np


# In[2]:


location_data = pd.read_csv("cities_population_adjusted.csv", usecols = ['name', 'Lat', 'Lon'])


# In[3]:


print(location_data)


# In[4]:


location_data.set_index('name', inplace=True)


# In[5]:


location_data = location_data.groupby("name")
location_data = location_data.agg({"Lat":'first', "Lon":'first'})
location_data = location_data.reset_index()


# In[6]:


location_data.to_json(r"city_locations.json", orient='table')
print("done")


# In[ ]:




