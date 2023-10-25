import React, { useState, useEffect } from 'react'
import '../App.css'
import songrequestService from '../services/songrequests'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import Notification from './Notification'

function Songrequests() {
  const dispatch = useDispatch()
  const [songrequests, setSongrequests] = useState([])
  const [sortType, setSortType] = useState('dateNewerFirst') // Default sorting by date (newer first)
  const [sortedSongrequests, setSortedSongrequests] = useState([])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  useEffect(() => {
    songrequestService.getAll().then((sr) => {
      setSongrequests(sr)
      sortSongrequests(songrequests, sortType)
    })
  }, [sortType, songrequests])

  const sortSongrequests = (requests, type) => {
    let sorted = [...requests]
    if (type === 'alphabetical') {
      sorted.sort((a, b) => a.song.localeCompare(b.song))
    } else if (type === 'dateNewerFirst') {
      sorted.sort((a, b) => b.date.localeCompare(a.date))
    } else if (type === 'dateOlderFirst') {
      sorted.sort((a, b) => a.date.localeCompare(b.date))
    }
    setSortedSongrequests(sorted)
  }

  const handleDelete = (id) => {
    songrequestService
      .remove(id)
      .then(() => {
        // Filter out the deleted song request and update the state
        setSongrequests((prevSongrequests) =>
          prevSongrequests.filter((songrequest) => songrequest.id !== id)
        )
        dispatch(
          setNotification(
            'Removed successfully ', 5, 'update'
          )
        )
      })
      .catch((error) => {
        console.log(error)
        dispatch(
          setNotification(
            'Something went wrong while trying to remove the song request', 5, 'error'
          )
        )
      })
  }

  return (
    <div>
      <Notification />
      <h1>Song requests:</h1>
      <div>
        <label>Sort by:</label>
        <input
          type="radio"
          name="sortType"
          value="dateNewerFirst"
          checked={sortType === 'dateNewerFirst'}
          onChange={() => setSortType('dateNewerFirst')}
        /> Newer First
        <input
          type="radio"
          name="sortType"
          value="dateOlderFirst"
          checked={sortType === 'dateOlderFirst'}
          onChange={() => setSortType('dateOlderFirst')}
        /> Older First
        <input
          type="radio"
          name="sortType"
          value="alphabetical"
          checked={sortType === 'alphabetical'}
          onChange={() => setSortType('alphabetical')}
        /> Alphabetical
      </div>
      <br />
      <ul>
        {sortedSongrequests.map((songrequest) => (
          <li key={songrequest.id}>
            <p>
              <strong>{songrequest.song}</strong> requested{' '}
              {formatDate(songrequest.date)} (song from artist:{' '}
              {songrequest.artist})
              <button
                onClick={() => handleDelete(songrequest.id)}
                className="delete-button"
              >
                Delete
              </button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Songrequests




