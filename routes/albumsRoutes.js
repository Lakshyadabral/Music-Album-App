import express from "express";
import { validateAlbumPost, validateAlbumPatch } from "../validator.js";
import multer from "multer"; 
import {db} from "../app.js";


const router = express.Router();


//configure how multer behaves
const storage = multer.diskStorage({
  destination: './_FrontendStarterFiles/albumart/',
  filename: function(req , file , callback){
  try {
      const albumart = `upload_${file.originalname}`
      callback(null , albumart)
  }

  catch (err) {
  console.log("Some error has occured" , err);
  }
  }
})

const upload = multer({storage: storage})



// Get all albums

router.get("/", (req, res) => {
    try {
      const albums = db.prepare("SELECT * FROM albums").all();
      res.json(albums);
    }catch (err){
      console.log("Some error has occured" , err)
    }
  });

  
  // Get album by album id 

  router.get("/:albumid" , (req , res) => {
    try { const albums = db.prepare("SELECT * FROM albums WHERE AlbumId = ?")
    const data = albums.get(req.params.albumid)

    if(!data || data.length === 0){
      return res.status(404).send("No Albums Were Found")
    }
    res.json(data)
    } catch (err) {
      console.log("Some error has occured" , err)

    }

  })


  // Get All the tracks for the album 

  router.get("/:albumId/tracks", (req, res) => {
    try { 
      const tracks = db.prepare("SELECT * FROM tracks WHERE AlbumId = ?");
      const data = tracks.all(req.params.albumId);
      if (!data) {
          return res.status(200).json([]);
      }
      res.status(200).json(data);
    } catch (err){
      console.log("Some error has occured" , err);
    }
});



  // Create a new Album 

  router.post("/" , (req,res) => {

    try { 
    const validationResult = validateAlbumPost(req.body)
    if (validationResult) {
        return res.status(422).json(validationResult)
    }
    
      const insert = db.prepare("INSERT INTO albums (Title ,  ArtistId , ReleaseYear ) VALUES (?, ?, ?)");
      const result = insert.run(req.body.Title , req.body.ArtistId , req.body.ReleaseYear);
      res.status(201).json(result);
    }catch(err){
      console.log("Some Error Has occured" , err);
      
    }
  });

// Upload Album Art 

router.post("/:albumId/albumart", upload.single("albumart"), (req , res) => {
    try { 
    const file = req.file
    if(!file) {
      return res.status(400).send("File is not present")
    }

    const update = db.prepare("UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?")
    const result = update.run(file.filename , req.params.albumId);
    if (result.changes === 0) {
      return res.status(404).send({ error: "Album ID not found" });
  }
  res.status(200).json({
    filename: file.filename,
    message: `Album Art ${file.filename} was Uploaded Successfully`
});
 } catch (err){
  console.log("Some error has occured" , err);
 }

})


// Update new album 

  router.patch("/:albumId" , (req ,res) => {
  try{
    const validationResult = validateAlbumPatch(req.body);

    if (validationResult) {
      return res.status(422).json(validationResult); 
  }
  
    const update = db.prepare("UPDATE albums SET Title = ? , ReleaseYear = ? , ArtistId = ? WHERE AlbumId = ? ")
    const result = update.run(req.body.Title , req.body.ReleaseYear , req.body.ArtistId , req.params.albumId);

    if(result.changes === 0 ) {
      return res.status(404).send("Albums Not Found");
    }
    res.json({albumId: req.params.albumId, ...req.body})

    }catch(err){
      console.log("Some error has occured" , err);
      
    }

  })



// Delete an Album 

  router.delete("/:albumId" , (req , res) => {
    try{
      
    const del = db.prepare("DELETE from Albums WHERE AlbumId = ?");
    const result = del.run(req.params.albumId);

    if(result.changes === 0)
    return res.status(404).send("AlbumId Not Found")
    res.status(204).send()

    } catch (err){
      console.log("Some Error Has occured" , err);
    }
  })



  export default router;