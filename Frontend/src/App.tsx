import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Chats } from './pages/Chat'
import { NotFound } from './pages/PageNotFound'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/room/:id' element={<Chats/>}/>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
