

export const authcheck = (req, res, next) => {
    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password || fname.trim() === "" || lname.trim() === "" || email.trim() === "" || password.trim() === "") {
        return res.status(404).json({
            message: "User not found",
            data: null,
            code: 404
        })
    }
    else {
        next();
    }
}