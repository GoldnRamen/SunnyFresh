const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Access token is required' 
        });
    }

    const token = authHeader.split(' ')[1];
    // if (!token) return res.status(401).send('Access Denied.No token provided.');
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false, 
            message: 'Invalid or expired token'
        });  
    }
};

// Enhanced role authorization with hierarchy
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.user_data?.role || 
                        req.user?.admin_data?.role || 
                        req.user?.supplier_data?.role || 
                        req.user?.employee_data?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        // Special handling for admin privileges
        if (userRole === 'admin') {
            req.isAdmin = true;
        }

        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };