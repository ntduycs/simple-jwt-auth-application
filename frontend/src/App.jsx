import React from 'react';
import jwtDecode from 'jwt-decode'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './redux/store'

import setAuthToken from './setAuthToken'

import { logout } from './redux/actions/actions'

import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './components/NavBar'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'

import { SET_CURRENT_USER } from './redux/actions/action.types';

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken)
  const decoded = jwtDecode(localStorage.jwtToken)
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded
  })

  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    store.dispatch(logout())
    window.location.href = '/login'
  }
}

function App() {
  return (
    <Provider store={store} >
      <Router>
        <div>
          <NavBar />
          <Route exact path='/' component={Home} />
          <div className='container'>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
