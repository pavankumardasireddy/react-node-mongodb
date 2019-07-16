import React, { Component } from 'react';

class Header extends Component {

    render() {
        return (
            <div>               
                <nav className="navbar navbar-expand-lg">
                    <a href="/"><img id="logo" src="./images/logo.png" alt="logoimg" /></a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ml-auto">
                            <ul>
                                <li><a href="/register">Signup</a></li>
                                <li><a href="/login">Login</a></li>
                            </ul>
                        </div>{/*navbar-nav*/}
                    </div>{/*navbar-collapse*/}
                </nav>{/*navbar*/}
            </div>
        );
    }
}

export default Header;