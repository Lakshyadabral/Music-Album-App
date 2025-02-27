import express from "express"; // Importing express 
import Database from 'better-sqlite3'; // Importing Database from better sqlite3 package
import artistsRoutes from "./routes/artistRoutes.js";
import albumsRoutes from "./routes/albumsRoutes.js";
import trackRoutes from "./routes/tracksRoutes.js";
import themesRoutes from "./routes/themesRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js"


import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;


const app = express() 
const db = new Database('./database/chinook.sqlite' , {fileMustExist: true}) // Fetching the database from chinook


// Middlewares
app.use(express.json());
app.use(express.static("_FrontendStarterFiles"));
app.use("/api/artists", artistsRoutes); 
app.use("/api/albums" , albumsRoutes);
app.use("/api/tracks" , trackRoutes);
app.use("/api/themes" , themesRoutes)
app.use("/api/mediatypes" , mediaRoutes)




app.listen( PORT, (err)=>{
    if(err){
        console.log("Some error has occured")
    }
    console.log(`listening on port 3000`)
})


export {db};
