#! /usr/bin/env python3


from sqlalchemy import create_engine

#create an engine for sqlalchemy to use to connect to the database
engine = create_engine("postgresql+psycopg2://david:491-Home%21privacy@localhost:5433/homewatch").raw_connection()
cursor = engine.cursor()
#open the csv file, copy into the table you want
with open('home_company.csv', 'r') as csv:
    cmd = 'COPY home_company_test (mac, ext, timestamp, domain) FROM STDIN WITH (FORMAT CSV, HEADER)'
    cursor.copy_expert(cmd, csv)
    engine.commit()







