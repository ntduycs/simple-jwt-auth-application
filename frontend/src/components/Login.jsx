import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { login } from '../redux/actions/actions'

import classnames from 'classnames'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',

      errors: {}
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.login(user)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/')
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/')
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="container" style={{ marginTop: '50px', width: '700px' }}>
        <h2 style={{ marginBottom: '40px' }}>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className={classnames('form-control form-control-lg', { 'is-invalid': errors.email })}
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className={classnames('form-control form-control-lg', { 'is-invalid': errors.password })}
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({ errors: state.errors, auth: state.auth })

export default connect(mapStateToProps, { login })(Login)
