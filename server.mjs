import express from 'express';
import skill from './api/skill.mjs';
import user from './api/user.mjs';
import userSkills from './api/user-skills.mjs'
import connectDB from './db.mjs';
import './config.mjs';


const app = express();
const port = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
    next();
});

connectDB();  // Connect to the database

// Set up API routes
app.use('/api/skill', skill);
app.use('/api/user', user);
app.use('/api/user-skill', userSkills)

app.listen(port, () => console.log(`Server listening on port ${port}`));
