import express from "express";
import router from "./src/app.js";
import authrouter from "./src/auth/authrouter.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
// import dns from 'node:dns';


dotenv.config();
// dns.setServers(['8.8.8.8','1.1.1.1']);




const app = express();
const port = 3000;

app.use(express.json());

const corsOptions = {
    origin: "https://smit-hackathon-oct-f400f.containers.snapdeploy.app",
    methods: "GET, POST, PUT, DELETE",
}

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.send("Hello World");
})

// app.use("/users", router);
app.use ("/", authrouter);
app.use("/", express.static("src/Public"));


mongoose.connect(process.env.MONGOO_DB).then(() =>{
    console.log("MongoDB connected");

}).catch((err) => {
    console.log("MongoDB connection error: ", err);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})