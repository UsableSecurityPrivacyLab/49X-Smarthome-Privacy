#! /usr/bin/env python3


from sqlalchemy import create_engine
import pandas as pd

#create an engine for sqlalchemy to use to connect to the database
engine = create_engine("postgresql+psycopg2://david:491-Home%21privacy@localhost:5433/homewatch").raw_connection()
cursor = engine.cursor()

#naive implementation - populates table in schema with only the 4 attr. from test data
#open the csv file, copy into the table you want
#with open('home_company.csv', 'r') as csv:
#    cmd = 'COPY home_company_test (mac, ext, timestamp, domain) FROM STDIN WITH (FORMAT CSV, HEADER)'
#    cursor.copy_expert(cmd, csv)
#    engine.commit()




#more mature implementation - imports csv into pandas dataframe, then manipulates dataframe to match the schema of the 
#packets table in the database

with open('test-data/home_company.csv', 'r') as file:
    df = pd.read_csv(file)
    #dummy values for the columns not in the test data
    df['src'] = '0.0.0.0'
    df['dst'] = '0.0.0.0'
    df['len'] = 42
    df['proto'] = 80
    df['time'] = '2023-11-05 12:57:25-07'
    #dropping the domain column, as no domain column exists in 'packets'
    del df['domain']
    #dropping the timestamp column, as needs to be pgsql type timestamp and not a simple int, also needs to be named time
    del df['timestamp']

    #reordering columns
    df = df.reindex(columns = ['time', 'src', 'dst', 'mac', 'len', 'proto', 'ext'])
    
    #put it in the db
    df.to_sql(name='packets', con=engine, if_exists='append')


    print('Moved csv into packets')









