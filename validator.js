import Joi from "joi";

    const artistFields = {
        Name: Joi.string().max(50).required(),
    };

    const albumFields = {
    Title: Joi.string().max(100).required(),
    ReleaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    ArtistId: Joi.number().integer().required(),
    };


    const trackFields = {
      Name: Joi.string().max(100).required(),
      MediaTypeId: Joi.number().integer().required(),
      AlbumId: Joi.number().integer().required(),
      Milliseconds: Joi.number().integer().min(60000).required(),
    };


    const artistPostSchema = Joi.object({
        ...artistFields,
      });

      const artistPatchSchema = Joi.object({
        ...artistFields,
      });


      const albumPostSchema = Joi.object({
        ...albumFields,
    
      });
      
      const albumPatchSchema = Joi.object({
        ...albumFields,
      });
      
      const trackPostSchema = Joi.object({
        ...trackFields,
      
      });
      
      const trackPatchSchema = Joi.object({
        Name: Joi.string().max(100).required(),
        MediaTypeId: Joi.number().integer().required(),
        AlbumId: Joi.number().integer().required(),
        Milliseconds: Joi.number().integer().min(60000).required(),
      });


      const validateSchema = (payload, schema) => {
        const result = schema.validate(payload); 
        if (result.error) {
            return result.error.details.map(detail => ({
                message: detail.message
            }));
        }
        return null;
    };


    
      // Export validation functions
      export const validateArtistPost = (payload) => validateSchema(payload, artistPostSchema);
      export const validateArtistPatch = (payload) => validateSchema(payload, artistPatchSchema);
      export const validateAlbumPost = (payload) => validateSchema(payload, albumPostSchema);
      export const validateAlbumPatch = (payload) => validateSchema(payload, albumPatchSchema);
      export const validateTrackPost = (payload) => validateSchema(payload, trackPostSchema);
      export const validateTrackPatch = (payload) => validateSchema(payload, trackPatchSchema);
      