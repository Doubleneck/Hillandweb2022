const { S3Client, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3')
const { fromIni } = require('@aws-sdk/credential-provider-ini')

// Set up AWS credentials using profile from your AWS credentials file
const s3Client = new S3Client({ region: 'eu-central-1', credentials: fromIni() })

async function initializeLocalStackS3() {
  console.log('Initializing LocalStack S3')
  try {
    // Create an S3 bucket
    await s3Client.send(new CreateBucketCommand({ Bucket: 'hillandwebimgs' }))

    // Check if the bucket is created
    const response = await s3Client.send(new ListBucketsCommand())
    const bucketList = response.Buckets

    console.log('Bucket created successfully.')
    console.log('List of buckets:', bucketList)
  } catch (error) {
    console.error('Error initializing LocalStack S3:', error)
  }
}

initializeLocalStackS3()