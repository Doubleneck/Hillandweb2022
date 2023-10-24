import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import newsService from '../services/news'
import NewsForm from './NewsForm'
import NewsObject from './NewsObject'
import Togglable from './Togglable'
import Notification from './Notification'
import { setNews } from '../reducers/newsReducer'

const News =  () => {
  const news= useSelector((state) => state.news)
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()


  useEffect(() => {
    if(news){
      dispatch(setNews(news))
    }
  }, [news])

  useEffect(() => {
    newsService
      .getAll()
      .then((news) =>
        dispatch(setNews(news.sort((a, b) => b.date.localeCompare(a.date))))
      )
  }, [dispatch])

  return (

    <div>
      {user === '' ? (
        <>
        </>
      ) : (
        <div>
          <Notification />
          <Togglable className="text-center" buttonLabel='Add News'>
            <NewsForm />
          </Togglable>
        </div>
      )}
      <p></p>
      <h1 className="text-center" >News:</h1>
      <p></p>
      <ul className="gallerynogrid mx-auto" >
        {news.map((newsObject) => (
          <li key={newsObject.id} className="mx-auto">
            <NewsObject newsObject={newsObject }/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default News
