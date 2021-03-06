const db = require('./db');


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
      return user.rows[0];
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return db
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(user => {
      return user.rows[0];
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  const values = [user.name, user.email, user.password];

  return db
    .query(query, values)
    .then(result => {
      return result.rows[0];
    })
    .catch(err => {
      console.log(err);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  const query = `
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date DESC
    LIMIT $2
  `;
  const values = [guestId, limit];

  return db
    .query(query, values)
    .then((result) => {
      return Object.assign({}, result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  // Used for extracting query string from queryOptions
  const queryKeys = [];

  // Query strings for each filter option
  const queryOptions = {
    city: `city LIKE $`,
    owner_id: `properties.owner_id = $`,
    minimum_price_per_night: `cost_per_night >= $`,
    maximum_price_per_night: `cost_per_night <= $`,
    minimum_rating: ""
  };
  
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // filter city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryKeys.push("city");
    queryOptions.city += `${queryParams.length}`;
  }

  // filter owner id
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryKeys.push("owner_id");
    queryOptions.owner_id += `${queryParams.length}`;
  }

  // filter minimum price
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryKeys.push("minimum_price_per_night");
    queryOptions.minimum_price_per_night += `${queryParams.length}`;
  }

  // filter maximum price
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryKeys.push("maximum_price_per_night");
    queryOptions.maximum_price_per_night += `${queryParams.length}`;
  }

  // Filter options exist
  if (queryParams.length > 0) {

    // first option after a WHERE
    queryString += `WHERE ${queryOptions[queryKeys[0]]} `;

    // Rest follow an AND
    for (const key of queryKeys.slice(1)) {
      queryString += `AND ${queryOptions[key]} `;
    }
  }

  queryString += `GROUP BY properties.id `;

  // filter rating
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return db
    .query(queryString, queryParams)
    .then((result) => {
      return Object.assign({}, result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  // convert to cents
  property.cost_per_night *= 100;
  const query = `
  INSERT INTO properties ( 
    title,
    description,
    number_of_bedrooms,
    number_of_bathrooms,
    parking_spaces,
    cost_per_night,
    thumbnail_photo_url,
    cover_photo_url,
    street,
    country,
    city,
    province,
    post_code,
    owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
  `;
  const values = Object.values(property);

  return db
    .query(query, values)
    .then(result => {
      return result.rows[0];
    })
    .catch(err => {
      console.log(err);
    });
};
exports.addProperty = addProperty;
