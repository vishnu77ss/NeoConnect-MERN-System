const jwt = require('jsonwebtoken');

// Middleware to protect routes and check roles
const protect = (roles = []) => {
    return (req, res, next) => {
        // 1. Get token from header
        const token = req.header('x-auth-token');

        // 2. Check if no token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            // 3. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // 4. Check if user role is authorized for this route
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({ msg: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
};

module.exports = protect;