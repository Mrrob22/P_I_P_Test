const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const token = (req.headers.authorization && req.headers.authorization.split(" ")[1]) || '';

    if (!token) {
        return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    try {
        if (token) {
            const decoded = jwt.verify(token, config.get('jwtsecret'));
            req.user = decoded;
            next();
        } else {
            throw new Error('Token is missing');
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Недействительный токен авторизации' });
    }
};
