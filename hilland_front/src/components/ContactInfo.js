
import React from 'react'
import fbLogo from '../assets/fbLogo72.png'
import Button from 'react-bootstrap/esm/Button'
const ContactInfo = () => {
  // eslint-disable-next-line react/prop-types
  const CenteredContent = ({ children }) => (
    <div className="text-center">
      {children}
    </div>
  )

  const sendEmail = () => {
    const emailAddress = 'info@hillandrecords.com'
    const subject = 'Inquiry from Hilland Records Website'

    // Use window.location to open the default email client with pre-filled information
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`
  }

  return (
    <>
      <h1 className="text-center">Contact info</h1>
      <p></p>
      <CenteredContent>
        <strong>Send us email:</strong>
        <p></p>
        <p>info (at) hillandrecords.com</p>
        <p>
          <Button onClick={sendEmail}>Send Email</Button>
        </p>

        <strong>Or contact us via Facebook:</strong>
      </CenteredContent>
      <CenteredContent>
        <a href={'https://www.facebook.com/hillandrecords/'}>
          <img style={{ width: 85, height: 85 }} src={fbLogo} alt="Facebook logo" />
        </a>
        <p></p>
      </CenteredContent>
    </>
  )
}

export default ContactInfo