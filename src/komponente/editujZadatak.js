import React from 'react';
import './Stil.css';
import axios from 'axios';
import Select from 'react-select';
import { withRouter, Redirect } from "react-router-dom";
import ReactTimeout from 'react-timeout';
var Latex = require('react-latex');

const ruta = "http://localhost:8080";
//const ruta = "https://aldincelikbackend.herokuapp.com";

class editujZadatak extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			postavka: "",
			hint: "",
			zagonetka: "",
			rjesenje: "",
			obavjestenje: {
				tip: 1,
				tekst: ""
			}
		}
		this.updatePostavka = this.updatePostavka.bind(this);
		this.updateHint = this.updateHint.bind(this);
		this.updateZagonetka = this.updateZagonetka.bind(this);
		this.updateRjesenje = this.updateRjesenje.bind(this);
		this.editujZadatak = this.editujZadatak.bind(this);
		this.ocistiObavijest = this.ocistiObavijest.bind(this);
		this.dohvatiZadatak();
	}

	componentWillMount()
	{
		let priv = localStorage.getItem("privilegija");
		if(priv < 2)
		{
			this.props.history.push('/zabrana');
		}
	}

	componentDidMount()
	{
		
	}

	updatePostavka = function(e) {
		this.setState({
			postavka : e.target.value
		});
	}

	updateRjesenje = function(e) {
		this.setState({
			rjesenje : e.target.value
		});
	}

	updateHint = function(e) {
		this.setState({
			hint : e.target.value
		});
	}

	updateZagonetka = function(e) {
		this.setState({
			zagonetka : e.target.value
		});
	}


	ocistiObavijest = function()
	{
		this.setState({
			obavjestenje: ""
		});
	}

	editujZadatak = function()
	{
		var self = this;
		var bodyData = {
			postavka : this.state.postavka,
			rjesenje : this.state.rjesenje,
			hint : this.state.hint,
			zagonetka : this.state.zagonetka,
			idZadatka : this.props.match.params.id
		};
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.post(ruta+'/editujZadatak', bodyData, headers).then(
			function(res2)
			{
				if(res2.status == 200)
				{
					/*self.setState({
						obavjestenje: {
							tip: 2,
							tekst: "Uspješno editovan zadatak"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
					*/
					localStorage.setItem("tipObavjestenja", 2);
					localStorage.setItem("tekstObavjestenja", "Uspješno editovan zadatak");
					self.props.history.push('/zadatak/'+self.props.match.params.id);
				}
			}
		).catch(
			function(err)
			{
				if(err.request.status == 401)
				{
					self.setState({
						obavjestenje: {
							tip: 3,
							tekst: "Nemate ovlaštenja za tu radnju"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
			}
		);
	}

	dohvatiZadatak = function()
	{
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.get(ruta+'/dohvatiZadatak/'+self.props.match.params.id, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.setState({
						postavka: res.data.postavka,
						hint: res.data.hint,
						zagonetka: res.data.zagonetka,
						rjesenje: res.data.rjesenje
					});
					
				}
			}
		).catch(
			function(err)
			{
				if(err.request.status == 401)
				{
					self.props.history.push('/zabrana');
				}
			}
		);
	}

	render()
	{

		var dodavanje =
		<button className = "editButton" onClick = {() => {this.editujZadatak()}}>Edituj zadatak</button>
	
		let obavijest;
		if(this.state.obavjestenje.tip == 1)
		{
			obavijest = 
			<div className="obavjestenje" style={{color: "darkblue"}}>
				{this.state.obavjestenje.tekst}
			</div>
		}
		else if(this.state.obavjestenje.tip == 2)
		{
			obavijest = 
			<div className="obavjestenje" style={{color: "darkgreen"}}>
				{this.state.obavjestenje.tekst}
			</div>
		}
		else if(this.state.obavjestenje.tip == 3)
		{
			obavijest = 
			<div className="obavjestenje" style={{color: "red"}}>
				{this.state.obavjestenje.tekst}
			</div>
		}

		return (
			<div className="glavniKontejner">
				<h2>Postavka zadatka</h2>
				<textarea id = "edit1" type="text" className="inputArea" onChange={this.updatePostavka} value={this.state.postavka}></textarea>
				<div className="previewArea">
					<Latex>{this.state.postavka}</Latex>
				</div>
				<h2>Rješenje</h2>
				<textarea type="text" className="inputArea" onChange={this.updateRjesenje} value={this.state.rjesenje}></textarea>
				<div className="previewArea">
					<Latex>{this.state.rjesenje}</Latex>
				</div>
				<h2>Hint</h2>
				<textarea type="text" className="inputArea" onChange={this.updateHint} value={this.state.hint}></textarea>
				<div className="previewArea">
					<Latex>{this.state.hint}</Latex>
				</div>
				<h2>Provjera rješenja</h2>
				<textarea type="text" className="inputArea" onChange={this.updateZagonetka} value={this.state.zagonetka}></textarea>
				<div className="previewArea">
					<Latex>{this.state.zagonetka}</Latex>
				</div><br/>
				{dodavanje}
				{obavijest}
				
			</div>
	    );
	}
}

export default ReactTimeout(editujZadatak);
