import React, { Component } from 'react';
import Header from '../components/Header';
import UserDetails from '../components/UserDetails';
import Footer from '../components/Footer';

class UserDetailsPage extends Component {

    render() {
        return (
            <div>
               <Header />
               <UserDetails />
               <Footer />
            </div>
          
        );
    }
}

export default UserDetailsPage;