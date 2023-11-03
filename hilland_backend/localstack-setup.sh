#!/bin/sh
echo "Initializing localstack s3"

aws --endpoint-url=http://localhost:4566 s3 mb s3://hillandwebimgs
echo "checking if bucket is created:"
aws --endpoint-url="http://localhost:4566" s3 ls