const ttl = require('mongoose-ttl')
const mongoose = require('mongoose')
const { Schema } = mongoose

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
}

const tokenSchema = new Schema({
  active: { type: Boolean, default: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  createdAt: { type: Date, default: Date.now }
},
schemaOptions)

tokenSchema.plugin(ttl, { ttl: 172800000 })

const Token = mongoose.model('UserToken', tokenSchema)

module.exports = Token
