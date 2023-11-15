#Working Hours Record

|date | hours |  |
|:--:|:--|:----|
|20.11.2022|2| Init Hilland web project & documentation|
|26.12.2022|7| Creating MVP for adding news, testing image upload|
|27.12.2022|7| Attempts to convert input to base64|
|27.12.2022|2| base64 working, refactoring, init validation for uploads|
|28.12.2022|6| node express installation, node express backend for news|
|28.12.2022|3| mongo installation, mongo init configurations & tests|
|29.12.2022|2| express backend to use mongo / neww: create, remove, all, refactoring|
|29.12.2022|1| Add new parameter "url" to news e2e"|
|29.12.2022|1| Add eslint, clean code, remove obsolete sqlite3|
|30.12.2022|2| fully refactor backend, add Jest test-configuration|
|1.1.2023|4| add supertests for news, change news routes to async|
|2.1.2023|2| refactor tests, refactor async funcs news routes|  
|2.1.2023|1| add basic user functionality: model, controller, init tests|
|3.1.2023|1| add requirements_specification|
|3.1.2023|3| add token-based login functionality to backend|
|3.1.2023|2| resolve user extractor problem|
|4.1.2023|4| update tests to pass with authentication, clean code|
|4.1.2023|1| fix tests, add jwt check to update & delete news + tests| 
|4.1.2023|1| add front end login functionality: form|
|4.1.2023|1| first tests with Github actions: problems, skip for a while|
|5.1.2023|2| add front local storage token, add sorting for news, clean code|
|5.1.2023|3| fix bug in create news|
|5.1.2023|2| learning to load static content from node back to react front|
|6.1.2023|3| Github Actions for hilland_backend, mongo inst (path for tests fails)| 
|6.1.2023|1| Github Actions: CI working for backend|
|8.1.2023|3| Refactor front end to Components: LoginForm, NewsForm, Togglable |
|8.1.2023|2| new Direction: Base64 image files in DB too slow, Amazon S3 orientation| 
|8.1.2023|2| more Amazon S3: establishing AWS account, config|
|9.1.2023|1| update front&back to use news field:image => imageURL for AWS S3|
|9.1.2023|2| configure S3 secrets & policies & create user profile|
|10.1.2023|7| learning to run S3 images from React, made a small test app for s3|  
|10.1.2023|1| put s3 React-Node test app working, needs refactoring to require-syntax|
|11.1.2023|2| Refactoring s3 test app, upgrading Hilland app to use S3 storage| 
|11.1.2023|1| Refactoring front |
|11.1.2023|1| upgraded alerts to  Error & Update notification / front|
|11.1.2023|2| add delete img functionality to s3 React-Node test app, working| 
|12.1.2023|2| upgrade s3 test app to use post for delete images from S3|
|12.1.2023|1| fix bug in delete news|
|12.1.2023|1| upgrading permissions for users and news|
|12.1.2023|4| add update news functionality|
|13.1.2023|1| add s3 file delete functionality to app|
|13.1.2023|1| add logout functionality, fix user creation permissions|
|15.1.2023|2| refactor tests, new class user_api.tests, add tests for wrong auth|
|15.1.2023|1| add tests to check unauth access to s3 routes |
|16.1.2023|2| refactor front new service s3.js, fix s3url path auth failure|
|17.1.2023|3| fix and change delete img from S3 functionality|
|18.1.2023|1| fix & update removeNews, add proxy, add forceUpdate to updatenews|
|29.1.2023|1| add notification to wrong creds login, add build scripts, build |
|9.2.2023|4| refactor app to use react-redux reducers: notification|
|12.2.2023|6| refactor app to use react-redux reducers: news|
|14.2.2023|5| refactor app to use react-redux reducers: login & news|
|15.2.2023|2| add automatic logout token expiration functionality to front|
|28.2.2023|4| Refactor app to use React router|
|28.2.2023|3| Add React Bootstrap, tweak navbar & news scene|
|1.3.2023|5| Add frontend functionality: send song request, tweak news|
|2.3.2023|2| Debug build problem: only home rendered|
|2.3.2023|1| Fix Safari rendering problem|
|2.3.2023|1| Add Videos route & rendering component for Youtube embeds front|
|3.3.2023|1| Add Trucker Cap Component & link to the webstore front|
|3.3.2023|1| Add Google Maps & FB Link to Home Page front|
|4.3.2023|5| Add Insta Link, upgrade buttons & forms:news, refactor routing, fix news refresh bug|
|4.3.2023|1| Add song request functionality e2e|
|5.3.2023|3| Fix App to use Update-route to avoid Safari rendering problems|
|6.3.2023|1| fix news useEffects to render news correctly without extra routes in Safari also|
|7.3.2023|1| refactor updateNews & createNews to use state updates instead of fech|
BREAK IN THIS PROJECT (SUBTL 152)
|24.10.2023|4| Fix broken code after break, update deps, clean code, fix Song request form|
|25.10.2023|2| Maintain code, upgrade LoginForm and Home & News components|
|26.10.2023|4| Fix S3 delete functionality to use correct rest requests: delete instead of post, add SongRequest rendering component|
|27.10.2023|6| migrate AWS-SDK v2=>v3 + fix S3 issues, routes and functionality e2e for songrequests + backend tests|
|29.10.2023|4| add mongo to docker-compose for dev|
|30.10.2023|2| upgrade tests, fix docker-compose-mongo|
|31.10.2023|2| upgrade all backend tests to use testing route , add test-db to docker-compose-mongo|
|1.11.2023|4| change application to fetch images from backend instead of front to avoid cors issues in docker dev environment|
|2.11.2023|8| figuring out how s3 localstack works, a lot of issues...|
|3.11.2023|4| configure docker-compose localstack to mock s3 in dev setup|
|5.11.2023|6| configure docker-compose localstack to mock s3 in test setup, refactor news tests|
|6.11.2023|3| configure Github Actions with localstack mock s3 in test setup|
|7.11.2023|1| Upgrade newsForm and updateNewsform components to change invisible after submit|
|7.11.2023|1| Make periodic check if login token is still valid, if not give notification and logout|
|7.11.2023|3| Add user creation & listing & deletion functionality e2e, change navbars & login/logout|
|8.11.2023|8| Add Jest unittest & configure local cypress e2e & make tests for login/logout|
|9.11.2023|7| Configure e2e Github actions CI and add front lint + test, make more cypress tests for users|
|10.11.2023|6| Cypress tests for posting, deleting and updating news, more cypress tests for users, add try catches to routes|
|11.11.2023|12| Add CD pipeline, configure Fly deploy and make preliminary automatic deploy on main push|
|12.11.2023|6| Configure a simple CD and branch protection, upgrade ymls to make Actions work properly, update documentation|
|12.11.2023|2| Tweak front News rendering|
|13.11.2023|5| Add Archives feature backend + tests|
|14.11.2023|7| Add Archives feature front|
|15.11.2023|2| Add tests Archives feature e2e|
|15.11.2023|4| Add Releases feature backend + tests|
|Total Hours|265|
