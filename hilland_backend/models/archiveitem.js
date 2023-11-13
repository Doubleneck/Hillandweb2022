const mongoose = require('mongoose')

const archiveItemSchema = new mongoose.Schema({
  title: { 
    type: String,
    required: true
  },
  content: { 
    type: String,
  },
  year: { 
    type: Number,
    required: true
  },
  imageURL: String
})
  
archiveItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('ArchiveItem', archiveItemSchema)