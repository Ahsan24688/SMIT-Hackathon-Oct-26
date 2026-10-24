import express from "express";
import { authcheck } from "./middleware1.js";
import usermodel from "./model.js";

const router = express.Router();

// let userarr = [
//     { id: 1, name: "John Doe", email: "abc@example.com" },
//     { id: 2, name: "jhon", email: "ABC@example.com" },
//     { id: 3, name: "jane", email: "123@example.com" },
// ]


// router.get("/", async (req, res) => {
//     try {

//         const users = await usermodel.find({});

//         res.status(200).json({
//             message: "User list",
//             data: users,
//             code: 200
//         })

//     }
//     catch (error) {
//         res.status(404).json({
//             message: "Error in GET request",
//             error: error.message,
//             code: 404
//         })
//     }
//     console.log("GET request received")
// })


// router.get("/:id", async (req, res) => {
//     try {
//         let { id } = req.params;

//         let newuser = await usermodel.findOne({ id: id });
//         console.log(newuser);

//         newuser ?
//             res.status(200).json({
//                 message: "user found",
//                 data: newuser,
//                 code: 200
//             })
//             :
//             res.status(440).json({
//                 message: "user not found",
//                 data: null,
//                 code: 404
//             })
//     }
//     catch (error) {
//         res.status(404).json({
//             message: "Error in GET request",
//             error: error.message,
//             code: 404
//         })

//     }
// })

router.post("/", authcheck, async (req, res) => {
    try {
        const { id, fname, lname, email, password } = req.body;
        const newuser = new usermodel({ id, fname, lname, email, password });
        const saveduser = await newuser.save();
        res.status(200).json({
            message: "User created successfully",
            data: saveduser,
            code: 200
        })

    }
    catch (error) {
        res.status(404).json({
            message: "Error in POST request",
            error: error.message,
            code: 404
        })


    }

    console.log("POST request received");
})


router.delete("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let checkuser = await usermodel.findOne({ id: id });
        console.log(checkuser);

        if (!checkuser) {
            res.status(404).json({
                message: "User not found",
                data: null,
                code: 404
            })
        }
        else {
            let deleteuser = await usermodel.findOneAndDelete({ id: id });
            res.status(200).json({
                message: "User deleted successfully",
                data: deleteuser,
                code: 200
            })
        }
    }
    catch (error) {
        res.status(404).json({
            message: "Error in DELETE request",
            error: error.message,
            code: 404
        })

    }
})

router.put("/:id", async (req, res) => {
    try{
        let { id} = req.params;
        let  updateuser = await usermodel.findOne({id: id});
        console.log(updateuser);

        if (!updateuser){
            res.status(404).json({
                message: "User not found",
            })
        }
        else{
            let updateduser = await usermodel.findOneAndUpdate({id: id}, {...req.body}, {new: true});
            res.status(200).json({
                message: "User updated successfully",
                data: updateduser,
                code: 200
            })
        }
    }
    catch(error){
        res.status(404).json({
            message: "Error in PUT request",
            error: error.message,
            code: 404
        })

    }
})


export default router;