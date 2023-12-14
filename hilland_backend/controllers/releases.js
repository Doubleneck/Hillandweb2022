const releasesRouter = require('express').Router()
const multer = require('multer')
const validator = require('validator') 
const Release = require('../models/release')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
const storage = multer.memoryStorage() // Store files in memory
const upload = multer({ storage })
const validateYear = require('../utils/releaseyearvalidator')
let s3
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  s3 = require('../s3_mock.js')
} else {
  s3 = require('../s3.js')  
}

releasesRouter.get('/', async (req, res) => {
  const releases = await Release.find({})
  res.json(releases)
})

releasesRouter.get('/:id', async (request, response) => {

  const id = request.params.id

  if (!id || !validator.isMongoId(id)) {
    return response.status(400).json({ error: 'Invalid release ID format' })
  }
  const releases = await Release.findById(request.params.id)

  if (releases) {
    response.json(releases)
  } else {
    response.status(404).end()
  }
})

releasesRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

 
  const id = request.params.id

  if (!id || !validator.isMongoId(id)) {
    return response.status(400).json({ error: 'Invalid archives ID format' })
  }

  if (!validateYear(request.body.year)) {
    return response.status(400).json({
      error: 'year must be a number between 2005 and present year',
    })
  }

  if (!request.body.year || !request.body.title) {
    return response.status(400).json({
      error: 'year or title missing',
    })
  }

  const releaseToUpdate = {
    title: request.body.title,
    content: request.body.content,
    year: request.body.year,
    buyLink: request.body.buyLink,
    listenLink: request.body.listenLink,
    imageURL: request.body.imageURL,
  }

  const updatedRelease = await Release.findByIdAndUpdate(id, releaseToUpdate, { new: true })

  if (!updatedRelease) {
    return response.status(404).json({ error: 'Archive item not found' })
  }

  response.json(updatedRelease)
  
})

releasesRouter.post('/', userLoggedInValidator, adminCredentialsValidator, upload.single('imageFile'),async (request, response) => {
  
 
  if (!request.body.year || !request.body.title) {
    return response.status(400).json({
      error: 'year or title missing',
    })
  }
  
  if (!validateYear(request.body.year)) {
    return response.status(400).json({
      error: 'year must be a number between 2005 and present year',
    })
  }
      
  if (!request.file) {
    return response.status(400).json({
      error: 'image missing',
    })
  }
    
  const imageFileBuffer =  request.file.buffer
  // Upload the image to Amazon S3
  const s3Url = await s3.uploadImageToS3(imageFileBuffer)
  const newItem = new Release({
    title: request.body.title,
    content: request.body.content,
    year: request.body.year,
    buyLink: request.body.buyLink,
    listenLink: request.body.listenLink,
    imageURL: s3Url,
  })
  // continue with creating a new archive item entry to save archive item to MongoDB
  const savedRelease = await newItem.save()
  response.status(201).json(savedRelease)
})

//This is the route for deleting archives, it´s also handling the deletion of the image from S3
releasesRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  if (!request.params.id) {
    return response.status(400).json({
      error: 'id missing',
    })
  }
  const releaseToBeRemoved = await Release.findById(request.params.id)
  const toBeRemovedS3Id = await releaseToBeRemoved.imageURL.split('/').pop()

  if (!releaseToBeRemoved) {
    return response.status(404).json({
      error: 'Archive item not found',
    })
  }
  await s3.deleteImageFromS3(toBeRemovedS3Id)
  await Release.findByIdAndRemove(request.params.id)
      
  return response.status(204).end()

})

module.exports = releasesRouter