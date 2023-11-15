#! /usr/bin/env python3


from sqlalchemy import create_engine
import pandas as pd
import datetime as dt

#create an engine for sqlalchemy to use to connect to the database
engine = create_engine("postgresql+psycopg2://david:491-Home%21privacy@localhost:5433/homewatch").raw_connection()
cursor = engine.cursor()


#naive implementation - populates table in schema with only the 4 attr. from test data
#open the csv file, copy into the table you want
with open('test-data/home_company.csv', 'r') as csv:
    
    #converting millisecond integer value in timestamp to a "time with timezone" type by subtracting the ms value from
    #a datetime.now(). Also renaming the column to time, so I can insert it into the packets table, later, from within the sql db
    df = pd.read_csv(csv)
    now = dt.datetime.now()

    df['timestamp'] = pd.to_timedelta(df['timestamp'], unit='ms')
    df['time'] = now - df['timestamp']
    df = df.drop('timestamp', axis=1)
    df = df.reindex(columns = ['time', 'mac', 'ext', 'domain'])

    df.to_csv('test-data/home_company_time.csv', index=False)
    print('written')
    
#these are now in the correct order (same order as they appear in the packets table)
#once inserted into the temporary home_company_test table, you can simply insert them via sql commands
#inside the database (use INSERT, add hardcoded values for attributes that don't apppear in the temp table)
with open ('test-data/home_company_time.csv', 'r') as file:
    cmd = 'COPY home_company_test (time, mac, ext, domain) FROM STDIN WITH (FORMAT CSV, HEADER)'
    cursor.copy_expert(cmd, file)
    engine.commit()




#more mature implementation - imports csv into pandas dataframe, then manipulates dataframe to match the schema of the 
#packets table in the database

#with open('test-data/home_company.csv', 'r') as file:
#    df = pd.read_csv(file)
#    #dummy values for the columns not in the test data
#    df['src'] = '0.0.0.0'
#    df['dst'] = '0.0.0.0'
#    df['len'] = 42
#    df['proto'] = 80
#    df['time'] = '2023-11-05 12:57:25-07'
#    #dropping the domain column, as no domain column exists in 'packets'
#    del df['domain']
#    #dropping the timestamp column, as needs to be pgsql type timestamp and not a simple int, also needs to be named time
#    del df['timestamp']
#
#    #reordering columns
#    df = df.reindex(columns = ['time', 'src', 'dst', 'mac', 'len', 'proto', 'ext'])
#    
#    for row in df.itertuples():
#        cursor.execute('''
#                    INSERT INTO packets (time, src, dst, mac, len, proto, ext)
#                    VALUES (?, ?, ?, ?, ?, ?, ?)''',
#                        row.time,
#                        row.src,
#                        row.dst,
#                        row.mac,
#                        row.len,
#                        row.proto,
#                        row.ext
#                    )
#
#    cursor.commit()








