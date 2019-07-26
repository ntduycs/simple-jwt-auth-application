import axios from 'axios'
import jwtDecode from 'jwt-decode'

import { GET_ERRORS, SET_CURRENT_USER } from './action.types'

import setAuthToken from '../../setAuthToken'

export const register = (user, history) => dispatch => {
    axios.post('/api/users/register', user)
        .then(res => history.push('/login'))
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const login = (user) => dispatch => {
    axios.post('/api/users/login', user)
        .then(res => {
            const { token } = res.data
            localStorage.setItem('jwtToken', token)
            setAuthToken(token)
            const decoded = jwtDecode(token)
            dispatch({
                type: SET_CURRENT_USER,
                payload: decoded
            })
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const logout = (history) => dispatch => {
    localStorage.removeItem('jwtToken')
    setAuthToken(false)
    dispatch({
        type: SET_CURRENT_USER,
        payload: {}
    })
    history.push('/login')
}


