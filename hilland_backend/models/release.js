const mongoose = require('mongoose')

const releaseSchema = new mongoose.Schema({
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
  listenLink: { 
    type: String,
  },
  buyLink: { 
    type: String,
  },
  imageURL: String
})
  
releaseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Release', releaseSchema)