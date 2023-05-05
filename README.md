# Node.js REST API with Winston, JOI, and MariaDB
This is a Node.js REST API project that includes logging services with Winston, validation with JOI, and connectivity to a MariaDB database. It's also designed to be easily hosted on Azure by using Docker to containerize the project.

# Features
This REST API includes the following features:

Logging services with Winston for debugging and error handling
Validation with JOI for request body and query parameters
Connectivity to a MariaDB database for data storage and retrieval
Installation
To install this project, simply clone the repository and run npm install to install the dependencies.

shell
Copy code
$ git clone https://github.com/payyd/NodeRESTAPI.git
$ cd NodeRESTAPI
$ npm install
Usage
To run the API, simply run npm start. You'll need to provide environment variables for the database connection settings.

ruby
Copy code
$ npm start
The API is now accessible at http://localhost:4023.

# Environment Variables
The following environment variables are required for the API to function properly:

DB_HOST: the hostname for the MariaDB server
DB_USER: the username for the MariaDB server
DB_PASSWORD: the password for the MariaDB server
DB_NAME: the name of the database to use
Endpoints
This API includes the following endpoints:

GET /users
Returns a list of all users.

GET /users/:id
Returns a single user by ID.

POST /users
Creates a new user.

PUT /users/:id
Updates an existing user by ID.

DELETE /users/:id
Deletes a user by ID.



# Validation
JOI is used for request body and query parameter validation. If a request fails validation, a 400 Bad Request response is returned with an error message indicating the validation failure.

# Authentication
This API uses JWT tokens for authentication. A token is generated when a user logs in, and it expires after 15 minutes. To access the protected routes, an Authorization header with a Bearer token must be included in the request.

The token is generated using the following code:

javascript
Copy code
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15min'  })
}
To authenticate the token, use the authenticateToken middleware function:

javascript
Copy code
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
The authenticateToken function checks for the presence of the token and verifies it using the ACCESS_TOKEN_SECRET stored in the environment variables.

If the token is valid, the req.user object is set to the user information stored in the token, and the next middleware function is called. If the token is invalid, a 403 Forbidden status is returned.

To refresh the token, use the following code:

javascript
Copy code
app.post('/api/v1/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})
The POST /api/v1/token endpoint receives a refresh token in the request body. If the refresh token is valid, a new access token is generated and returned in the response.

Logging
Winston is used for logging services. The logger is configured to write logs to the console in development mode and to a log file in production mode.

# Containerization
This project can be easily containerized using Docker for deployment on Azure or other containerization platforms.


