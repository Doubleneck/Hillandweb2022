const listHelper = require('../utils/news_helper')

test('empty news list returns zero', () => {
  const news = []
  const result = listHelper.dummy(news)
  expect(result).toBe(0)
})

test('news list with one news returns one', () => {
  const listWithOneNews = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'News title',
      content: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      image: '',
      __v: 0
    }
  ]
  const result = listHelper.dummy(listWithOneNews)
  expect(result).toBe(1)
})