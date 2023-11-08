# Project Overwatch Database Schema documentation

## Intro:
> This is the database for this project, containing 3 tables which stores the packet information, devices information, and packet geodata.


### Packets Table
- Table consist of 8 elements
- - **id**, (primary key) the id of the packet

,,,
create table packets (
	id SERIAL primary key,
	time timestamp with time zone not null,
	src varchar(45) not null, --ip address of sending host
	dst varchar(45) not null, --ip address of receiving host
	mac varchar(17) not null, --mac address of internal host
	len integer not null, --packet length in bytes
	proto varchar(10) not null, --protocol if known, otherwise port number
	ext varchar(45) not null --external ip address (either src or dst)
);

-- create two indexes on src and dst to speed up lookups by these cols by loop.py
create index on packets (src);
create index on packets (dst);
create index on packets (time);
,,,



drop table if exists devices cascade;
create table devices(
	mac varchar(17) primary key,
	manufacturer varchar(40),
	name varchar(255) DEFAULT 'unknown'
);

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
