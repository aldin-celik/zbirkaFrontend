import React from 'react';
import Select from 'react-select';
import {Redirect, Link} from 'react-router-dom';
import axios from 'axios';
import './Stil.css';
import ReactTimeout from 'react-timeout';

var Latex = require('react-latex');

const ruta = process.env.BACKEND_URL;

class ZapamceniZadaci extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = {
			unesenaGrupa: "",
			odabranaGrupa: {},
			odabranaGrupa2: {},
			listaZadataka: [],
			grupe: [],
			grupe2 : [],
			stranica: 1,
			maxStranica: 1,
			listaZadataka: [],
			obavjestenje: {
				tip: 1,
				tekst: ""
			}
		};
		this.handleUnos = this.handleUnos.bind(this);
		this.dodajGrupu = this.dodajGrupu.bind(this);
		this.obrisiGrupu = this.obrisiGrupu.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.otidjiNa = this.otidjiNa.bind(this);
		this.handleSelect2 = this.handleSelect2.bind(this);
		this.dohvatiZadatke = this.dohvatiZadatke.bind(this);
		this.napraviNavigaciju = this.napraviNavigaciju.bind(this);
		this.dajGrupe = this.dajGrupe.bind(this);
		this.novaPretraga = this.novaPretraga.bind(this);
		this.ocistiObavijest = this.ocistiObavijest.bind(this);
	}

	componentDidMount()
	{
		this.dajGrupe();
		
	}

	componentWillMount()
	{
		let priv = localStorage.getItem("privilegija");
		if(priv < 1)
		{
			this.props.history.push('/zabrana');
		}
	}

	ocistiObavijest = function()
	{
		this.setState({
			obavjestenje: ""
		});
	}

	handleUnos = function(e)
	{
		this.setState({
			unesenaGrupa : e.target.value
		});
	}

	handleSelect = function(e)
	{	
		this.setState({
			odabranaGrupa: e
		});
	}

	handleSelect2 = function(e)
	{	
		this.setState({
			odabranaGrupa2: e
		});
	}

	dajGrupe = function()
	{
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.get(ruta+'/dajGrupe', headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.setState({
						grupe: res.data,
						grupe2: res.data
					});
				}
			}
		).catch(
			function(err)
			{
				if(err.response.status == 401)
				{
					//self.props.history.push('/zabrana');
				}
				if(err.response.status == 500)
				{
					self.setState({
						obavjestenje: {
							tip: 3,
							tekst: "Greška na serveru"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
			}
		);
	}

	dodajGrupu = function()
	{
		let self = this;
		var u = this.state.unesenaGrupa;
		if(u == "")
		{
			self.setState({
				obavjestenje: {
					tip: 3,
					tekst: "Morate unijeti naziv grupe"
				}
			});
			self.props.setTimeout(self.ocistiObavijest, 3000);
			return;
		}
		var bodyData = {
			naziv: u
		};
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};	
		axios.post(ruta+'/dodajGrupu', bodyData, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.dajGrupe();
					self.setState({
						obavjestenje: {
							tip: 2,
							tekst: "Uspješno dodana grupa"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
			}
		).catch(
			function(err)
			{
				if(err.response.status == 400)
				{
					self.setState({
						obavjestenje: {
							tip: 3,
							tekst: "Već postoji grupa"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
				else if(err.response.status == 500)
				{
					self.setState({
						obavjestenje: {
							tip: 3,
							tekst: "Greška na serveru"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
			}
		);


	}

	obrisiGrupu = function()
	{
		var bodyData = {
			idGrupe: this.state.odabranaGrupa.id
		};
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		let self = this;
		axios.post(ruta+'/obrisiGrupu', bodyData, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.dajGrupe();
					self.setState({
						obavjestenje: {
							tip: 2,
							tekst: "Grupa uspješno obrisana"
						}
					});
					self.props.setTimeout(self.ocistiObavijest, 3000);
				}
			}
		).catch(
			function(err)
			{
				self.setState({
					obavjestenje: {
						tip: 3,
						tekst: "Greška na serveru"
					}
				});
				self.props.setTimeout(self.ocistiObavijest, 3000);
			}
		);
	}

	napraviNavigaciju = function()
	{
		let navigacija = [];
		let zadnjaStranica = this.state.maxStranica;
		let trenutnaStranica = this.state.stranica;

		if(zadnjaStranica==1) return navigacija;

		for(let i = 1; i<=zadnjaStranica; i++)
		{
			if(i==trenutnaStranica)
			{
				navigacija.push(i);
			}
			else
			{
				//let onc = this.otidjiNa(i);
				navigacija.push(<a href="#" onClick={() => {this.otidjiNa(i)}}>{i}</a>);
			}
			navigacija.push(" ");
		}
		return navigacija;
	}

	otidjiNa = function(broj)
	{
		this.setState({
			stranica: broj
		});
		this.dohvatiZadatke(broj);
	}

	dohvatiZadatke = function(broj)
	{
		var tGrupa = this.state.odabranaGrupa2.id;
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.get(ruta+'/dajZadatkeGrupe/'+tGrupa+'/'+broj, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.setState({
						listaZadataka: res.data.zadaci,
						stranica: broj,
						maxStranica: res.data.max
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
	 
	novaPretraga = function()
	{
		this.setState({
			stranica: 1
		});
		this.dohvatiZadatke(1);
	}

	render()
	{
		var iterator;
		iterator = this.napraviNavigaciju();

		var zadaci = this.state.listaZadataka.map(
			function(zad)
			{
				var ruta = "/zadatak/" + zad.id;
				return(
					<Link to={ruta}>
						<span className="jedanZadatak" style={{"display": "block"}}>
							<Latex className="jedanZadatakLatex">{zad.postavka}</Latex>
						</span>
					</Link>
					/*
					<div className="jedanZadatak" style={{"display": "block"}} onClick = {() => {this.props.history.push(ruta)}}>
							<Latex className="jedanZadatakLatex">{zad.postavka}</Latex>
					</div>
					*/
				);
			},
			this
		);

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
			<>
				<div className="glavniKontejner">
					<div className="dodajGrupu">
						<h2>Dodavanje nove grupe:</h2><br/>
						<input type="text" className="inputPolje" name="username" onChange={this.handleUnos}></input><br/>
						<button className = "spasavanjeButton" onClick = {() => {this.dodajGrupu()}}>Dodaj</button><br/>

					</div>
					<div className="obrisiGrupu">
						<h2>Brisanje postojeće grupe:</h2><br/>
						<Select
							className = "selectPolje" 
							value={this.odabranaGrupa}
							onChange={this.handleSelect}
							options = {this.state.grupe}
							getOptionLabel = {option => option.naziv}
						/>
						<button className = "spasavanjeButton" onClick = {() => {this.obrisiGrupu()}}>Obriši</button><br/>

					</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
					<h2>Vaše grupe:</h2>
						<Select
							className = "spasavanje" 
							value={this.odabranaGrupa2}
							onChange={this.handleSelect2}
							options = {this.state.grupe2}
							getOptionLabel = {option => option.naziv}
						/>
						<br/>
						<button className = "spasavanjeButton" onClick = {() => {this.novaPretraga()}}>Pretraži</button><br/><br/>
						{zadaci}
						<div className = "navigator">
							{iterator}
						</div>
						
				</div>
				{obavijest}
			</>
	    );
	}
}


export default ReactTimeout(ZapamceniZadaci);
