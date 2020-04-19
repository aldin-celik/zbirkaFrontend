import React from 'react';
import './Stil.css';
import axios from 'axios';
import { withRouter } from "react-router-dom";

//const ruta = "http://localhost:8080";
const ruta = "http://aldincelikbackend.herokuapp.com";

class Registracija extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			username : "",
			password : "",
			password2 : "",
			email : "",
			greska : ""
		}
		this.handleRegistration = this.handleRegistration.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.updatePassword2 = this.updatePassword2.bind(this);
		this.updateEmail = this.updateEmail.bind(this);
	}

	handleRegistration = function(event)
	{
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(this.state.username.length < 4)
		{
			this.setState({
				greska : "Prekratko korisničko ime"
			});
		}
		else if(this.state.password.length < 8)
		{
			this.setState({
				greska : "Prekratka šifra"
			});
		}
		else if(this.state.password != this.state.password2)
		{
			this.setState({
				greska : "Šifre se ne podudaraju"
			});
		}
		else if(!re.test(this.state.email))
		{
			this.setState({
				greska : "Unesena adresa nije validna"
			});
		}
		else
		{
			this.setState({
				greska : ""
			});

			let user = this.state.username;
			let pass = this.state.password;
			let mail = this.state.email;
			var bodyData = {
				username: user,
				password: pass,
				email: mail
			};
			var headers = {
				headers: {
				"Content-Type": "application/json"
				}
			};
			let self = this;
			axios.post(ruta+'/register', bodyData, headers).then(
				function(res2)
				{
					if(res2.status == 200)
					{
						var bodyData = {
							username: user,
							password: pass
						};
						var headers = {
							headers: {
							"Content-Type": "application/json"		
							}
						};
						axios.post(ruta+'/login', bodyData, headers).then(
							function(res)
							{
								localStorage.setItem("logovan", 1);
								localStorage.setItem("token", res.data.auth);
								localStorage.setItem("privilegija", 1);
								self.props.history.push("/");
								window.location.reload();
							}
						).catch(
							function(err)
							{
								alert(err);
							}
						);
					}
				}
			).catch(
				function(err)
				{
					alert(err);
				}
			);


		}
	}

	updateUsername = function(e) {
		this.setState({
			username : e.target.value
		});
	}

	updatePassword = function(e) {
		this.setState({
			password : e.target.value
		});
	}

	updatePassword2 = function(e) {
		this.setState({
			password2 : e.target.value
		});
	}

	updateEmail = function(e) {
		this.setState({
			email : e.target.value
		});
	}

	render()
	{
		return (
			<div className="divRegistracija">
				<h1>Unesite vaše podatke</h1><br/>
				<label>Korisničko ime: </label><input type="text" name="username" required onChange={this.updateUsername}></input><br/><br/>
				<label>Šifra: </label><input type="password" name="password" required onChange={this.updatePassword}></input><br/><br/>
				<label>Ponovite šifru: </label><input type="password" name="password2" required onChange={this.updatePassword2}></input><br/><br/>
				<label>E-mail: </label><input type="text" name="email" required onChange={this.updateEmail}></input><br/><br/>
				<button onClick = {() => {this.handleRegistration()}}>Registracija</button><br/><br/>
				<label className = "tekstGreske">{this.state.greska}</label>
			</div>
	    );
	}
}


export default withRouter(Registracija);
