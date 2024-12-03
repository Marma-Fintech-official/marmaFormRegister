const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx'); // For creating Excel files
const cloudinary = require('../utils/multer').cloudinary;
const { appendToSheet } = require('../utils/googleSheet'); // Import the function


// POST API to create a user
const createUser = async (req, res) => {
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists. Please use a different email.',
      });
    }
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Save the new user to MongoDB
    const newUser = new User({
      ...req.body,
      photo: result.secure_url,
    });
    await newUser.save();
    // Prepare user data for Excel export
    const userData = [
      newUser.fullName,
      newUser.dateOfBirth,
      newUser.contactNumber,
      newUser.email,
      newUser.photo,
      newUser.preferredRole,
      newUser.playerInformation,
      newUser.bowlingType,
      newUser.specialSkills,
      newUser.jerseySize,
      newUser.medicalConditions,
      newUser.emergencyContactName,
      newUser.emergencyContactInfo,
      newUser.favoriteCricketer,
      newUser.acknowledgement,
      newUser.date,
    ];
      // Define the Google Sheets ID and range (Sheet1, starting from row 2)
      const spreadsheetId = '10pCKmNWIzLU1giavbbF_Tewr-_ccbK8eM4132URvWms'; // Replace with your actual sheet ID
      const range = 'Sheet1!A2:P';
       // Append user data to the Google Sheet
    await appendToSheet(spreadsheetId, range, userData);
    res.status(201).json({
      message: 'User created successfully and data exported to Google Sheets',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const { passkey } = req.params;

    // Validate the passkey
    const validPasskey = 'Throughbit@123'; // Replace with your actual passkey
    if (passkey !== validPasskey) {
      return res.status(403).json({ message: 'Invalid passkey. Access denied.' });
    }

    // Fetch all users from the database
    const users = await User.find();

    // Check if there are no users in the database
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Prepare user data for Excel
    const userData = users.map((user) => ({
      FullName: user.fullName,
      DateOfBirth: user.dateOfBirth,
      ContactNumber: user.contactNumber,
      Email: user.email,
      Photo: user.photo,
      PreferredRole: user.preferredRole,
      PlayerInformation: user.playerInformation,
      BowlingType: user.bowlingType,
      SpecialSkills: user.specialSkills,
      JerseySize: user.jerseySize,
      MedicalConditions: user.medicalConditions,
      EmergencyContactName: user.emergencyContactName,
      EmergencyContactInfo: user.emergencyContactInfo,
      FavoriteCricketer: user.favoriteCricketer,
      Acknowledgement: user.acknowledgement,
      Date: user.date,
    }));

    // Generate the Excel file
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    const excelFilePath = path.join(exportsDir, 'users_data.xlsx');
    XLSX.writeFile(wb, excelFilePath);

    // Upload the Excel file to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(excelFilePath, {
      resource_type: 'raw', // For non-image files like PDFs
      public_id: 'users_data',
      folder: 'marmaForm',
      overwrite: true,
      format: 'xlsx',
      access_control: [
        {
          access_type: 'anonymous', // Ensure the file is publicly accessible
        },
      ],
    });

    // Delete the local file after upload
    fs.unlinkSync(excelFilePath);

    // Return the list of users with the Excel file link
    res.status(200).json({
      message: 'Users retrieved successfully.',
      users, // List of all users
      excelSheetUrl: cloudinaryResult.secure_url, // Link to the Excel sheet
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

module.exports = {
  createUser,
  getAllUsers
};
