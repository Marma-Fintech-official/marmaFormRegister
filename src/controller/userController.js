const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx'); // For creating Excel files
const cloudinary = require('../utils/multer').cloudinary;

const createUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists. Please use a different email.',
      });
    }

    // Ensure a file is uploaded (if required for the user creation)
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    // Create a new user
    const newUser = new User({
      ...req.body,
      photo: req.file.path, // File path uploaded via multer (if needed)
    });

    // Save the new user to the database
    await newUser.save();

    // Step 1: Return success response with the user data
    res.status(201).json({
      message: 'User created successfully.',
      user: newUser, // Provide the created user data
    });
  } catch (error) {
    console.error('Error creating user:', error);
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
