import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import SongRequestForm from './SongRequestForm';
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
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="danger">Send a Hilland Mondays song request!!</Button>
  </OverlayTrigger>
);




const Home= () => (
    <div> 
        <p></p>
        <h1 className="text-center" >Hilland Mondays - American Heritage </h1>
        <p></p>
        <img src="https://hillandwebimgs.s3.eu-central-1.amazonaws.com/FRONTPAGEIMG"
        className='img-fluid shadow-4'/>
        <p></p>
        <h2>Live Country Music in Helsinki Every Monday Since 2014 </h2>
        <SongRequest />
    </div>

)

export default Home

