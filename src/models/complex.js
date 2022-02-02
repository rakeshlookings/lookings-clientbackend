const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

const complexSchema = new Schema({
  name: { type: String, index: true, required: true, unique: true },
  address: String,
  admins: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, schemaOptions)

const Complex = mongoose.model('Complex', complexSchema)

module.exports = Complex
