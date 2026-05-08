const mongoose = require('mongoose')

const roles = ['admin', 'driver', 'customer']

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: roles, required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    passwordHash: { type: String, required: true },

    resetPasswordTokenHash: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true },
)

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    role: this.role,
    name: this.name,
    phone: this.phone,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

const User = mongoose.model('User', userSchema)

module.exports = { User, roles }

