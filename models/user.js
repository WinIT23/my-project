import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  isMailVerified: Boolean,
  password: { type: String }
});

export default model('User', userSchema);