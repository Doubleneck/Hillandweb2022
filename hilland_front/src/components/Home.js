import React from 'react'
import SongRequestForm from './SongRequestForm'
import fbLogo from '../assets/fbLogo72.png'
import instaLogo from '../assets/InstagramLogo.png'
import GoogleMap from './GoogleMap'

// eslint-disable-next-line react/prop-types
const CenteredContent = ({ children }) => (
  <div className="text-center">
    {children}
  </div>
)

const Home = () => (
  <div className="gallery">
    <p></p>
    <h1 className="text-center">Hilland Mondays - Live Country Music Every Monday</h1>
    <p></p>
    <CenteredContent>
      <img
        src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/FRONTPAGEIMG"
        className="img-fluid shadow-4 mx-auto"
        alt="musicians playing"
      />
    </CenteredContent>
    <p></p>
    <h2 className="text-center">Visit Hilland Mondays</h2>

    <p className="text-center">
      Every Monday our weekly country music club at Juttutupa, Helsinki offers an
      international level two-hour live music experience with a six-piece top-notch band: Hilland Playboys!
    </p>
    <p></p>
    <CenteredContent>
      <img
        src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/PLAYBOYS.jpg"
        className="img-fluid shadow-4 mx-auto"
        alt="Hilland Playboys band"
      />
    </CenteredContent>
    <p></p>
    <CenteredContent>
      <div data-cy= "songrequest-form" style={{ display: 'inline-block' }}>
        <SongRequestForm />
      </div>
    </CenteredContent>
    <p></p>
    <h2 className="text-center">Welcome to Juttutupa:</h2>
    <p></p>
    <GoogleMap />
    <p></p>
    <p></p>
    <CenteredContent>
      <a href={'https://www.facebook.com/hillandrecords/'}>
        <img style={{ width: 85, height: 85 }} src={fbLogo} alt="Facebook logo" />
      </a>
      <p></p>
    </CenteredContent>
    <p></p>
    <CenteredContent>
      <a href={'https://www.instagram.com/hillandrecords/'}>
        <img style={{ width: 85, height: 85 }} src={instaLogo} alt="Instagram logo" />
      </a>
      <p></p>
    </CenteredContent>
  </div>
)

export default Home



