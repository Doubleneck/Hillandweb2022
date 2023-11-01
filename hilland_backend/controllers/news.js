const newsRouter = require('express').Router()
const News = require('../models/news')
const s3 = require('../s3.js')
const multer = require('multer')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')  
const storage = multer.memoryStorage() // Store files in memory
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const upload = multer({ storage })

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

newsRouter.put('/:id', userLoggedInValidator, adminCredentialsValidator, (request, response, next) => {

  const news = {
    title: request.body.title,
    content: request.body.content,
    url: request.body.url,
    imageURL: request.body.imageURL,
  }

  News.findByIdAndUpdate(request.params.id, news, { new: true })
    .then((updatedNews) => {
      response.json(updatedNews)
    })
    .catch((error) => next(error))
})

newsRouter.post('/', userLoggedInValidator, adminCredentialsValidator, upload.single('imageFile'),async (request, response) => {
  
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
  const imageFileBuffer = request.file.buffer
  

  const s3Client = new S3Client({ region: 'eu-central-1' }) // Configure your region
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  // Set your S3 bucket and object key
  const s3Bucket = 'hillandwebimgs'
  const s3ObjectKey = imageName // You can generate a unique key

  // Set the parameters for the S3 upload
  const params = {
    Bucket: s3Bucket,
    Key: s3ObjectKey,
    Body: imageFileBuffer, // Set the file content here
  }

  try {
  // Upload the image to Amazon S3
    const uploadResponse = await s3Client.send(new PutObjectCommand(params))
    console.log('Image uploaded to S3 successfully:', uploadResponse)
    const s3Url = `https://${s3Bucket}.s3.eu-central-1.amazonaws.com/${s3ObjectKey}`

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

  const newsObject_to_be_removed = await News.findById(request.params.id)
  const toBeRemovedS3Id = await newsObject_to_be_removed.imageURL.split('/')[3] 
  await News.findByIdAndRemove(request.params.id)
  await s3.deleteImage(toBeRemovedS3Id)
  return response.status(204).end()
})

module.exports = newsRouter
