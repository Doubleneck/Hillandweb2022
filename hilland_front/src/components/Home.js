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
    <h2 className="text-center m-4">Hilland Mondays - Live Country Music Every Monday in Helsinki</h2>
    <CenteredContent>
      <img
        src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/FRONTPAGEIMG"
        className="img-fluid shadow-4 mx-auto custom-img"
        alt="musicians playing"
      />
    </CenteredContent>
    <h2 className="text-center m-4">Visit Hilland Mondays</h2>
    <p className="text-center m-4">
      Every Monday from 2014 our weekly country music club at Juttutupa, Helsinki offers a
      two-hour live music experience with a six-piece top-notch band: Hilland Playboys!
    </p>
    <CenteredContent>
      <img
        src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/PLAYBOYS.jpg"
        className="img-fluid shadow-4 mx-auto custom-img"
        alt="Hilland Playboys band"
      />
    </CenteredContent>
    <div className="text-center m-4 ">

      <iframe className="gallery" src='https://www.youtube.com/embed/s0uiwJ-5Jj0'
        frameBorder='0'
        allow='autoplay; encrypted-media'
        width="100%"
        height="360"
        allowFullScreen
        title='video'
      />
    </div>
    <h2 className="text-center m-4">Welcome to Juttutupa:</h2>
    <GoogleMap />
    <CenteredContent>
      <div className="text-center m-4" data-cy= "songrequest-form" style={{ display: 'inline-block' }}>
        <SongRequestForm />
      </div>
    </CenteredContent>
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



