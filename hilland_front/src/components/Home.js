import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import SongRequestForm from './SongRequestForm'
import fbLogo from '../fbLogo72.png'
import instaLogo from '../InstagramLogo.png'
import GoogleMap from './GoogleMap';
const popover = (
  <Popover id="popover-basic">
    <Popover.Header as="h3" className="text-center text-danger" >Song Request</Popover.Header>
    <Popover.Body>
    <div> 
        <SongRequestForm />
    </div>
    </Popover.Body>
  </Popover>
);

const SongRequest = () => (
  <OverlayTrigger trigger="click" placement="top" overlay={popover}>
    <Button variant="danger">Song request</Button>
  </OverlayTrigger>
)

const Home= () => (
    
    <div className="gallery"> 
        <p></p>
        <h1 className="text-center" >Hilland Mondays - American Heritage </h1>
        <p></p>
        <img src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/FRONTPAGEIMG"
        className='img-fluid shadow-4' alt='musicians playing'/>
        <p></p>
        <h2 className="text-center">Live Country Music in Helsinki Every Monday Since 2014 </h2>
        <h3 className="text-center text-danger" > Send us a song request, maybe we´ll play it next Monday!</h3>
        <p></p>
        <p className="text-center" > <SongRequest/></p>
        <p></p>
        <h2 className="text-center">Visit Hilland Mondays: </h2>
        <p>Every Monday our weekly country music club at Juttutupa,  Helsinki offers an 
          international level two hour live music experience with a six piece top notch band: Hilland Playboys!  </p>
        <p></p>
        <img src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/PLAYBOYS.jpg"
        className='img-fluid shadow-4' alt= 'Hilland Playboys band'/>
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

