#! /usr/bin/env python3

import os
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "db"))
import databaseBursts
FILE_PATH = os.path.dirname(os.path.abspath(__file__))
DB_MANAGER = databaseBursts.dbManager()

# Either need to create new table in schema matching brennan's test data, or
# insert null values into the attributes in the nearest matching table -
# (not sure if there's one that supersets brennan's data exactly, could be two inserts)
