const mediaRouter = require('express').Router()
const multer = require('multer')
const validator = require('validator') 
const MediaItem = require('../models/mediaitem')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
const storage = multer.memoryStorage() // Store files in memory
const upload = multer({ storage })
let s3
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  s3 = require('../s3_mock.js')
} else {
  s3 = require('../s3.js')  
}

mediaRouter.get('/', async (req, res) => {
  const mediaItems = await MediaItem.find({})
  res.json(mediaItems)
})

mediaRouter.get('/:id', async (request, response) => {
  
  const news = await MediaItem.findById(request.params.id)
  if (news) {
    response.json(news)
  } else {
    response.status(404).end()
  }
})

mediaRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  try {
    const id = request.params.id

    if (!id || !validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid media item ID format' })
    }

    const mediaItemToUpdate = {
      title: request.body.title,
      imageURL: request.body.imageURL,
    }

    const updatedMediaItem = await MediaItem.findByIdAndUpdate(id, mediaItemToUpdate, { new: true })

    if (!updatedMediaItem) {
      return response.status(404).json({ error: 'Media item not found' })
    }

    response.json(updatedMediaItem)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

mediaRouter.post('/', userLoggedInValidator, adminCredentialsValidator, upload.single('imageFile'),async (request, response) => {
  
  try {
    if (!request.body.title) {
      return response.status(400).json({
        error: 'title missing',
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
    const mediaItem = new MediaItem({
      title: request.body.title,
      date: new Date(),
      imageURL: s3Url,
    })
    // continue with creating a new News entry to save news to MongoDB
    const savedMediaItem = await mediaItem.save()
    response.status(201).json(savedMediaItem)
  } catch (error) {
    console.error('Error uploading image to S3:', error)
  } 
})

//This is the route for deleting news, it´s also handling the deletion of the image from S3
mediaRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  
  try {
    if (!request.params.id) {
      return response.status(400).json({
        error: 'id missing',
      })
    }
    const mediaObject_to_be_removed = await MediaItem.findById(request.params.id)
    const toBeRemovedS3Id = await mediaObject_to_be_removed.imageURL.split('/').pop()

    if (!mediaObject_to_be_removed) {
      return response.status(404).json({
        error: 'Media item not found',
      })
    }
    await s3.deleteImageFromS3(toBeRemovedS3Id)
    await MediaItem.findByIdAndRemove(request.params.id)
      
    return response.status(204).end()
  }  catch (error) {
    console.error('Error:', error)
    return response.status(400).json({
      error: 'Something went wrong when deleting the media object',
    })
  }
})

module.exports = mediaRouter