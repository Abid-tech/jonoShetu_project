const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    nidNumber:     { type: String, required: true, unique: true, trim: true },
    fullName:      { type: String, default: "" },
    dateOfBirth:   { type: String, default: "" },
    fatherName:    { type: String, default: "" },
    motherName:    { type: String, default: "" },
    address:       { type: String, default: "" },
    bloodGroup:    { type: String, default: "" },
    phone:         { type: String, required: true, unique: true, trim: true },
    password:      { type: String, required: true },
    frontImageUrl: { type: String, required: true },
    backImageUrl:  { type: String, required: true },
  },
  { timestamps: true }
);

// Auto-hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Use this in your login controller
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);