const newsRouter = require('express').Router()
const multer = require('multer')
const validator = require('validator') 
const News = require('../models/news')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
const storage = multer.memoryStorage() // Store files in memory
const upload = multer({ storage })
let s3
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
  s3 = require('../s3_mock.js')
} else {
  s3 = require('../s3.js')  
}

newsRouter.get('/', async (req, res) => {
  const news = await News.find({})
  res.json(news)
})

newsRouter.get('/:id', async (request, response) => {
  
  const news = await News.findById(request.params.id)
  if (news) {
    response.json(news)
  } else {
    response.status(404).end()
  }
})

newsRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {
  try {
    const id = request.params.id

    if (!id || !validator.isMongoId(id)) {
      return response.status(400).json({ error: 'Invalid news ID format' })
    }

    const newsToUpdate = {
      title: request.body.title,
      content: request.body.content,
      url: request.body.url,
      imageURL: request.body.imageURL,
    }

    const updatedNews = await News.findByIdAndUpdate(id, newsToUpdate, { new: true })

    if (!updatedNews) {
      return response.status(404).json({ error: 'News not found' })
    }

    response.json(updatedNews)
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

newsRouter.post('/', userLoggedInValidator, adminCredentialsValidator, upload.single('imageFile'),async (request, response) => {
  
  try {
    if (!request.body.content || !request.body.title) {
      return response.status(400).json({
        error: 'content or title missing',
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
    const news = new News({
      title: request.body.title,
      content: request.body.content,
      date: new Date(),
      url: request.body.url,
      imageURL: s3Url,
    })
    // continue with creating a new News entry to save news to MongoDB
    const savedNews = await news.save()
    response.status(201).json(savedNews)
  } catch (error) {
    console.error('Error uploading image to S3:', error)
  } 
})

//This is the route for deleting news, it´s also handling the deletion of the image from S3
newsRouter.delete('/:id', userLoggedInValidator, adminCredentialsValidator, async (request, response) => {

  
  try {
    if (!request.params.id) {
      return response.status(400).json({
        error: 'id missing',
      })
    }
    const newsObject_to_be_removed = await News.findById(request.params.id)
    const toBeRemovedS3Id = await newsObject_to_be_removed.imageURL.split('/').pop()

    if (!newsObject_to_be_removed) {
      return response.status(404).json({
        error: 'News not found',
      })
    }
    await s3.deleteImageFromS3(toBeRemovedS3Id)
    await News.findByIdAndRemove(request.params.id)
      
    return response.status(204).end()
  }  catch (error) {
    console.error('Error:', error)
    return response.status(400).json({
      error: 'Something went wrong when deleting the news',
    })
  }
})

module.exports = newsRouter
