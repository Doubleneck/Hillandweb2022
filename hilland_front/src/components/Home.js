import React from 'react'
import SongRequestForm from './SongRequestForm'
import fbLogo from '../fbLogo72.png'
import instaLogo from '../InstagramLogo.png'
import GoogleMap from './GoogleMap'


const Home= () => (

  <div className="gallery">
    <p></p>
    <h1 className="text-center" >Hilland Mondays - American Heritage </h1>
    <p></p>
    <img src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/FRONTPAGEIMG"
      className='img-fluid shadow-4' alt='musicians playing'/>
    <p></p>
    <h2 className="text-center">Live Country Music in Helsinki Every Monday Since 2014 </h2>
    <div className="text-center">
      <div style={{ display: 'inline-block' }}>
        <SongRequestForm />
      </div>
    </div>
    <p></p>
    <h2 className="text-center">Visit Hilland Mondays: </h2>
    <p>Every Monday our weekly country music club at Juttutupa,  Helsinki offers an
          international level two hour live music experience with a six piece top notch band: Hilland Playboys!  </p>
    <p></p>
    <img src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/PLAYBOYS.jpg"
      className='img-fluid shadow-4 ' alt= 'Hilland Playboys band'/>
    <p></p>
    <h2 className="text-center">Welcome to Juttutupa: </h2>
    <p></p>
    <GoogleMap />
    <p></p>

    <p></p>
    <div className="text-center">
      <a href={'https://www.facebook.com/hillandrecords/'}>
        <img style={{ width: 85, height: 85 }} src={fbLogo} alt="Facebook logo"/>
      </a>
      <p></p>
    </div>

    <p></p>
    <div className="text-center">
      <a href={'https://www.instagram.com/hillandrecords/'}>
        <img style={{ width: 85, height: 85 }} src={instaLogo} alt="Instagram logo"/>
      </a>
      <p></p>
    </div>
  </div>
)

export default Home

