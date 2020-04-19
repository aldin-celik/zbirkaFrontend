import React from 'react';
import './Stil.css';
import {Redirect, Link} from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import ReactTimeout from 'react-timeout';

var Latex = require('react-latex');

const ruta = process.env.BACKEND_URL;

const tempLista = 
[

	{
		id: 1,
		postavka: `Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. ` ,
		hint: "hintara Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		zagonetka: "zagonetko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		rjesenje: " rjesko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst."
	},
	{
		id: 2,
		postavka: `Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. ` ,
		hint: "hintara Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		zagonetka: "zagonetko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		rjesenje: " rjesko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst."
	},
	{
		id: 3,
		postavka: `Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. 
		Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst. ` ,
		hint: "hintara Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		zagonetka: "zagonetko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst.",
		rjesenje: " rjesko Ovo je neki LaTeX $(3\\times 4) \\div (5-3)$ tekst."
	}
]

class Pocetna extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			stranica : 1,
			maxStranica : 1,
			listaZadataka : [],
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
		this.dohvatiZadatke = this.dohvatiZadatke.bind(this);
		this.otidjiNa = this.otidjiNa.bind(this);
		this.napraviNavigaciju = this.napraviNavigaciju.bind(this);
		this.pretraziKategoriju = this.pretraziKategoriju.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleSelect2 = this.handleSelect2.bind(this);
		this.novaPretraga = this.novaPretraga.bind(this);
		this.ocistiObavijest = this.ocistiObavijest.bind(this);
	}


	componentDidMount()
	{
		this.pretraziKategoriju();
	}

	ocistiObavijest = function()
	{
		this.setState({
			obavjestenje: ""
		});
	}

	dohvatiZadatke = function(broj)
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
		var headers = {
			headers: {
			"Content-Type": "application/json"
			}
		};
		axios.get(ruta+'/dajZadatke/'+selected+'/'+broj, headers).then(
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
					self.props.history.push('/zabrana');
				}
			}
		);
 	}

	otidjiNa = function(broj)
	{
		this.setState({
			stranica: broj
		});
		this.dohvatiZadatke(broj);
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
					self.props.history.push('/zabrana');
				}
			}
		);
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

	novaPretraga = function()
	{
		this.setState({
			stranica: 1
		});
		this.dohvatiZadatke(1);
	}


	render()
	{
		var zadaci = this.state.listaZadataka.map(
			function(zad)
			{
				var ruta = "/zadatak/" + zad.id;
				return(
					<Link to={ruta}>
						<div className="jedanZadatak" style={{"display": "block"}}>
							<Latex className="jedanZadatakLatex">{zad.postavka}</Latex>
						</div>
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

		var iterator;
		iterator = this.napraviNavigaciju();

		var filtracija = 
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
				<button className = "spasavanjeButton" onClick = {() => {this.novaPretraga()}}>Pretraži</button>

		</div>

		let kat = this.state.selectedKategorija.naziv;
		let kat2 = this.state.selectedPodkategorija.naziv;
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
					{filtracija}
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


export default ReactTimeout(Pocetna);
