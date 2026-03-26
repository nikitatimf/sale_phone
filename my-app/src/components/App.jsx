import { Router, Route, Link, Routes } from 'react-router-dom'
import Nav from './Nav'
import Feed from './Feed'
import Authorization from '../pages/Authorization'
import Registration from '../pages/registration'

const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Authorization />}/>
            <Route path='/registration' element={<Registration />}/>
            <Route path='*' element={<div>404</div>}/>
        </Routes>
        

        // <Nav />
        //     <hr className="nav_line"/>
        // <Feed />

        // <div>
        //     <nav>
        //         <Link to="/about">About us</Link>
        //     </nav>
        //     <Routes>
        //         <Route path='/about' element={<Registration />}></Route>        
        //     </Routes>
        // </div>
    )
}

export default App