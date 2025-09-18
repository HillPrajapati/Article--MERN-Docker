
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required:true },
  email: { type: String, required:true, unique:true, index:true },
  password: { type: String, required:true },
  role: { type: String, enum:['user','admin'], default:'user' },
  refreshToken: { type: String, default: null }
},{ timestamps:true });

// Password compare
UserSchema.methods.matchPassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
