require('dotenv').config()

let PORT = process.env.PORT || 3001

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

const S3_MOCK_ENDPOINT = 
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_S3_MOCK_ENDPOINT  
    : process.env.S3_MOCK_ENDPOINT
    
module.exports = {
  MONGODB_URI,
  S3_MOCK_ENDPOINT,
  PORT,
}
