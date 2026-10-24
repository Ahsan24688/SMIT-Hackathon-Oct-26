import express from "express";
import mongoose from "mongoose";
import { usermodel, SettingModel, DepartmentModel } from "../model.js";
import joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authmiddlewear } from "../authmiddlewear.js";



const router = express.Router();

const registerSchema = joi.object({
    fname: joi.string().min(3).max(15).required(),
    lname: joi.string().min(3).max(15).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
    role: joi.string().valid('Admin', 'HR', 'Employee').optional(),
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
})

router.post("/register", async (req, res) => {
    try {
        let { fname, lname, email, password } = req.body;
        console.log(req.body);
        if (!fname || !lname || !email || !password || fname.trim() === "" || lname.trim() === "" || email.trim() === "" || password.trim() === "") {
            res.status(404).json({
                message: "User not found",
                data: null,
                code: 404
            })
        }

        let validate = await registerSchema.validateAsync(req.body);
        console.log(validate);

        // let {id} =req.body;
        let finduser = await usermodel.findOne({ email: email });
        if (finduser) {
            res.status(404).json({
                message: "User already Exists",
                data: null,
                code: 404
            })
        }

        let saltRound = 13;
        let hashedPass = await bcrypt.hash(password, saltRound);
        console.log(hashedPass);

        let { password: userPassword, ...UserData } = req.body;

        let userid = new Date().getTime() + Math.floor(Math.random() * 1000);

        let newuser = new usermodel({
            ...UserData,
            id: userid,
            password: hashedPass,
        })

        let token = jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: "1h" });   //algorithms: 'RS256
        console.log(token);


        await newuser.save();

        res.status(200).json({
            message: "User registered successfully",
            data: newuser,
            token: token,
            code: 200,
        })
    }
    catch (error) {
        return res.status(404).json({
            message: "Error in POST request",
            error: error.message,
            code: 404
        })
    }
})

router.post("/Login", async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password || email.trim() === "" || password.trim() === "") {
            res.status(404).json({
                message: "All field must be required",
                data: null,
                code: 404
            })
        }

        let loginvalidate = await loginSchema.validateAsync(req.body);
        console.log(loginvalidate);

        let finduser = await usermodel.findOne({ email: email });
        if (!finduser) {
            res.status(404).json({
                message: "email not exists",
                data: null,
                code: 404
            })
        }

        let isMatch = await bcrypt.compare(password, finduser.password);
        if (!isMatch) {
            res.status(404).json({
                message: "Password Does'nt Match",
                data: null,
                code: 404,
            })
        }

        let token = jwt.sign({ id: finduser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log(token);
        res.status(200).json({
            message: "User Login Successfully",
            data: finduser,
            token: token,
            code: 200,
        })
    }
    catch (error) {
        console.error("error in login");
        console.error(error);
        res.status(404).json({
            message: "Error in Login request",
            error: error.message,
            code: 404
        })
    }
})


router.get("/dashboard", authmiddlewear, async (req, res) => {
    try {
        let userID = req.user.id;
        let finduser = await usermodel.findOne({ id: userID });

        res.status(200).json({
            message: "Welcome to Dashboard",
            data: finduser,
            code: 200,
        })
    }
    catch (error) {
        res.status(404).json({
            message: "Error request",
            data: null,
            code: 404,
        })
    }
})

router.delete("/delete", authmiddlewear, async (req, res) => {
    try {
        let userID = req.user.id;

        
        let finduser = await usermodel.findOneAndDelete({
            $or: [{ id: userID }, { _id: userID.length === 24 ? userID : null }]
        });

        if (!finduser) {
            return res.status(404).json({
                message: "User not found in database",
                code: 404,
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            data: finduser,
            code: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error in delete request",
            error: error.message,
            code: 500,
        });
    }
});


router.post("/settings", authmiddlewear, async (req, res) => {
    try {
        // Check if logged-in user is Admin
        let user = await usermodel.findOne({ id: req.user.id });
        if (!user || user.role !== "Admin") {
            return res.status(403).json({
                message: "Access denied. Admin only.",
                code: 403
            });
        }

        let settings = await SettingModel.findOne();
        if (settings) {
            settings = await SettingModel.findOneAndUpdate({}, req.body, { new: true });
        } else {
            settings = new SettingModel(req.body);
            await settings.save();
        }

        return res.status(200).json({
            message: "Company settings saved successfully",
            data: settings,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error saving company settings",
            error: error.message,
            code: 500
        });
    }
});

// 2. Create Department & Designations (Admin Only)
router.post("/departments", authmiddlewear, async (req, res) => {
    try {
        let user = await usermodel.findOne({ id: req.user.id });
        if (!user || user.role !== "Admin") {
            return res.status(403).json({
                message: "Access denied. Admin only.",
                code: 403
            });
        }

        let { name, designations } = req.body;
        if (!name || !designations || designations.length === 0) {
            return res.status(400).json({
                message: "Department name and designations are required",
                code: 400
            });
        }

        let newDept = new DepartmentModel({ name, designations });
        await newDept.save();

        return res.status(200).json({
            message: "Department created successfully",
            data: newDept,
            code: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating department",
            error: error.message,
            code: 500
        });
    }
});

export default router;
