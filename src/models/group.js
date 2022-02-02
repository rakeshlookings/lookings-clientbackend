const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

const groupSchema = new Schema({
  name: { type: String, index: true, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, schemaOptions)

const Group = mongoose.model('Group', groupSchema)

module.exports = Group
