const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ROLES, USER_STATUS } = require('../utils/constants.json')

const { Schema } = mongoose

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

const userSchema = new Schema({
  firstName: { type: String, index: true, required: true },
  lastName: { type: String, index: true, required: true },
  bankId: { type: String, sparse: true, unique: true },
  email: { type: String, index: true, unique: true, sparse: true },
  phone: { type: String },
  countryCode: String,
  password: String,
  fullPhoneNumber: { type: String, unique: true },
  personalNumber: { type: String, unique: true, required: true },
  address: String,
  shouldResetPassword: { type: Boolean, default: false },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.TENANT },
  status: { type: String, enum: [USER_STATUS.ACTIVE, USER_STATUS.DISABLED], default: USER_STATUS.ACTIVE },
  otp: Number,
  otpTtl: Number
}, schemaOptions)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  if (this.isModified('phone') || this.isModified('countryCode')) {
    this.fullPhoneNumber = (this.countryCode || 0) + this.phone
  }
  next()
})

userSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 10)
  }
  if (this._update.phone || this._update.countryCode) {
    this._update.fullPhoneNumber = (this._update.countryCode || 0) + this._update.phone
  }
  next()
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.options.toJSON = {
  transform (_doc, ret) {
    delete ret.password
    delete ret.otp
    delete ret.otpTtl
    delete ret.shouldResetPassword
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
