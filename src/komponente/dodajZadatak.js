import React from 'react';
import './Stil.css';
import axios from 'axios';
import Select from 'react-select';
import { withRouter } from "react-router-dom";
import ReactTimeout from 'react-timeout';
var Latex = require('react-latex');

const ruta = "http://localhost:8080";

class dodajZadatak extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			postavka: "",
			hint: "",
			zagonetka: "",
			rjesenje: "",
			selectedKategorija : {id:0, naziv:""},
			selectedPodkategorija: {id:0, naziv:""},
			kategorije: 
			[
				
			],
			obavjestenje: {
				tip: 1,
				tekst: ""
			}
		}
		this.updatePostavka = this.updatePostavka.bind(this);
		this.updateHint = this.updateHint.bind(this);
		this.updateZagonetka = this.updateZagonetka.bind(this);
		this.updateRjesenje = this.updateRjesenje.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSelect2 = this.handleSelect2.bind(this);
		this.pretraziKategoriju = this.pretraziKategoriju.bind(this);
		this.dodavanjeZadatka = this.dodavanjeZadatka.bind(this);
		this.ocistiObavijest = this.ocistiObavijest.bind(this);
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
		this.pretraziKategoriju();
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

	handleSelect = function(selected)
	{	
		this.setState({
			selectedKategorija : selected
		});
	}

	handleSelect2 = function(selected)
	{	
		this.setState({
			selectedPodkategorija : selected
		});
	}

	pretraziKategoriju = function() {
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.get(ruta+'/dajKategorije', headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.setState({
						kategorije: res.data
					});
				}
			}
		).catch(
			function(err)
			{
				if(err.request.status == 401)
				{
					//self.props.history.push('/zabrana');
				}
			}
		);
	}

	dodavanjeZadatka = function()
	{
		let tKategorija = this.state.selectedKategorija;
		let tPodkategorija = this.state.selectedPodkategorija;
		if(tKategorija.id == 0)
		{
			this.setState({
				obavjestenje: {
					tip: 3,
					tekst: "Niste odabrali kategoriju"
				}
			});
			this.props.setTimeout(this.ocistiObavijest, 3000)
			return;
		}
		let selected;
		if(tPodkategorija.id == 0) selected = tKategorija.id;
		else selected = tPodkategorija.id;
		var self = this;
		var bodyData = {
			postavka : this.state.postavka,
			rjesenje : this.state.rjesenje,
			hint : this.state.hint,
			zagonetka : this.state.zagonetka,
			kategorija : selected
		};
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.post(ruta+'/dodajZadatak', bodyData, headers).then(
			function(res2)
			{
				if(res2.status == 200)
				{
					var ruta = "/zadatak/"+res2.data.rez;
					self.props.history.push(ruta);
				}
			}
		).catch(
			function(err)
			{
				if(err.request.status == 401)
				{
					this.setState({
						obavjestenje: {
							tip: 3,
							tekst: "Nemate ovlaštenja za tu radnju"
						}
					});
					this.props.setTimeout(this.ocistiObavijest, 3000);
				}
			}
		);

	}

	ocistiObavijest = function()
	{
		this.setState({
			obavjestenje: ""
		});
	}

	render()
	{

		var dodavanje = 
		<div className="filtracija">
			Kategorija: <br/><Select
					className = "spasavanje" 
					value={this.selectedKategorija}
					onChange={this.handleSelect}
					options = {this.state.kategorije}
					getOptionLabel = {option => option.naziv}
				/>
				<Select
					className = "spasavanje" 
					value={this.selectedPodkategorija}
					onChange={this.handleSelect2}
					options = {this.state.selectedKategorija.podkategorije}
					getOptionLabel = {option => option.naziv}
				/>
				<br/>
				<button className = "spasavanjeButton" onClick = {() => {this.dodavanjeZadatka()}}>Dodaj zadatak</button>

		</div>

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
				<textarea type="text" className="inputArea" onChange={this.updatePostavka}></textarea>
				<div className="previewArea">
					<Latex>{this.state.postavka}</Latex>
				</div>
				<h2>Rješenje</h2>
				<textarea type="text" className="inputArea" onChange={this.updateRjesenje}></textarea>
				<div className="previewArea">
					<Latex>{this.state.rjesenje}</Latex>
				</div>
				<h2>Hint</h2>
				<textarea type="text" className="inputArea" onChange={this.updateHint}></textarea>
				<div className="previewArea">
					<Latex>{this.state.hint}</Latex>
				</div>
				<h2>Provjera rješenja</h2>
				<textarea type="text" className="inputArea" onChange={this.updateZagonetka}></textarea>
				<div className="previewArea">
					<Latex>{this.state.zagonetka}</Latex>
				</div>
				{dodavanje}
				{obavijest}
				
			</div>
	    );
	}
}

export default ReactTimeout(dodajZadatak);
