import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
 
class UserDetails extends Component {
    constructor() {
        super()
        this.state = {
            userDetails: [],
            deleteId: "",
            users: {},
            currentPage: 1,
            userslistPerPage: 4,
            totalPages: 0,
            value: '',
            suggestions: []
        };
        this.deleteUser = this.deleteUser.bind(this)
        this.setDeleteId = this.setDeleteId.bind(this)
        this.onChange = this.onChange.bind(this)
        this.submitEdit = this.submitEdit.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.getSuggestionValue = this.getSuggestionValue.bind(this)
        this.renderSuggestion = this.renderSuggestion.bind(this)
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    }

    getSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.userDetails.filter(lang =>
            lang.name.toLowerCase().slice(0, inputLength) === inputValue 
            || lang.email.slice(0, inputLength) === value)
    };

    // input value for every given suggestion.
    getSuggestionValue = suggestion => suggestion.name || suggestion.email;

    // Use your imagination to render suggestions.
    renderSuggestion = suggestion => (
        <div>
            {suggestion.name || suggestion.email}
        </div>
    );

    onSuggestionChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
         if (newValue == '') {
            this.getUserDetails();
        }
    };

    onSuggestionSelected = (event, { suggestionValue }) => {
        var newValue = suggestionValue;
        
        var searchbar = this.state.userDetails.filter(users => users.name.indexOf(suggestionValue) !== -1) || this.state.userDetails.filter(users => users.email.indexOf(suggestionValue) !== -1);
        this.setState({
            userDetails: searchbar,
            currentPage: 1,
            totalPages: 1
        });
    };

    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    //next 
    increment = (event) => {
        if (this.state.currentPage < this.state.totalPages)
            this.setState({
                currentPage: this.state.currentPage + 1
            });
    }

    //previous
    decrement = (event) => {
        if (this.state.currentPage > 1)
            this.setState({
                currentPage: this.state.currentPage - 1,
            });
    }

    //inserting user details
    componentDidMount() {
        this.getUserDetails();
    }

    getUserDetails() {
        fetch('/api/users', {
            method: 'get'
        })
            .then((response) => response.json())
            .then((userDetails) => {
                console.log(JSON.stringify(userDetails))
                this.setState({
                    userDetails:userDetails,
                    totalPages:Math.ceil(userDetails.length / this.state.userslistPerPage)
                })
            })
    }

    //deleting user details
    deleteUser(userid) {
        fetch('/api/users' + '/' + userid, {
            method: 'delete'
        })
            .then((response) => response.json())
            .then((userDetails) => {
                console.log(JSON.stringify(userDetails))
                this.setState({
                    userDetails
                });
            });
    }

    //setting Id for deleting user
    setDeleteId(userid) {
        this.setState({ deleteId: userid });
    }

    //getting the user details in a form to edit using modal
    editOpen(userDetails) {
        this.setState({ users: userDetails }, () => {
            document.getElementById('inputName').value = this.state.users.name;
            document.getElementById('inputEmail').value = this.state.users.email;
            document.getElementById('inputPassword').value = this.state.users.password;
            document.getElementById('inputConfirmPassword').value = this.state.users.confirmPassword;
        })
    }

    onChange(e) {
        console.log('called')
        //e->form, target->field
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const targetName = target.name;
        console.log(targetName + ' ' + value);
        const users = Object.assign({}, this.state.users);
        users[targetName] = value;
        this.setState({
            users
        });
    }

    //submitting the editform
    submitEdit(e) {
        e.preventDefault();
        var formBody = [];
        for (var property in this.state.users) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(this.state.users[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }

        formBody = formBody.join('&');
        console.log(formBody);
        var apiUrl = "/api/users";
        var userId = this.state.users._id;
        fetch(apiUrl + '/' + userId, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        })
            .then(resp => resp.json())
            .then(users => {
                console.log(' Successfully.', users);
                this.setState(() => {
                    this.userDetails();
                });
            })
            .catch((err) => {
                console.log("error occured:", err);
            });
    }

    getvalue() {
        const select = parseInt(document.getElementById('selectvalue').value);
        this.setState({ userslistPerPage: select, currentPage: 1 }, () => {
            this.getUserDetails();
        });
    }

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search...',
            value,
            onChange: this.onSuggestionChange
        };

        const { userDetails, currentPage, userslistPerPage } = this.state;

        // Logic for displaying current pages
        const indexOfLastUser = currentPage * userslistPerPage;
        const indexOfFirstUser = indexOfLastUser - userslistPerPage;
        const currentUsers = userDetails.slice(indexOfFirstUser, indexOfLastUser);

        const renderUsers = currentUsers.map(userDetails => (
            <tr align="center">
                <td className="lightgrey">{userDetails.name}</td>
                <td className="lightblue">{userDetails.email}</td>
                <td className="lightgrey">{userDetails.password}</td>
                <td className="lightblue">{userDetails.confirmPassword}</td>
                <td className="lightgrey"><button onClick={this.editOpen.bind(this, userDetails)} type="button" className="btn1 btn-outline-secondary" data-toggle="modal" data-target="#updateModal" >
                    <i className="fa fa-pencil"></i></button></td>
                <td className="lightblue"><button onClick={() => { this.setState({ deleteId: userDetails._id }) }} type="button" className="btn2 btn-outline-primary" data-toggle="modal" data-target="#deleteModal">
                    <i className="fa fa-trash"></i></button></td>
            </tr>
        ));

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(userDetails.length / userslistPerPage); i++) {
            pageNumbers.push(i);
        }


        const renderPageNumbers = pageNumbers.map((number) => {
            return (
                <li
                    key={number} id={number} onClick={this.handleClick}>
                    {number}
                </li>
            );
        });
        
        return (
            <div>
                <div className="modal " id="deleteModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Are you sure?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Once deleted, you will not be able to recover this file!
                          </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">cancel</button>
                                <button type="button" className="btn btn-warning" onClick={this.deleteUser.bind(this, this.state.deleteId)}>ok</button>
                            </div>
                        </div>
                    </div>
                </div>{/*delete modal*/}

                <div className="modal " id="updateModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Update UserDetails</h5>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span style={{ ariaHidden: "true" }}>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group name">
                                        <label htmlFor="inputName">Name</label>
                                        <input name="name" value={this.state.users.name}
                                            onChange={this.onChange}
                                            type="text" className="form-control" id="inputName" aria-describedby="emailHelp" placeholder="Enter Name" />
                                    </div>
                                    <div className="form-group email">
                                        <label htmlFor="inputEmail">Email</label>
                                        <input name="email" value={this.state.users.email} onChange={this.onChange} type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter Email" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputPassword">Password</label>
                                        <input name="password" value={this.state.users.password} onChange={this.onChange} type="text" className="form-control" id="inputPassword" aria-describedby="emailHelp" placeholder="Enter Password" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputConfirmPassword">Confirm Password</label>
                                        <input name="confirmPassword" value={this.state.users.confirmPassword} onChange={this.onChange} type="text" className="form-control" id="inputConfirmPassword" aria-describedby="emailHelp" placeholder="Enter Confirm Password" />
                                    </div>
                                    <button type="submit" className="btn btn-secondary" onClick={this.submitEdit.bind(this)}>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>{/*editform modal*/}

                <div>
                    <div className="ml-3">
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                            onSuggestionSelected={this.onSuggestionSelected}
                        />
                    </div>

                    <div className="row mx-auto">
                        <table className="table userslist" align="center">
                            <thead className="thead1">
                                <tr align="center">
                                    <th scope="col" className='black'>Name</th>
                                    <th scope="col" className='blue'>Email</th>
                                    <th scope="col" className='black'>Password</th>
                                    <th scope="col" className='blue'>Confirm</th>
                                    <th scope="col" className='black'>Edit</th>
                                    <th scope="col" className='blue'>Delete</th>
                                </tr>
                            </thead>
                            <tbody>{renderUsers}</tbody>
                        </table>
                    </div>{/*table*/}

                    <ul id="page-numbers">
                        <select id="selectvalue" onChange={this.getvalue.bind(this)}>
                            <option>4</option>
                            <option>8</option>
                            <option>12</option>
                        </select>
                        <li onClick={this.decrement} className="page-link1">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </li>
                        {renderPageNumbers}
                        <li onClick={this.increment} className="page-link2">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </li>
                    </ul>
                </div>{/*row*/}
            </div>
        );
    }
}

export default UserDetails;