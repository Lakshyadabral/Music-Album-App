import express from "express";
import { validateTrackPost, validateTrackPatch } from "../validator.js";
import { db} from "../app.js";


const router = express.Router();

// Get all the tracks 
    router.get("/" , (req , res) => {
        try {
        const tracks = db.prepare("SELECT * FROM tracks")
        const data = tracks.all()
        if(!data){
            return res.status(404).send("Cannot Get the tracks")
        }
        res.send(data)
        }catch (err){
            console.log("Some Error has occured" , err);
        }
    })

// Get Alll tracks based on the tracks id 
router.get("/:trackId" , (req , res) => {
    try{
    const tracks = db.prepare("SELECT * FROM tracks WHERE TrackId = ?")
    const data = tracks.get(req.params.trackId)

    if(!data){
        return res.status(404).send("Cannot get the details for the tracks")
    }

    res.send(data)
    }catch(err){
        console.log("Some Error had occured" , err); 
    }
})



// Create a new track 

    router.post("/" , (req , res) => {
        try {
        const validationResult = validateTrackPost(req.body)
        if (validationResult) {
            return res.status(422).json(validationResult)
        }
        const insert = db.prepare ("INSERT INTO tracks (Name , MediaTypeId, AlbumId, Milliseconds) VALUES (? , ? , ? ,?)")
        const result = insert.run(req.body.Name , req.body.MediaTypeId , req.body.AlbumId , req.body.Milliseconds)
        res.status(200).json(result);
        }catch(err){
            console.log("Some Error had occured" , err);
            
        }
        
    })


// Update a track

    router.patch("/:trackId" , (req , res) => {
        try {
        const validationResult = validateTrackPatch(req.body);
        if (validationResult) {
            return res.status(422).json(validationResult); 
        }

        const update = db.prepare("UPDATE tracks SET Name = ? , MediaTypeId = ?, AlbumId = ?,  Milliseconds = ? WHERE TrackId = ?");
        const result = update.run(req.body.Name, req.body.MediaTypeId, req.body.AlbumId, req.body.Milliseconds, req.params.trackId )
        if(result.changes === 0){
            return res.status(404).json("Track is not found")
        }

        res.json({trackId: req.params.trackId, ...req.body});

        }catch(err){
            console.log("Some Error Has Occured" , err);
            
        }
    })

// Delete a track 

    router.delete("/:trackId" , (req , res) => {
        try {
        const del = db.prepare("DELETE FROM tracks WHERE TrackId = ? ");
        const result = del.run(req.params.trackId);
        if(result.changes === 0 ){
            res.status(404).send("Track is not found")
        }
        res.status(204).send()
        }catch(err){
            console.log("Some error has occured" , err);         
        }
    })


export default router;