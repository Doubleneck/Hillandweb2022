
const App = (props) => {
  const { news } = props
  return(
  <div>
    <h1>Hilland Demo</h1>
    <h2>News</h2>
    <ul>
        <li>{news[0].content}</li>
        <li>{news[1].content}</li>
        <li>{news[2].content}</li>
      </ul>
    
  </div>
  )
}

export default App