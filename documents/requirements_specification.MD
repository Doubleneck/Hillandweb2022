# Software requirements

## Application

This is a web application for Hilland Records. The main purpose is to serve clients with up to date info about weekly Hilland Mondays live music club, 
releases, etc. 

Later development idea is to maintain a database for Hilland Mondays musicians to keep songlist up to date.

These two tasks will joint to each other, since the everyday users can make song requests, later vote favourite songs, see latest songlist, etc.


## This is also a Full Stack project for Full Stack Open at Helsinki University 

- I'm in CS bachelor program at Helsinki University.
- Documentation is in English.
- Application uses Node.js backend and React+Redux front with Mongo.db cloud database.


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
- [ ] user can see releases
- [x] user can see videos
- [ ] user can see archive (a collection of historical images)
- [x] user can send a song request


### Logged users:

- [x] user can see news, releases, etc. i.e. all open content
- [ ] user can see requested songs list
- [ ] user can filter requested songs list

(optional):

- [ ] user can see a list of Hilland Mondays songs
- [ ] user can vote favourite Hilland Mondays songs
- [ ] user can upload song attachements: pdf, link. 
- [ ] user can download song attachements: pdf, link.

### Admin users:

- [x] user can do everything a normal user can
- [x] user can add, remove and update news
- [ ] user can add, remove and update releases
- [ ] user can add, remove and update archive
- [ ] user can add new users
- [ ] user can remove items from requested songs list 

