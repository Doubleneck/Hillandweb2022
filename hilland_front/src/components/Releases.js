import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import releaseService from '../services/releases'
import ReleaseForm from './ReleaseForm'
import ReleaseObject from './ReleaseObject'
import UpdateReleaseForm from './UpdateReleaseForm'
import Notification from './Notification'

const Releases =  () => {
  const [releases, setReleases] = useState([])
  const [newReleaseobject, setNewReleaseobject] = useState(null)
  const [removedReleaseobject, setRemovedReleaseobject] = useState(null)
  const [updatedReleaseobject, setUpdatedReleaseobject] = useState(null)
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()
  // Group items by year
  const groupedItems = releases.reduce((acc, item) => {
    //eslint-disable-next-line
    const { year, title, content, buyLink, listenLink, imageURL, id } = item

    if (!acc[year]) {
      acc[year] = []
    }

    acc[year].push({ id ,year, title, content, buyLink, listenLink, imageURL })

    return acc
  }, {})

  // Step 2: Render the grouped items in reversed order
  const reversedYears = Object.keys(groupedItems).sort((a, b) => b - a)

  useEffect(() => {
    releaseService
      .getAll()
      .then((releases) =>
        setReleases(releases)
      )
  }, [dispatch])

  useEffect(() => {
    if(newReleaseobject){
      setReleases(releases.concat(newReleaseobject))
      setNewReleaseobject(null)
    }
  }, [newReleaseobject])


  useEffect(() => {
    if (removedReleaseobject) {
      setReleases((prevReleases) =>
        prevReleases.filter((release) => release.id !== removedReleaseobject.id)
      )
      setRemovedReleaseobject(null)
    }
  }, [removedReleaseobject])

  useEffect(() => {
    if (updatedReleaseobject) {
      setReleases((prevReleases) =>
        prevReleases.map((release) =>
          release.id !== updatedReleaseobject.id ? release : updatedReleaseobject
        )
      )
      setUpdatedReleaseobject(null)
    }
  })

  const handleReleaseAdded = (releaseObject) => {
    setNewReleaseobject(releaseObject)
  }

  const handleReleaseRemoved = (releaseObject) => {
    setRemovedReleaseobject(releaseObject)
  }

  const handleReleaseUpdated = (releaseObject) => {
    setUpdatedReleaseobject(releaseObject)
  }
  return (

    <div className="mx-auto text-center">
      {user === '' ? (
        <>
        </>
      ) : (
        <div>
          <Notification />

          <div className="text-center">
            {user.role === 'admin' &&
            <ReleaseForm onReleaseAdded={handleReleaseAdded}/>
            }
          </div>
        </div>
      )}
      <p></p>
      <p></p>
      <h2 className="text-center">Hilland Records Releases</h2>
      <p> </p>
      <div>
        {reversedYears.map((year) => (
          <div key={year}>
            <h3>{year}:</h3>
            <ul className="gallery">
              {groupedItems[year].map((item, index) => (
                <li key={index}>
                  <ReleaseObject releaseObject={item} onReleaseRemoved={handleReleaseRemoved}/>
                  <p></p>
                  {user.role === 'admin' && (
                    <UpdateReleaseForm
                      releaseObjectToBeUpdated={item} onReleaseUpdated={handleReleaseUpdated}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Releases