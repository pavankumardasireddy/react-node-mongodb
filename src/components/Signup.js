import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            userDetails: {
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            touched: {
                name: false,
                email: false,
                password: false,
                confirmPassword: false,
            },
            registrationCompleted: false
        };
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    onChange(e) {
        //e->form, target->field
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const targetName = target.name;
        console.log(targetName + ' ' + value);
        const userDetails = Object.assign({}, this.state.userDetails);
        userDetails[targetName] = value;
        this.setState({
            userDetails
        });
    }

    onBlur(e) {
        let touched = Object.assign({}, this.state.touched);
        touched[e.target.name] = true;
        this.setState({
            touched
        });
    }

    //form validation
    validate() {
        const errors = {};
        const { userDetails } = this.state;
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const passwrd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

        if (!userDetails.name) {
            errors.name = ' Please enter Name';
        }
        if (userDetails.email) {
            if (!emailRegex.test(userDetails.email)) {
                errors.email = ' Please enter valid Email';
            }
        }
        else {
            errors.email = ' Please enter Email';
        }
        if (userDetails.password) {
            if (!passwrd.test(userDetails.password)) {
                errors.password = 'Minimum 8 characters, at least one number';
            }
        }
        else {
            errors.password = 'Please enter Password';
        }
        if (userDetails.confirmPassword) {
            if (userDetails.confirmPassword !== userDetails.password) {
                errors.confirmPassword = 'Password does not match'
            }
        }
        else {
            errors.confirmPassword = 'Please enter Confirm Password';
        }
        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }

    //submitting the form
    onSubmit(e) {
        e.preventDefault();
        var formBody = [];
        for (var property in this.state.userDetails) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(this.state.userDetails[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }

        formBody = formBody.join('&');
        console.log(formBody);
        fetch('/api/users/register', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
            .then(resp => resp.json())
            .then(userDetails => {
             this.props.onRegistrationComplete(true);
                this.setState({
                    userDetails: {
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: ''
                    },
                    touched: {
                        name: false,
                        email: false,
                        password: false,
                        confirmPassword: false
                    },
                    registrationCompleted: true
                });
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
                this.props.onRegistrationComplete(false);
            });
    }

    render() {
        if (this.state.registrationCompleted) {
            return (
                <div>
                    <p>Thank you for registering.</p>
                    {/* Go to Home Page<Link to="/">Click Here</Link> */}
                </div>
            );
        }
        else {
            const { userDetails, touched } = this.state;
            const { errors, isValid } = this.validate();
            return (
                <div>
                    <div className="container">
                        <p className="heading text-center">Registration Form</p>
                        <div className="row regform">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input type="text" name="name" value={this.state.userDetails.name} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Name" required />
                                    {touched.name && !!errors.name && <span>{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <input type="text" name="email" value={this.state.userDetails.email} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Email" required />
                                    {touched.email && !!errors.email && <span>{errors.email}</span>}
                                </div>
                                <div className="form-group">
                                    <input type="password" name="password" value={this.state.userDetails.password} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Password" required />
                                    {touched.password && !!errors.password && <span>{errors.password}</span>}
                                </div>
                                <div className="form-group">
                                    <input type="password" name="confirmPassword" value={this.state.userDetails.confirmPassword} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Confirm Password" required />
                                    {touched.confirmPassword && !!errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                                </div>
                                <button type="submit" className="btn btn-info" disabled={!isValid}>Submit</button>
                            </form>
                        </div>{/*row*/}
                    </div>{/*container*/}
                </div>
            );
        }
    }
}

export default Signup;