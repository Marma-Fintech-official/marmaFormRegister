const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: 
  { 
    type: String, 
    required: true 
},
  dateOfBirth: { 
    type: Date, 
    required: true 
},
  contactNumber: { 
    type: String, 
    required: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  photo: { 
    type: String, 
    required: true 
},
  preferredRole: { 
    type: String, 
    required: true 
},
  playerInformation: { 
    type: String
 },
  bowlingType: { 
    type: String 
},
  specialSkills: { 
    type: String 
},
  jerseySize: { 
    type: String 
},
  medicalConditions: { 
    type: String 
},
  emergencyContactName: { 
    type: String, 
    required: true 
},
  emergencyContactInfo: {
    type: String, 
    required: true 
},
  favoriteCricketer: { 
    type: String 
},
  acknowledgement: { 
    type: String 
},
  date: { 
    type: Date, 
    required: true
 },
});

module.exports = mongoose.model("User", userSchema);
