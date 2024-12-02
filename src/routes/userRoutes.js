const express = require('express')
const router = express.Router()
const { celebrate, Joi, Segments,errors } = require("celebrate");
const { createUser,getAllUsers } = require('../controller/userController')
const { upload } = require('../utils/multer')

// Routes
router.post(
  '/users',
  upload.single('photo'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      fullName: Joi.string().required(),
      dateOfBirth: Joi.date().required(), // Ensure date format is valid
      contactNumber: Joi.string().required(),
      email: Joi.string().email().required(), // Validate email format
      preferredRole: Joi.string().required(),
      playerInformation: Joi.string().required(),
      bowlingType: Joi.string().required(),
      specialSkills: Joi.string().required(),
      jerseySize: Joi.string().required(),
      medicalConditions: Joi.string().required(),
      emergencyContactName: Joi.string().required(),
      emergencyContactInfo: Joi.string().required(),
      favoriteCricketer: Joi.string().required(),
      acknowledgement: Joi.string().required(),
      date: Joi.date().required() // Ensure date format is valid
    })
  }),
  createUser
)

router.get('/getAllUsers/:passkey', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        passkey: Joi.string().required(), // Assuming MongoDB ObjectId format
    }),
  }), getAllUsers)

router.use(errors());

module.exports = router
