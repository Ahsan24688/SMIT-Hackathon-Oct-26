import jwt from "jsonwebtoken";

const authmiddlewear = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({
                message: "Access Denied. No token provided.",
                data: null,
                code: 403,
            });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    message: "Invalid or Expired Token",
                    data: null,
                    code: 401,
                });
            }

           
            req.user = decoded;
            next();
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error in middleware",
            error: err.message,
            code: 500,
        });
    }
};

export { authmiddlewear };