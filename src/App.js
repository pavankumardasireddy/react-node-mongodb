import React, { Component } from 'react';
import './App.css';
import HomePage from './containers/HomePage';
import SignupPage from './containers/SignupPage';
import LoginPage from './containers/LoginPage';
import UserDetailsPage from './containers/UserDetailsPage';

import {
  BrowserRouter as Router,
  Route,
  Switch
 } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/register" component={SignupPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/userdetails" component={UserDetailsPage} />
      </Switch>
    </Router>
    );
  }
}

export default App;
