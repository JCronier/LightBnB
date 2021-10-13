INSERT INTO users (name, email, password)
VALUES ('Jordan Cronier', 'yeboi@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Adam West', 'batman@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Peter Parker', 'spiderman@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  owner_id, 
  title, 
  description, 
  thumbnail_photo_url, 
  cover_photo_url, 
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
  )
VALUES (
  1,
  'Beep Bop',
  'description',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  200,
  1,
  2,
  4,
  'Canada',
  'Regent Street',
  'Richmond',
  'BC',
  'V1E1W2',
  true
),

(
  1,
  'Boop Beep',
  'description',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  69,
  6,
  10,
  1,
  'Barbados',
  'Barbados Street',
  'Barbadosia',
  'BC',
  'V1E121',
  true
),

(
  1,
  'Skipity BeeBop',
  'description',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350 | https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
  420,
  42,
  125,
  8,
  'USA',
  'Rodeo Drive',
  'Yew Nork',
  'New York',
  'V1E121',
  true
);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-13', 2, 3),
('2021-04-09', '2021-04-18', 1, 1),
('2018-10-30', '2018-12-13', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 2, 'message'),
(2, 2, 2, 5, 'message'),
(3, 3, 3, 1, 'message');
