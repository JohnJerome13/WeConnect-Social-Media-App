const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body

    if(!name || !email || !password) {
        res.status(200)
        throw new Error('Please fill in all fields')
    }

    //Check if user exists
    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(200)
        throw new Error('User already exits')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Creat user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        req.status(400)
        throw new Error('Invalid user data')
    }
})
 
// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    } else {
        req.status(400)
        throw new Error('Invalid credentials')
    }

    res.status(200).json(user)
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const { _id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email
    })

})

// // @desc    Delete user
// // @route   DELETE /api/user/:id
// // @access  Private
// const deleteUser = asyncHandler(async (req, res) => {

//     const user = await User.findById(req.params.id)

//     if(!user) {
//         res.status(400)
//         throw new Error('User not found')
//     }

//     await User.remove()

//     res.status(200).json({ id: req.params.id })
// })

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}
module.exports = {
    registerUser,
    loginUser,
    getMe,
}

