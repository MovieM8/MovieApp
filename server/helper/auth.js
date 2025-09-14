import jwt from 'jsonwebtoken';

const { verify } = jwt;

const auth = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token provited' });
    }
    verify(token.startsWith("Bearer ") ? token.split(" ")[1] : token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = { email: decoded.user };
        next();
    });
} 
export  { auth };