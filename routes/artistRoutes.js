import express from "express";
import { validateArtistPost, validateArtistPatch } from "../validator.js";
import { db } from "../app.js";


const router = express.Router();


// GET Data for all the artist 

    router.get("/", (req, res) => {
        try {
        const artists = db.prepare ('SELECT * FROM artists'); 
        const data = artists.all()
        if(!data){
            return res.status(404).send("Some Error Has occured")
        }
        res.send(data)

        } catch (err){
            console.log("Some Error Has occured" , err);
            
        }
    });




     // Search for artists by name
        router.get("/search/:term", (req, res) => {
        try {   
            const term = req.params.term;
            const searchQuery = db.prepare("SELECT * FROM artists WHERE Name LIKE ?");
            const data = searchQuery.all(`%${term}%`);
    
            if (!data || data.length === 0) {
                return res.status(200).json([]);            
            }
    
            res.status(200).json(data);
        } 
        
        catch(err){
            console.log("Some Error Has Occured" , err);
            }
        });


    // Get Artist Based on the artistid

    router.get("/:artistId" , (req , res) => {
        try {
        const artists = db.prepare ("SELECT * FROM artists WHERE ArtistId = ?");
        const data = artists.get(req.params.artistId)
        if(!data){
            return res.status(404).send("Some Error Has occured")
        }
        res.send(data)
        }catch{
            console.log("Some Error Had Occured", err);
            
        }

    })


    // Get route to get the data for specfic artist 
    router.get("/:artistId/albums", (req, res) => {
        try {
        const albums = db.prepare("SELECT * FROM albums WHERE ArtistId = ?");
        const data = albums.all(req.params.artistId);
        if (!data) {
          return res.status(404).send("No albums were found");
        }
        res.send(data);
        }catch{
            console.log("Some error has occured" , err);
        }
      });
      


// Create a new artist 

    router.post("/", (req, res) => {
        try {
        const validationResult = validateArtistPost(req.body)
        if (validationResult) {
            return res.status(422).json(validationResult)
        }

        const artistName = req.body.Name;
        const insert = db.prepare("INSERT INTO artists (Name) VALUES (?)");
        const result = insert.run(artistName);
        res.status(201).json(result);
    }catch (err){
        console.log("Some error has occured" , err);
    }
    });

  
// Update an artist 

    router.patch("/:artistId", (req, res) => {
       try {

            const validationResult = validateArtistPatch(req.body);
            if (validationResult) {
                return res.status(422).json(validationResult); 
            }
    
            const update = db.prepare("UPDATE artists SET Name = ? WHERE ArtistId = ?");
            const result = update.run(req.body.Name , req.params.artistId);

            if (result.changes === 0 ) {
                return res.status(404).json({ error: "Artist not found." });
            }

            res.status(200).json({ artistId: req.params.artistId, name: req.body.Name });

        }catch (error) {
            console.error("Server Error:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }

  });


  // Delete an artist
router.delete("/:artistId", (req, res) => {
    try{
    const del = db.prepare("DELETE FROM artists WHERE ArtistId = ?");
    const result = del.run(req.params.artistId);
    if (result.changes === 0) 
    return res.status(404).send("Artist not found");
    res.status(204).send();
    }catch(err){
        console.log("Some error has occured" , err);  
    }
  });


  export default router;
