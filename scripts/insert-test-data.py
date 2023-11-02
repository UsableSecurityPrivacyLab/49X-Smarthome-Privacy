#! /usr/bin/env python3

from sqlalchemy import create_engine
import pandas as pd

# cook csv into pandas dataframe
# massage dataframe into the right shape to match the pgsql table
# use dataframe.to_sql() 

#create an engine for sqlalchemy to use to connect to the database
engine = create_engine("postgresql+psycopg2://david:491-Home%21privacy@localhost:5433/homeoverwatch")

#read csv file into a pandas dataframe
df = pd.read_csv('testdata.csv')




