import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(){
        super();

        this.state={
            userDetails:{
                name:'',
                password:''
            },
            touched:{
                name:false,
                password:false
            },
           loggedInStatus:false
        }
        this.onChange=this.onChange.bind(this);
        this.onBlur=this.onBlur.bind(this);
        this.onSubmit=this.onSubmit.bind(this);
        this.validate=this.validate.bind(this);
    }
    
    onChange(e){
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const targetName = target.name;
        console.log(targetName + " " + value)

        const userDetails = Object.assign({}, this.state.userDetails);
        userDetails[targetName] = value;

        this.setState({
            userDetails
        })
    }

    onBlur(e){
        let touched = Object.assign({}, this.state.touched);
        touched[e.target.name] = true;
        this.setState({
            touched
        })
    }

    //loginform validation
    validate(){
        const errors = {};
        const {userDetails} = this.state;

        if(!userDetails.name){
            errors.name = 'Please enter Name';
        }
        if(!userDetails.password){
            errors.password = 'Please enter Password';
        }
        return{
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }
    
    //submitting loginform
    onSubmit(e){
        e.preventDefault();
        
        var formBody = [];

        for(var property in this.state.userDetails){
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(this.state.userDetails[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");
        console.log(formBody)

        //API Call

        fetch('/api/users/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
        .then(resp => resp.json())
           .then(user => {
               console.log(JSON.stringify(user));
               alert('Your login successfully completed.');
               this.setState({
                user: {
                    name: '',
                    password: '',

                },
                touched: {
                    name: false,
                    password: false
                },
                loginCompleted: true
            });
        })
        .catch((err) => {
            console.log(JSON.stringify(err));
            alert('Invalid Username or Password, Please try again');
        });
    }

    render() {
        if(this.state.loginCompleted){
            return(
              <Redirect to="/userdetails" />
            )
        }
        else{
            const {userDetails, touched} = this.state;
            const {errors, isValid} = this.validate(); 
        return (
            <div>
                <div className="row login">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                        <input type="text" name="name" value={this.state.userDetails.name} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Name" required/>
                        {touched.name && !!errors.name && <span>{errors.name}</span>}
                        </div>
                        <div className="form-group">
                        <input type="password" name="password" value={this.state.userDetails.password} onChange={this.onChange} onBlur={this.onBlur} className="form-control" placeholder="Password" required/>
                        {touched.password && !!errors.password && <span>{errors.password}</span>}                        </div>
                        <button type="submit" className="btn btn-info" disabled={!isValid}>Login</button>
                    </form>
                </div>{/*row*/}
            </div>
        );
      }
    }
}

export default Login;