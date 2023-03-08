[![hilland_backend CI](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/hilland_backend.yml/badge.svg)](https://github.com/Doubleneck/Hillandweb2022/actions/workflows/hilland_backend.yml)
# Hillandweb2022 / Full Stack Open project for Helsinki University

This is a web application for Hilland Records. The main purpose is to serve clients with up to date info about weekly Hilland Mondays live music club, releases, etc.

Optional later development idea is to maintain a database for Hilland Mondays musicians to keep songlist up to date.

These two tasks will joint to each other, since the everyday users can make song requests, vote favourite songs, see latest songlist, etc.

My main purpose was to learn to be able to use images in React-Node app, and my solution is to use Amazon AWS S3 for uploading and fetching images.
Special feature in this app is, that the front is actually sending image files straight from the browser to S3 for fast upload. Only authorisation and url requests are made via backend.

- [link to the demo app](https://hillandweb.fly.dev)

Missing parts (to be finished) at the moment:
- [ ] Missing functional parts of the app at the moment can bee seen in software requirements document 
- [ ] most of backend testing
- [ ] e2e testing (Cypress)
- [ ] e2e CI 
- [ ] testing documentation
- [ ] users manual


## Documentation

- [software requirements](https://github.com/Doubleneck/Hillandweb2022/blob/main/documents/requirements_specification.MD)  
- [working hours ](https://github.com/Doubleneck/Hillandweb2022/blob/main/documents/working_hours_record.MD)  
