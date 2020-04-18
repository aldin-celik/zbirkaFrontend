import React from 'react';
import {Link} from 'react-router-dom';
import './Stil.css';
import axios from 'axios';

const ruta = "http://localhost:8080";

class Nav extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			loginSpusten: false,
			username: "",
			password: "",
			logovan: 0
		}
		this.toggleLogin = this.toggleLogin.bind(this);
		this.loginClick = this.loginClick.bind(this);
		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
	}

	toggleLogin = function() {
		if(this.state.loginSpusten)
		{
			this.setState({
				loginSpusten : false
			});
		}
		else
		{
			this.setState({
				loginSpusten : true
			});
		}
		this.forceUpdate();
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

	loginClick = function() {
		if(localStorage.getItem('logovan') != 0)
		{
			localStorage.setItem('logovan',0);
			localStorage.setItem('token', ".");
			localStorage.setItem('privilegija', 0);
			this.setState({logovan: 1});
			window.location.reload();
		}
		else
		{
			let user = this.state.username;
			let pass = this.state.password;
			var bodyData = {
				username: user,
				password: pass
			};
			var headers = {
				"Content-Type": "application/json"
			};
			var self = this;
			this.toggleLogin();
			axios.post(ruta+'/login', bodyData, headers).then(
				function(res)
				{
					localStorage.setItem("logovan", 1);
					localStorage.setItem("token", res.data.auth);
					localStorage.setItem("privilegija", res.data.privilegija);
					self.setState({logovan: 0});
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

	render()
	{
		let loginD;
		let loginF;
		if(!this.state.loginSpusten)
		{
			loginF = <></>;
		}
		else
		{
			loginF = <div className = "unosLogina">
				<form>
				username: <input type="text" name="username" value={this.state.username} onChange={this.updateUsername}></input><br/>
				password: <input type="password" name="password" value={this.state.password} onChange={this.updatePassword}></input><br/>
				<button onClick = {() => {this.loginClick()}}>Login</button>
				<button onClick = {() => {this.toggleLogin()}}>Zatvori</button>
				</form>
			</div>;
		}

		let logovanUser = localStorage.getItem('logovan');

		if(logovanUser == 0)
		{
			loginD = <><Link onClick = {() => {this.toggleLogin()}}>Login</Link> ili <Link to='/registracija'>Registracija</Link></>
		}
		else
		{
			loginD = <><Link onClick = {() => {this.loginClick()}}>Logout</Link></>
		}


		var privilegija = localStorage.getItem("privilegija");
		var dodajZ;
		if(privilegija > 1)
		{
			dodajZ = <Link className = "navigacijaLink" to='/dodajZadatak'>Dodaj zadatak</Link>
		}

	  return (
		  <div>
		<nav className = "navigacija">
			<div stlye="width:100%">
			<ul>
				<Link className = "navigacijaLink" to='/'>Pregled zadataka</Link>
				<Link className = "navigacijaLink" to='/zapamceni'>Zapamćeni zadaci</Link>
				{dodajZ}
			</ul>
			<div className = "loginDiv">
				 {loginD}
			</div>
		   </div>
		</nav>
		{loginF}
		</div>
	  );
	}
}



export default Nav;
