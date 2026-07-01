import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized Access" })
    }
    try {
        const key = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, key);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized Access" })
    }
}




