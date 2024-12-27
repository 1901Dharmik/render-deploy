const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    color: {
      type: String,
      // required:[true,"Color is required"],
    },

    start: {
      type: Date,
      required: [true, "Start date is required"],
    },
    end: {
      type: Date,
      required: [true, "End date is required"],
    },
    notes: {
      type: String,
    },
    // createdBy:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // }
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "User is required"],
    // },
  },
  {
    timestamps: true,
  }
);

// EventSchema.methods.toJSON = function () {
//   const { __v, ...event } = this.toObject();
//   return event;
// };

module.exports = mongoose.model("Event", EventSchema);
