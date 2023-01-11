const NewsObject = ({ newsObject, removeNewsObject, updateNews }) => {
  return (
    <ul>
      <li>
        <h3>{newsObject.title}</h3>
      </li>
      <li>
        {' '}
        <img src={newsObject.imageURL} />{' '}
      </li>
      <li>{newsObject.content}</li>
      <li>URL:{newsObject.url}</li>
      <button value={newsObject.id} onClick={removeNewsObject}>
        delete
      </button>
    </ul>
  )
}
export default NewsObject
