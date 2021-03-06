import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import {Menu } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { EditNote } from './components/EditNote'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
      <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
      </Router>
      </div>
    )
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <div>
        <Router history={this.props.history}>
            <Switch>
                <Route
                  path="/"
                  exact
                  render={props => {
                    return <Todos {...props} auth={this.props.auth} />
                  }}
                />

                <Route
                  path="/todos/:todoId/edit"
                  exact
                  render={props => {
                    return <EditTodo {...props} auth={this.props.auth} />
                  }}
                />

                <Route
                  path="/todos/:todoId/editnote"
                  exact
                  render={props => {
                    return <EditNote {...props} auth={this.props.auth} />
                  }}
                />
                
                <Route component={NotFound} />
          </Switch>
        </Router>
  </div>
    )
  }

  generateMenu() {
    return (
      <Menu secondary>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item position='right' name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

}
