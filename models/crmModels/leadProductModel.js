const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var leadproductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
   description:{
    type: String,
   }
    // sold: {
    //   type: Number,
    //   default: 0,
    // },
    // images: [
    //   {
    //     public_id: String,
    //     url: String,
    //   },
    // ]
   
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("LeadProduct", leadproductSchema);
