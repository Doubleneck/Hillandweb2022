const archivesRouter = require('express').Router()
const multer = require('multer')
const validator = require('validator') 
const ArchiveItem = require('../models/archiveitem')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
const storage = multer.memoryStorage() // Store files in memory
const upload = multer({ storage })
const validateYear = require('../utils/yearvalidator')
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  s3 = require('../s3_mock.js')
} else {
  s3 = require('../s3.js')  
}

archivesRouter.get('/', async (req, res) => {
  const archives = await ArchiveItem.find({})
  res.json(archives)
})

archivesRouter.get('/:id', async (request, response) => {
  
  try{
    const id = request.params.id

    if (!id || !validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid archiveItem ID format' })
    }
    const archives = await ArchiveItem.findById(request.params.id)
    if (archives) {
      response.json(archives)
    } else {
      response.status(404).end()
    }} catch  (error) {
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

archivesRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  try {
    const id = request.params.id

    if (!id || !validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid archives ID format' })
    }

    if (!validateYear(request.body.year)) {
      return response.status(400).json({
        error: 'year must be a number between 2014 and present year',
      })
    }
    if (!request.body.year || !request.body.title) {
      return response.status(400).json({
        error: 'year or title missing',
      })
    }
    const archiveItemToUpdate = {
      title: request.body.title,
      content: request.body.content,
      year: request.body.year,
      imageURL: request.body.imageURL,
    }

    const updatedArchiveItem = await ArchiveItem.findByIdAndUpdate(id, archiveItemToUpdate, { new: true })

    if (!updatedArchiveItem) {
      return response.status(404).json({ error: 'Archive item not found' })
    }

    response.json(updatedArchiveItem)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

archivesRouter.post('/', userLoggedInValidator, adminCredentialsValidator, upload.single('imageFile'),async (request, response) => {
  
  try {
    if (!validateYear(request.body.year)) {
      return response.status(400).json({
        error: 'year must be a number between 2014 and present year',
      })
    }
    if (!request.body.year || !request.body.title) {
      return response.status(400).json({
        error: 'year or title missing',
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
    const newItem = new ArchiveItem({
      title: request.body.title,
      content: request.body.content,
      year: request.body.year,
      imageURL: s3Url,
    })
    // continue with creating a new archive item entry to save archive item to MongoDB
    const savedArchiveItem = await newItem.save()
    response.status(201).json(savedArchiveItem)
  } catch (error) {
    console.error('Error uploading image to S3:', error)
  } 
})

//This is the route for deleting archives, it´s also handling the deletion of the image from S3
archivesRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  
  try {
    if (!request.params.id) {
      return response.status(400).json({
        error: 'id missing',
      })
    }
    const archiveItem_to_be_removed = await ArchiveItem.findById(request.params.id)
    const toBeRemovedS3Id = await archiveItem_to_be_removed.imageURL.split('/').pop()

    if (!archiveItem_to_be_removed) {
      return response.status(404).json({
        error: 'Archive item not found',
      })
    }
    await s3.deleteImageFromS3(toBeRemovedS3Id)
    await ArchiveItem.findByIdAndRemove(request.params.id)
      
    return response.status(204).end()
  }  catch (error) {
    console.error('Error:', error)
    return response.status(400).json({
      error: 'Something went wrong when deleting the archive item',
    })
  }
})

module.exports = archivesRouter
