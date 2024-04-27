# InfinitSeed - Backend

# Overview
This website aims to gamify skill progression in real
life. It allows users to add skills to their status 
sheet and level up those skills by practicing them in 
real life.

# Routes
* User Routes:
    * /api/user/:id - Get user by ID - GET
    * /api/user/register - Register User - POST
* Skill Routes:
    * /api/skill/ - Create new skill - POST
    * /api/skill/ - Get all skills - GET
* User Skill Routes:
    * /api/user-skill/:userId/:skillId/track - Track user's skill - POST
    * /api/user-skill/:userId/:skillId/add - Add skill to user's skill list - POST