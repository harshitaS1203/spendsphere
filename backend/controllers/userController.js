const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if email already exists (case-insensitive)
    const emailExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if username already exists (case-insensitive)
    const nameExists = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (nameExists) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user (simple)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
