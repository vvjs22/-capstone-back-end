DROP DATABASE IF EXISTS happndb;
CREATE database happndb;

-- Create the User table
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  f_name VARCHAR(255) NOT NULL,
  l_name VARCHAR(255) NOT NULL,
  interests VARCHAR(255),
  twitch_channel TEXT
  user_profile_link TEXT
);

-- Create the Event table
CREATE TABLE "Event" (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  category VARCHAR(255) NOT NULL CHECK (LOWER(category) IN ('Conferences',
  'Festivals',
  'Sports',
  'Cultural',
  'Workshop',
  'Charity',
  'Community',
  'Food & Beverage')),
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL CHECK (LOWER(city) IN ('brooklyn', 'queens', 'manhattan', 'staten island', 'bronx', 'new york')) ,
  state VARCHAR(255) NOT NULL CHECK (LOWER(state) = 'ny'),
  zip INTEGER NOT NULL,
  img_link TEXT,
  organizer_user_id INTEGER NOT NULL,
  checked_in_users INTEGER,
  location geography(POINT, 4326)
  latitude double precision,
  longitude double precision,
  FOREIGN KEY (organizer_user_id) REFERENCES "User" (id)
);

-- Create the Live_video table
CREATE TABLE "Live_video" (
  id SERIAL PRIMARY KEY,
  video_id VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "User" (id),
  FOREIGN KEY (event_id) REFERENCES "Event" (id)
);

-- Create the Event_attendee table with a primary key
CREATE TABLE "Event_attendee" (
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "User" (id),
  FOREIGN KEY (event_id) REFERENCES "Event" (id),
  PRIMARY KEY (user_id, event_id)
);
