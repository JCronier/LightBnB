const properties = require('./json/properties.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
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
  return pool
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

  return pool
    .query(query, values)
    .then(result => {
      console.log(result.rows);
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

  return pool
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

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryKeys.push("city");
    queryOptions.city += `${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryKeys.push("owner_id");
    queryOptions.owner_id += `${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryKeys.push("minimum_price_per_night");
    queryOptions.minimum_price_per_night += `${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryKeys.push("maximum_price_per_night");
    queryOptions.maximum_price_per_night += `${queryParams.length}`;
  }

  // Filter options exist
  if (queryParams.length > 0) {
    // first option after a WHERE
    queryString += `WHERE ${queryOptions[queryKeys[0]]} `

    // Rest follow an AND
    for (const key of queryKeys.slice(1)){
      queryString += `AND ${queryOptions[key]} `;
    }
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString);
  return pool
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
