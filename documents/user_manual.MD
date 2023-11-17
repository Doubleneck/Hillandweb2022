# User Manual

## Clone the repo: 

```bash
 git clone git@github.com:Doubleneck/Hillandweb2022.git
```

## For Backend Development

1. In the "hilland_backend" directory, install dependencies:

```bash
npm install
```

Start MongoDB and LocalStack S3  with Docker Compose, in the "hilland_backend" directory:

NOTE: LocalStack here is not pro-version. It means that if you run docker-compose down, images will disappear.
This works quite fine for dev-purposes. It´s also possible to use f.ex. cloud mongo if persistence needed.

```bash
 docker compose -f docker-compose.dev.yml up
```

Set MongoDB environment variables in the local development dotenv file (.env should be added to the root of hilland_backend):

```bash
MONGODB_URI=mongodb://the_username:the_password@localhost:3456/the_database
TEST_MONGODB_URI=mongodb://the_username:the_password@localhost:3457/the_test_database
```

Also, add the following environment variables to the dotenv file: 

```bash
SECRET=mikatahansamerkkijono
PORT=3001
```

You need also these environment variables to run Localstack

(Create your own AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID at AWS) :  

```bash 
S3_MOCK_ENDPOINT=http://localhost:4566
TEST_S3_MOCK_ENDPOINT=http://localhost:4567
AWS_REGION=eu-central-1
AWS_S3_BUCKET=hillandwebimgs
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY_ID=

```

Run backend tests in the "hilland_backend" directory:

```bash
npm run test
```


2. For local development you can initial test users by :
Setting the .env for test database (TEST_MONGODB_URI) temporarily to be a dev url: 

```bash
TEST_MONGODB_URI = mongodb://the_username:the_password@localhost:3456/the_database

```

Run test to initialise dev db: 

```bash
 npm run test
```

After running the tests, the development database will have the following users: 

```bash
User: 
  username: 'user@user.com'
  password: 'User@user1'

Admin: 
  username: 'admin@admin.com'
  password: 'Admin@admin1'
```

Set now in .env back the test and env databases back to "normal": 

```bash
MONGODB_URI=mongodb://the_username:the_password@localhost:3456/the_database
TEST_MONGODB_URI=mongodb://the_username:the_password@localhost:3457/the_test_database
```

## For Frontend Development:
 
In the "hilland_front" directory, install dependencies: 	

```bash
npm install
```

Start the frontend:

```bash
 npm start
```

## Run e2e tests:  Make a build, and start backend in the hilland_backend folder: 

```bash
 npm run start:full:test
```  

Start an instance of front in the hilland_front folder: 

```bash
npm start
```

Start cypress testing by running in another terminal  hilland_front folder:

```bash
 npm run cypress:open
```


