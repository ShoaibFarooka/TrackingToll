const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
      enum: ["admin", "sales", "application", "operations_support", "asset_inventory", "repair_maintenance", "logistics", "field_operation"]
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
