const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const winston = require('winston');
const Joi = require('joi');
const path = require('path')
require('dotenv').config({ path:__dirname+'/./../../.env' });
const jwt = require('jsonwebtoken');

const logger = require('../logger/index');
const UserDto = require('../models/UserDto');
const UpdateUserDto = require('../models/UpdateUserDto');
const CreateUserValidation = require('../ValidationSchemas/CreateUserValidation');
const UpdateUserValidation = require('../ValidationSchemas/UpdateUserValidation');
const mysqlConnection = require('../database/sqlconnection');

var app = express();

//Configuring express server
app.use(bodyparser.json());

const port = process.env.PORT1 || 4023;
app.listen(port, () => console.log(`Listening on port ${port}..`));

//userdto validation for post
function validateUser(user) {

    const UserDto = {
        id: Joi.number().min(1).required(),
        first_name: Joi.string().min(2).max(25).required(),
        last_name: Joi.string().min(2).max(25).required(),
        email: Joi.string().min(2).max(25).required(),
        password: Joi.string().min(2).max(25).required(),
        DOB: Joi.date().required(),
        rating: Joi.number().min(0).max(10).required()
    };
    return Joi.validate(user, schema);
}


//BASIC GET Request not linked with mysql for testing docker registry
app.get("/api/test", (req, res, next) => {
    logger.info('Success on GET /test')
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

//Creating GET Router to fetch all data
app.get('/api/v1/User', (req, res) => {
    mysqlConnector = mysqlConnection();
    mysqlConnector.query('SELECT * FROM User', (err, result) => {
        if (err) {
            logger.error('Error on GET /api/v1/User')
            throw err;
        }//end if error
        else
        {
            logger.info('Success on GET /api/v1/User')
            res.send(result);
        }//end else
    mysqlConnector.end();
    });
});
//Creating GET Router to fetch data by id
app.get('/api/v1/User/:id', (req, res) => {
    mysqlConnector = mysqlConnection();
    mysqlConnector.query('SELECT * FROM User WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            logger.error('Error on GET /api/v1/User/:id')
            throw err;
        }//end if error
        else
        {
            logger.info('Success on GET /api/v1/User/:id')
            res.send(result);
        }//end else
    });
    mysqlConnector.end();
});

//POST 
app.post('/api/v1/User', (req, res) => {
    mysqlConnector = mysqlConnection();
    const {id, first_name, last_name, password, email, DOB, rating} = req.body;
    const validation = CreateUserValidation.validate(req.body);
    const {value, error} = validation;
    const valid = error == null;
    if (!valid) {
        res.status(401).json({
            message: "invalid request",
            data: req.body
        })
    }//end if !valid
    else {
        const user = new UserDto();
        user.id = id;
        user.first_name = first_name;
        user.last_name = last_name;
        user.password = password;
        user.email = email;
        user.DOB = DOB;
        user.rating = rating;
        // pass 'user' object to repository/service 
        mysqlConnector.query("INSERT INTO User SET ?", {id, first_name, last_name, password, email, DOB, rating}, (err, result) => {
            if (err) {
                logger.error('Error on POST /api/v1/User/')
                throw err;
            }//end if error
            else
            {
                logger.info('Success on POST /api/v1/User/')
                res.send(result);
            }//end else success
        });
    }
    mysqlConnector.end();
});
//PUT  based on id

app.put('/api/v1/User/:id', (req, res) => {
    mysqlConnector = mysqlConnection();
    const {first_name, last_name, password, email, DOB, rating} = req.body;
    const validation = UpdateUserValidation.validate(req.body);
    const {value, error} = validation;
    const valid = error == null;
    if (!valid) {
        res.status(401).json({
            message: "invalid request",
            data: req.body
        })
    }//end if !valid
    else {
        const user = new UpdateUserDto();
        user.first_name = first_name;
        user.last_name = last_name;
        user.password = password;
        user.email = email;
        user.DOB = DOB;
        user.rating = rating;
        data = [first_name, last_name, password, email, DOB, rating, req.params.id]
        mysqlConnector.query("UPDATE User SET first_name = ?,last_name =?, password =?,email=?,DOB=?, rating=? where id = ?", data, (err, result) => {
            if (err) {
                logger.error('Error on PUT /api/v1/User/:id')
                throw err;
            }//end if error
            else
            {
                logger.info('Success on PUT /api/v1/User/:id')
                res.send(result);
            }//end else successful
        })
    }
    mysqlConnector.end();

});

//DELETE by id

app.delete('/api/v1/User/:id', (req, res) => {
    mysqlConnector = mysqlConnection();
    let id = req.params.id;
    mysqlConnector.query("DELETE from User where id = " + id, (err, result) => {
        if (err) {
            logger.error('Error on DELETE /api/v1/User/:id')
            throw err;
        }//end if error
        else
        {
            logger.info('Success on DELETE /api/v1/User/:id')

            res.send(result);
        }//end else success
    });
    mysqlConnector.end();
})
const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]
//store these in database eventually
let refreshTokens = []

app.get('/api/v1/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name))
})
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

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn : '15min'  })
}

app.post('/api/v1/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})
    
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

app.delete('/api/v1/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})