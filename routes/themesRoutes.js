import express from "express";
import {db} from "../app.js"

const router = express.Router();


// Get All the themes

router.get("/", (req ,res) => {
try {
     const themes = db.prepare("SELECT * FROM themes")
    const data = themes.all();

    res.send(data)
}catch(err){
    console.log("Some Error has occured" , err);
}
});

export default router
