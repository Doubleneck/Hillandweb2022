import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setNews } from '../reducers/newsReducer'
import newsService from '../services/news'
import NewsForm from './NewsForm'
import NewsObject from './NewsObject'
import Notification from './Notification'


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
          <div className="text-center">
            <NewsForm />
          </div>
        </div>
      )}
      <p></p>
      <h1 className="text-center" >News:</h1>
      <p></p>
      <div className="text-center">
        <ul className="gallerynogrid mx-auto">
          {news.map((newsObject) => (
            <li key={newsObject.id} className="mx-auto">

              <NewsObject newsObject={newsObject} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default News
