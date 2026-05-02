const Group = require('../models/Group');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, members, icon } = req.body;
    
    const group = await Group.create({
      name,
      icon,
      members // Expecting an array of user ObjectIds
    });
    
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all groups for a user
exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find groups where this user is in the members array
    const groups = await Group.find({ members: userId }).populate('members', 'name email');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single group details
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ message: 'Group not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
