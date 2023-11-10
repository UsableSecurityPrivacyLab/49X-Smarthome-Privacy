#! /usr/bin/env python3

from sqlalchemy import create_engine


engine = create_engine("postgresql+psycopg2://david:493-Home%21privacy@localhost:5433/homeoverwatch")



# Either need to create new table in schema matching brennan's test data, or
# insert null values into the attributes in the nearest matching table -
# (not sure if there's one that supersets brennan's data exactly, could be two inserts)
