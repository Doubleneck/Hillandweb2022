const mongoose = require('mongoose')

const mediaItemSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  imageURL: String
})
  
mediaItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('MediaItem', mediaItemSchema)