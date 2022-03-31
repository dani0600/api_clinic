var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var personSchema = new Schema({
  birthDate: { type: Date },
  age: { type: Number,  enum: ["Hombre", "Mujer", "No Binario"], },
  postalCodeId: { type: String },
  country: { type: String },
});

module.exports = mongoose.model("Person", personSchema);