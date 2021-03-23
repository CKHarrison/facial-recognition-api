const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  }
});


const app = express();

//Don't forget to parse the body of the request
app.use(express.json());
//Cors
app.use(cors());

app.get('/', (req, res) => { res.send('success')});

//Signin route -> currying
app.post('/signin', signin.handleSignin(db, bcrypt));

// Register
app.post('/register',(req, res) => { register.handleRegister(req, res, db, bcrypt)});

// Profile:id route
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

//Image route that tracks # of images user enters
app.put('/image', (req, res) => {image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is runnint on ${process.env.PORT}`);
});

/*

/---> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT -> update user score = user
*/