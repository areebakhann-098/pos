import BusinessLocation from "../model/business-location.model.js";

// creta enew business location

export const createBusinessLocation = async (req, res) => {
    try{
        const location = await BusinessLocation.create(req.body);
        res.status(201).json({
            success: true,
            message: "Business Location created sucessfully",
            data: location,

        });

    } catch (error){
        res.status(500).json({ success: false, messgae: error.message});

    }
};

// get all business location
export const getAllBusinessLocations = async (req, res) =>{
    try{
        const locations = await BusinessLocation.findAll();
        res.status(200).json({ success: true, locations});
    }catch(error){
        res.status(500).json({sucess: false, message: error.message});
    }
};

// get by id

export const getBusinessLocationById = async (req, res) =>{
    try{
        const location = await BusinessLocation.findByPk(req.params.id);

        if (!location){
            return res.status(404).json({sucess: false, message: "Business location not found"})
        }
        res.status(200).json({
            success: true,
            message: location
        });
    }catch(error){
        res.status(500).json({
            sucess: false,
            message: error.message
        });
    }

};

// update business location
export const updateBusinessLocation = async (req, res)=>{
    try{
        const location = await BusinessLocation.findByPk(req.params.id);

        if(!location){
             return res.status(404).json({sucess: false, message: "Business location not found"})
        }
        await location.update(req.body);

        res.status(200).json({
            success: "business location updated sucessfully",
            data:location,
        });
        
    }catch(error){
        res.status(500).json({
            sucess: false,
            message:error.messgae
        });
    }
};
// Delete business location (soft delete because of paranoid: true)
export const deleteBusinessLocation = async (req, res) => {
  try {
    const location = await BusinessLocation.findByPk(req.params.id);

    if (!location) {
      return res.status(404).json({ success: false, message: "Business Location not found" });
    }

    await location.destroy();

    res.status(200).json({ success: true, message: "Business Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};