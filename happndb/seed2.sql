\c happndb; 

INSERT INTO "Cause" (type, name)
VALUES
('environmental', 'Save the Planet'),
('education', 'Quality Education for All'),
('animal', 'Animal Welfare'),
('justice', 'Social Justice and Equality'),
('disability', 'Empowering People with Disabilities'),
('veteran', 'Supporting Veterans'),INSERT INTO "Event" (cause_id, title, description, date, time, category, address, zip, img_link, organizer_user_id, checked_in_users, location, latitude, longitude)
VALUES
(1, 'Tech Conference', 'Join us for a conference on the latest technology trends.', '2023-06-15', '09:00:00', 'workshop', '123 Main St', 10001, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.7128 -74.0060)', 40.7128, -74.0060),
(2, 'Summer Music Festival', 'Experience the best music performances in an outdoor festival.', '2023-07-20', '16:00:00', 'festivals', '456 Park Ave', 10002, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.7420 -73.9896)', 40.7420, -73.9896),
(3, 'Basketball Tournament', 'Cheer for your favorite teams in an exciting basketball tournament.', '2023-08-10', '19:30:00', 'sports', '789 Stadium Rd', 10003, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.7554 -73.9784)', 40.7554, -73.9784),
(1, 'Art Workshop', 'Unleash your creativity in this hands-on art workshop.', '2023-09-05', '11:00:00', 'workshop', '987 Elm St', 10004, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.7306 -73.9352)', 40.7306, -73.9352),
(1, 'Charity Gala Dinner', 'Support a charitable cause while enjoying an elegant gala dinner.', '2023-10-12', '18:30:00', 'charity', '654 Oak Ave', 10005, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.6892 -74.0445)', 40.6892, -74.0445),
(1, 'Community Cleanup Day', 'Join us in making our community cleaner and greener.', '2023-11-07', '10:00:00', 'community', '321 Pine St', 10006, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 0, 'POINT(40.6782 -73.9442)', 40.6782, -73.9442);
('mental', 'Mental Health Awareness');


INSERT INTO "User" (id, email, user_name, f_name, l_name, interests, twitch_channel, user_profile_link )
VALUES
('user1', 'user1@example.com', 'user1', 'John', 'Doe', 'Technology, Gaming', 'twitch.tv/user1', 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' ),
('user2', 'user2@example.com', 'user2', 'Jane', 'Smith', 'Art, Music', 'twitch.tv/user2', 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp' ),
('user3', 'user3@example.com', 'user3', 'David', 'Johnson', 'Sports, Fitness', 'twitch.tv/user3', 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'),
('user4', 'user4@example.com', 'user4', 'Emily', 'Wilson', 'Travel, Food', 'twitch.tv/user4', 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'),
('user5', 'user5@example.com', 'user5', 'Michael', 'Brown', 'Photography, Nature', NULL, 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'),
('user6', 'user6@example.com', 'user6', 'Sarah', 'Jones', 'Writing, Literature', NULL, 'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'),
('StSYbI8Gw1c2cm2oV2IDFn4WwAI2','bolatt@pursuit.org','bo','bo','latt','gaming',NULL,'https://mdbcdn.b-cdn.net/img/new/avatars/2.webp'); 



INSERT INTO "Event" (cause_id, title, description, date, time, category, address, zip, img_link, organizer_user_id, checked_in_users,  latitude, longitude)
VALUES
(1, 'Tech Conference', 'Join us for a conference on the latest technology trends.', '2023-06-15', '09:00:00', 'workshop', '123 Main St', 10001, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 12, 40.7128, -74.0060),
(2, 'Summer Music Festival', 'Experience the best music performances in an outdoor festival.', '2023-07-20', '16:00:00', 'festivals', '456 Park Ave', 10002, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 50, 40.7420, -73.9896),
(3, 'Basketball Tournament', 'Cheer for your favorite teams in an exciting basketball tournament.', '2023-08-10', '19:30:00', 'sports', '789 Stadium Rd', 10003, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 53, 40.7554, -73.9784),
(1, 'Art Workshop', 'Unleash your creativity in this hands-on art workshop.', '2023-09-05', '11:00:00', 'workshop', '987 Elm St', 10004, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 53, 40.7306, -73.9352),
(1, 'Charity Gala Dinner', 'Support a charitable cause while enjoying an elegant gala dinner.', '2023-10-12', '18:30:00', 'charity', '654 Oak Ave', 10005, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 68, 40.6892, -74.0445),
(1, 'Community Cleanup Day', 'Join us in making our community cleaner and greener.', '2023-11-07', '10:00:00', 'community', '321 Pine St', 10006, 'https://shorturl.at/HOV56', 'StSYbI8Gw1c2cm2oV2IDFn4WwAI2', 79, 40.6782, -73.9442);


