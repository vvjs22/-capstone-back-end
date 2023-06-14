# -HAPP'N

9.2 Bo Latt, Monique Correa, James Scott
HAPP'N Enables community advocates to share events, target local residents and check-in to events on a mobile-friendly platform. This repo is 1 of 2 required; representing the Back-End of a PERN stack.

# Event Geocoding

This repo performs address geocoding for events stored in a PostgreSQL database. It utilizes the Google Maps Geocoding API to retrieve the location information for events based on their addresses. This allows for efficient searching and mapping of events based on their geographical coordinates.

## Features

- Geocodes event addresses using the Google Maps Geocoding API.
- Updates the location information of events in the PostgreSQL database.
- Automatically triggers the geocoding process whenever a new event is inserted into the database.

## Prerequisites

Before running the project, make sure you have the following prerequisites installed:

- Node.js
- PostgreSQL database w/ PostGIS extension
- Google Maps API key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vvjs22/-capstone-back-end.git
   cd capstone-back-end
   npm install
 
## Configure the database:

Create a PostgreSQL database and update the database configuration in happndb/dbConfig.js file.
Set up environment variables:

Rename the .env.example file to .env.
Replace the YOUR_API_KEY placeholder in the .env file with your actual Google Maps API key.

## Routes and Controllers
The project follows a basic MVC (Model-View-Controller) architecture. 

