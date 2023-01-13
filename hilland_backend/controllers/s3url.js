const s3urlRouter = require('express').Router()
const generateUploadURL = require('../s3.js').generateUploadURL
const s3 = require('../s3.js')

s3urlRouter.get('/', async (req, res) => {
  const url = await s3.generateUploadURL()
  await res.send({ url })
})

s3urlRouter.post('/', async (req, res) => {
  const toBeDeletedInS3Id = req.body.id
  await s3.deleteImage(toBeDeletedInS3Id)
  return
})

module.exports = s3urlRouter
