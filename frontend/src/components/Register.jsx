import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { register } from '../redux/actions/actions'

class Register extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',

      errors: {}
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    }

    this.props.register(user, this.props.history)
  }

  componentWillReceiveProps(nextProps) {
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
        <h2 style={{ marginBottom: '40px' }}>Registration</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              className={classnames('form-control form-control-lg', { 'is-invalid': errors.name })}
              name="name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className={classnames('form-control fomr-control-lg', { 'is-invalid': errors.email })}
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
              className={classnames('form-control fomr-control-lg', { 'is-invalid': errors.password })}
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              className={classnames('form-control fomr-control-lg', { 'is-invalid': errors.passwordConfirm })}
              name="passwordConfirm"
              onChange={this.handleChange}
              value={this.state.passwordConfirm}
            />
            {errors.passwordConfirm && (<div className="invalid-feedback">{errors.passwordConfirm}</div>)}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    )
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({ errors: state.errors, auth: state.auth })

export default connect(mapStateToProps, { register })(withRouter(Register))