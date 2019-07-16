import React, { Component } from 'react';
import Header from '../components/Header';
import Signup from '../components/Signup';
import Footer from '../components/Footer';

class SignupPage extends Component {
    constructor() {
        super();
        this.state = {
            loginStatus: false
        };
        this.onRegistrationComplete = this.onRegistrationComplete.bind(this);
    }
    onRegistrationComplete(status) {
        this.setState({
            loginStatus: status
        });
    }
 
    render() {
        return (
            <div>
               <Header />
               <Signup onRegistrationComplete={this.onRegistrationComplete} />
               <Footer />
            </div>
          
        );
    }
}

export default SignupPage;