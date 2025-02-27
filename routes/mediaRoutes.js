import express from "express";
import { db} from "../app.js";

const router = express.Router();


// Get all Media Types 
router.get("/" , (req , res) => {
   try { 
    const mediatypes = db.prepare("SELECT * FROM media_types")
    const data = mediatypes.all()

    if(!data || data.length === 0){
        return res.status(404).send("No Media Types Were found ")
    }

    res.status(200).json(data)
    } catch(err){
        console.log("Some Error has occured" , err);
        
    }
} )


export default router