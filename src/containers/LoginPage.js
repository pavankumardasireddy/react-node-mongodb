import React, { Component } from 'react';
import Header from '../components/Header';
import Login from '../components/Login';
import Footer from '../components/Footer';

class HomePage extends Component {

    render() {
        return (
            <div>
               <Header />
               <Login />
               <Footer />
            </div>
          
        );
    }
}

export default HomePage;