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

    <div className="mx-auto" >

      {user === '' ? (
        <>
        </>
      ) : (
        <div>
          <Notification />
          <div className="text-center">
            {user.role === 'admin' &&
            <NewsForm />
            }
          </div>
        </div>
      )}
      <p></p>
      <h1 className="mx-auto text-center" >News:</h1>
      <p></p>
      <div className="mx-auto text-center ">

        <ul className="gallery ">
          {news.map((newsObject) => (
            <li key={newsObject.id} >

              <NewsObject newsObject={newsObject} />
            </li>

          ))}

        </ul>
      </div>

    </div>
  )
}

export default News
