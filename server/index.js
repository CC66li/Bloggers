const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
const SECRET = 'YOUR_SECRET_KEY'; // Ideally, don't hard-code this.
const db = require('./models');

db.sequelize.sync().then(() => {
    app.listen(4000, () => {
        console.log("Server started on port 4000")
    })
})

app.post('/register', async (req, res) => {
    console.log("register request")
    console.log(db.User);
    console.log(db.Blog);
    console.log(req.body);
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    try {
        const user = await db.User.create({ email, password }); // hash password before saving
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/login', async (req, res) => {
    console.log("login request")
    console.log(db.User)
    console.log(db.Blog)
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).json({ error: 'User not found.' });
    }

    // validate password (ensure you're comparing with the hashed password)
    const isPasswordValid = true; // replace this with actual validation

    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ userId: user.id }, SECRET);
    res.json({ token });
});

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication required.' });
    }
};

// Import the blog router
const blogRoutes = require('./API/blogRoutes');
app.use('/blogs', blogRoutes(db, jwt, SECRET, authenticate));
module.exports = app;