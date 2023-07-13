const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'yourSecretKey', (err, user) => {
        if (err) {
            return res.status(403).send('Token is expired');
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken