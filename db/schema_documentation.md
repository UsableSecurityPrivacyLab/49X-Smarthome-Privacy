# Project Overwatch Database Schema documentation

## Intro:
> This is the database for this project, containing 3 tables which stores the packet information, devices information, and packet geodata.
___

### Packets Table
- Table consist of 8 elements
  | element| description|restriction|
  | ------------- |:-------------| :-----|
  | **id**| (primary key) the id of the packet
  |**time**| the timestamp of the ip | **timestamp data, not null**
  |**src**|source ip, the ip address of sending host|**max length 45, not null**
  |**dst**|destination ip, the ip address of the receiving host|**max length 45, not null**
  |**mac**|mac address, the mac address of the internal host|**max length 17, not null**
  |**len**|packet length in bytes|**not null**
  |**proto**|protocol/port number|**max length 10, not null**
  |**ext**| external ip address (src or dst)|**max length 45, not null**

#### Table in SQL format
```sql
create table packets (
	id SERIAL primary key,
	time timestamp with time zone not null,
	src varchar(45) not null,
	dst varchar(45) not null,
	mac varchar(17) not null, --mac address of internal host
	len integer not null, --packet length in bytes
	proto varchar(10) not null, --protocol if known, otherwise port number
	ext varchar(45) not null --external ip address (either src or dst)
);

-- create two indexes on src and dst to speed up lookups by these cols by loop.py
create index on packets (src);
create index on packets (dst);
create index on packets (time);
```

### device Table
- Table consist of 3
  | element| description|restriction|
  | ------------- |:-------------| :-----|
  | **mac**| (primary key) the mac address of device| **max length 17**
  |**manufacturer**| manufecturer info | **max length 40**
  |**name**|the name of the device/info |**max length 255, DEFAULT set to 'UNKNOWN'**
  

#### Table in SQL format
```sql
drop table if exists devices cascade;
create table devices(
	mac varchar(17) primary key,
	manufacturer varchar(40),
	name varchar(255) DEFAULT 'unknown'
);
```


### geodata Table
- Table consist of 7
  | element| description|restriction|
  | ------------- |:-------------| :-----|
  |**ip**|ip of the device|**max length 45, primary key**
  |**lat**|latitude position| **real not null**
  |**lon**|longitude position|**real not null**
  |**c_code**|country code|**max length 2, not null**
  |**c_name**|company name|**max length 55, not null**
  |**domain**|domain of the ip address|**max length 30, not null**
  |**tracker**|keep an eye on this ip|**boolean DEFAULT false**

#### Table in SQL format
```sql
drop table if exists geodata cascade;
create table geodata(
	ip varchar(45) primary key,
	lat real not null,
	lon real not null,
	c_code varchar(2) not null,
	c_name varchar(55) not null,
	domain varchar(30) not null,
	tracker boolean default false
);


drop materialized view if exists impacts;
create materialized view impacts as
	select mac, ext, round(extract(epoch from time at time zone 'utc')/60) as mins, sum(len) as impact
	from packets
	group by mac, ext, mins
	order by mins
with data;

drop materialized view if exists impacts_aggregated;
create materialized view impacts_aggregated as
	select mac, ext, sum(len) as impact
	from packets
	group by mac, ext
with data;
```

#### Queries used from front end
#### installation/acess guide for PostGreSQL
