DROP DATABASE IF EXISTS happndb;
CREATE database happndb;
DROP TABLE "User";
DROP TABLE "Cause";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;


-- Create the User table
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255),
  f_name VARCHAR(255) NOT NULL,
  l_name VARCHAR(255) NOT NULL,
  interests VARCHAR(255),
  twitch_channel TEXT,
  user_profile_link TEXT,
  badge_data JSONB CHECK (badge_data::text ILIKE ANY (ARRAY['%organizer%', '%activist%', '%advocate%']) OR badge_data IS NULL)
);

-- Create the Cause table with a primary key
CREATE TABLE "Cause" (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL CHECK (LOWER(type) IN (
    'environmental',
    'education',
    'animal',
    'justice',
    'disability',
    'veteran',
    'mental'
  ))
  name Text;
);

-- Create the Event table
CREATE TABLE "Event" (
  id SERIAL PRIMARY KEY,
  cause_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  -- category VARCHAR(255) NOT NULL CHECK (LOWER(category) IN ('conferences',
  -- 'festivals',
  -- 'sports',
  -- 'cultural',
  -- 'workshop',
  -- 'charity',
  -- 'community',
  -- 'food')),
  category TEXT,
  address VARCHAR(255) NOT NULL,
  -- city VARCHAR(255)  CHECK (LOWER(city) IN ('brooklyn', 'queens', 'manhattan', 'staten island', 'bronx', 'new york')) ,
  -- state VARCHAR(255)  CHECK (LOWER(state) = 'ny'),
  -- city TEXT, 
  -- state VARCHAR(2),
  zip INTEGER ,
  img_link TEXT,
  organizer_user_id TEXT NOT NULL,
  checked_in_users INTEGER,
  -- location geography(POINT, 4326),
  latitude double precision,
  longitude double precision,
  FOREIGN KEY (organizer_user_id) REFERENCES "User" (id),
  FOREIGN KEY (cause_id) REFERENCES "Cause"(id)
);

-- CREATE TABLE Event2 ( 
--   id SERIAL PRIMARY KEY, 
--   cause_id INT, 
--   title TEXT,
--   description TEXT, 
--   date DATE, 
--   time TIME, 
--   category TEXT, 
--   address TEXT,
--   latitude double precision,
--   longitude double precision, 
--   organizer_user_id TEXT,
-- );



-- Create the Live_video table
CREATE TABLE "Live_video" (
  id SERIAL PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  user_id INTEGER[],
  event_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "User" (id),
  FOREIGN KEY (event_id) REFERENCES "Event" (id)
);

-- Create the Event_attendee table with a primary key
CREATE TABLE "Event_attendee" (
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  FOREIGN KEY (event_id) REFERENCES "Event" (id),
  PRIMARY KEY (user_id, event_id)
);

