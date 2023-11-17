
[![hilland_e2e CI](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/e2e.yml/badge.svg)](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/e2e.yml)

[![hilland_backend CI](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/hilland_backend.yml/badge.svg)](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/hilland_backend.yml)
# Hillandweb2022 / Full Stack Open project for Helsinki University

This is a web application for Hilland Records. The main purpose is to serve clients with up to date info about weekly Hilland Mondays live music club, releases, etc.

Optional later development idea is to maintain a database for Hilland Mondays musicians to keep songlist up to date.

These two tasks will joint to each other, since the everyday users can make song requests, vote favourite songs, see latest songlist, etc.

My main purpose was to learn to be able to use images in React-Node app, and my solution is to use Amazon AWS S3 for uploading and fetching images and Localstack fortesting/dev.


- [link to the demo app](https://hillandrecords.fly.dev)


## Workflow and technologies

This is a React/Node aplication with Redux and React Router, Jest and Cypress tests. Mongo Cloud for staging, local mongo and test db in Docker compose. Staging server is Fly.io.

Application uses Amazon AWS S3 for images and LocalStack for testing/dev enviroments. 
Note: for running this application locally with Docker , you have to get your own AWS credentials for localstack: AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID.
All the others needed are in user manual.

Repository uses Github Actions, the main branch is protected and the workflow is:
- CI is run always on push to the feature branch
- CD runs deployment to Fly.io always if merged to main branch. Deploy can be skipped with #skip in commit.
   -there is a short build part before deploy, just to check that build succees. The actual building in Fly is done in Dockerfile.


## Documentation

- [software requirements](https://github.com/Doubleneck/Hillandweb2022/blob/main/documents/requirements_specification.MD)  
- [user manual ](https://github.com/Doubleneck/Hillandweb2022/blob/main/documents/user_manual.MD)  
- [working hours ](https://github.com/Doubleneck/Hillandweb2022/blob/main/documents/working_hours_record.MD)  
