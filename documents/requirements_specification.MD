# Software requirements

## Application

This is a web application for Hilland Records. The main purpose is to serve clients with up to date info about weekly Hilland Mondays live music club, 
releases, etc. 

Later development idea is to maintain a database for Hilland Mondays musicians to keep songlist up to date.

These two tasks will joint to each other, since the everyday users can make song requests, later vote favourite songs, see latest songlist, etc.


## This is also a Full Stack project for Full Stack Open at Helsinki University 

- I'm in CS bachelor program at Helsinki University.
- Documentation is in English.
- Application uses Node.js backend and React+Redux front with Mongo.db cloud database and AWS S3 & Localstack for images.

## CI/CD, testing, linting and Docker dev/test-environment
- [x] Working CI Github Actions: server with proper tests and linting
- [x] Working CI Github Actions: client with proper e2e tests and linting 
- [x] Working CD Github Actions: pipeline releases as soon as new pr is merged to main
- [x] Docker compose for local dev and testing: Note! Localstack dev is not PRO-version, so images are not saved persistently, they disappear if compose runs down.

## TESTING
- Jest with Localstack and lint backend
- Some jest-dom component tests and Cypress e2e with with Localstack and lint client

## Users

- non registered
- users (with ability to see songlists, add songs etc)
- admin (with ablility to create users, ability to create, update and delete web content)


## UI

- React/Redux front

## Functionality
### Non-registered / non-logged users:

- [x] user can see news
- [x] user can use Trucker caps link to navigate to the Hattu Helsinki net store 
- [x] user can see releases
- [x] user can see videos
- [x] user can see archive (a collection of historical images)
- [x] user can send a song request

(optional, further development):
- [ ] Musicians / Band section to introduce players
- [ ] Contact / info page

### Logged users:

- [x] user can see news, releases, etc. i.e. all open content
- [x] user can see requested songs list
- [x] user can filter requested songs list

(optional):

- [ ] user can upload song attachements: pdf, link. 
- [ ] user can download song attachements: pdf, link.

### Admin users:

- [x] admin can do everything a normal user can
- [x] admin can add, remove and update news
- [x] admin can add, remove and update releases
- [x] admin can add, remove and update archive
- [x] admin can remove items from requested songs list 

