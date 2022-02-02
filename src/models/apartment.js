const mongoose = require('mongoose')
const { APARTMENT_STATUS } = require('../utils/constants.json')
const { Schema } = require('mongoose')

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

const apartmentSchema = new Schema({
  name: { type: String, index: true, required: true },
  address: String,
  status: { type: String, enum: Object.values(APARTMENT_STATUS), default: APARTMENT_STATUS.ACTIVE },
  floor: Number,
  block: String,
  customName: String,
  isOccuppied: { type: Boolean, default: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', sparse: true },
  complex: { type: Schema.Types.ObjectId, ref: 'Complex', sparse: true }
}, schemaOptions)

const Apartment = mongoose.model('Apartment', apartmentSchema)

module.exports = Apartment
