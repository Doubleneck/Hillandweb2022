const mongoose = require('mongoose')

const songrequestSchema = new mongoose.Schema({
  song: { 
    type: String,
    required: true
  },
  artist: String,
  date: { 
    type: Date,
    required: true 
  },
})
  
songrequestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Songrequest', songrequestSchema)