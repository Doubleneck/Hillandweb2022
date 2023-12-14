import React from 'react'
import Button from 'react-bootstrap/Button'
const TruckerCaps = () => (
  <div >
    <p></p>
    <p></p>
    <h1 className='text-center' >Legendary Hilland Trucker Caps: </h1>
    <p></p>
    <p></p>
    <div className="text-center">
      <img src='https://hillandwebimgs.s3.eu-central-1.amazonaws.com/LIPPIKSET.jpg' alt='Hilland trucker caps'
        className='img-fluid shadow-4 mx-auto'/>
      <p></p>
    </div>

    <h3 className="text-center text-primary" >Available now at Hattu Helsinki Online Store!</h3>
    <div className="text-center">
      <a href={'https://hattuhelsinki.fi/products/hilland-records-trucker-cap?_pos=1&_psq=hilland&_ss=e&_v=1.0'}>
        <Button >Buy From Hattu Helsinki</Button>
      </a>
    </div>
    <p></p>
    <div className="text-center">
      <img src='https://hillandwebimgs.s3.eu-central-1.amazonaws.com/hattuhelsinki.jpg' alt='Hattu Helsinki shop'
        className='img-fluid shadow-4 mx-auto'/>
      <p></p>
    </div>
    <p></p>
  </div>
)

export default TruckerCaps