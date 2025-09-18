// backend/src/controllers/user.js
const User = require('../models/User');
const { success, error } = require('../utils/response');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    return success(res, user, 'Profile fetched');
  } catch (e) { return error(res, e.message); }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return error(res, 'Not found', 404);
    user.name = name || user.name;
    await user.save();
    return success(res, { _id: user._id, name: user.name, email: user.email, role: user.role }, 'Profile updated');
  } catch (e) { return error(res, e.message); }
};

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return success(res, null, 'Account deleted');
  } catch (e) { return error(res, e.message); }
};
