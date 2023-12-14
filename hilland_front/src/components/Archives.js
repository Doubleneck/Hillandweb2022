import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import archiveService from '../services/archives'
import ArchiveForm from './ArchiveForm'
import ArchiveObject from './ArchiveObject'
import UpdateArchiveForm from './UpdateArchiveForm'
import Notification from './Notification'

const Archives =  () => {
  const [archives, setArchives] = useState([])
  const [newArchiveobject, setNewArchiveobject] = useState(null)
  const [removedArchiveobject, setRemovedArchiveobject] = useState(null)
  const [updatedArchiveobject, setUpdatedArchiveobject] = useState(null)
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()
  // Group items by year
  const groupedItems = archives.reduce((acc, item) => {
    //eslint-disable-next-line
    const { year, title, content, imageURL, id } = item

    if (!acc[year]) {
      acc[year] = []
    }

    acc[year].push({ id ,year, title, content, imageURL })

    return acc
  }, {})

  // Step 2: Render the grouped items in reversed order
  const reversedYears = Object.keys(groupedItems).sort((a, b) => b - a)

  useEffect(() => {
    archiveService
      .getAll()
      .then((archives) =>
        setArchives(archives)
      )
  }, [dispatch])

  useEffect(() => {
    if(newArchiveobject){
      setArchives(archives.concat(newArchiveobject))
      setNewArchiveobject(null)
    }
  }, [newArchiveobject])


  useEffect(() => {
    if (removedArchiveobject) {
      setArchives((prevArchives) =>
        prevArchives.filter((archive) => archive.id !== removedArchiveobject.id)
      )
      setRemovedArchiveobject(null)
    }
  }, [removedArchiveobject])

  useEffect(() => {
    if (updatedArchiveobject) {
      setArchives((prevArchives) =>
        prevArchives.map((archive) =>
          archive.id !== updatedArchiveobject.id ? archive : updatedArchiveobject
        )
      )
      setUpdatedArchiveobject(null)
    }
  })

  const handleArchiveAdded = (archiveObject) => {
    setNewArchiveobject(archiveObject)
  }

  const handleArchiveRemoved = (archiveObject) => {
    setRemovedArchiveobject(archiveObject)
  }

  const handleArchiveUpdated = (archiveObject) => {
    setUpdatedArchiveobject(archiveObject)
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
            <ArchiveForm onArchiveAdded={handleArchiveAdded}/>
            }
          </div>
        </div>
      )}
      <p></p>
      <p></p>
      <h2 className="text-center">Hilland Mondays Archive</h2>
      <p> </p>
      <div>
        {reversedYears.map((year) => (
          <div key={year}>
            <h3>Memories from {year}:</h3>
            <ul className="gallery">
              {groupedItems[year].map((item, index) => (
                <li key={index}>
                  <ArchiveObject archiveObject={item} onArchiveRemoved={handleArchiveRemoved}/>
                  <p></p>
                  {user.role === 'admin' && (
                    <UpdateArchiveForm
                      archiveObjectToBeUpdated={item} onArchiveUpdated={handleArchiveUpdated}
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

export default Archives