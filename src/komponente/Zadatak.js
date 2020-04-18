import React from 'react';
import './Zadatak.css';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import ReactTimeout from 'react-timeout';
import iconBrisanje from './brisi.svg';
import iconEdit from './edit.svg';
var Latex = require('react-latex');



const ruta = "http://localhost:8080";

class Zadatak extends React.Component {
	
	constructor(props)
	{
		super(props);
		this.state = {
			rjesenje: false,
			hint: false,
			zagonetka: false,
			zadatak : 
			{
				postavka: " " ,
				hint: " ",
				zagonetka: " ",
				rjesenje: " ",
				
			},
			selectedKategorija : {},
			obavjestenje: ""
		}
		this.toggleRjesenje = this.toggleRjesenje.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.dohvatiZadatak = this.dohvatiZadatak.bind(this);
		this.dohvatiKategorije = this.dohvatiKategorije.bind(this);
		this.dodajUkloni = this.dodajUkloni.bind(this);
		this.ocistiObavijest = this.ocistiObavijest.bind(this);
		this.obrisiZadatak = this.obrisiZadatak.bind(this);
		this.editujZadatak = this.editujZadatak.bind(this);
	}
	
	componentDidMount() {
		this.dohvatiZadatak();
		this.dohvatiKategorije();
		var tipObavjestenja = localStorage.getItem("tipObavjestenja");
		var tekstObavjestenja = localStorage.getItem("tekstObavjestenja");
		var self = this;
		if(tipObavjestenja != null && tipObavjestenja != 0)
		{
			self.setState({
				obavjestenje: {
					tip: tipObavjestenja,
					tekst: tekstObavjestenja
				}
			});
			self.props.setTimeout(self.ocistiObavijest, 3000)
		}
	}

	ocistiObavijest = function()
	{
		this.setState({
			obavjestenje: {
				tip: 0,
				tekst: ""
			}
		});
		localStorage.setItem("tipObavjestenja", 0);
		localStorage.setItem("tekstObavjestenja", "");
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
						zadatak: res.data
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

	dohvatiKategorije = function()
	{
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.get(ruta+'/zadatakKategorije/'+self.props.match.params.id, headers).then(
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

	toggleRjesenje = function() {
		if(this.state.rjesenje === true)
		{
			this.setState({
				rjesenje : false,
				hint: false,
				zagonetka: false
			});
		}
		else
		{
			this.setState({
				rjesenje : true,
				hint: false,
				zagonetka : false
			});
		}		
		this.forceUpdate();
	}

	toggleHint = function() {
		if(this.state.hint === true)
		{
			this.setState({
				rjesenje : false,
				hint: false,
				zagonetka: false
			});
		}
		else
		{
			this.setState({
				rjesenje : false,
				hint: true,
				zagonetka : false
			});
		}		
		this.forceUpdate();
	}

	toggleZagonetka = function() {
		if(this.state.zagonetka === true)
		{
			this.setState({
				rjesenje : false,
				hint: false,
				zagonetka: false
			});
		}
		else
		{
			this.setState({
				rjesenje : false,
				hint: false,
				zagonetka : true
			});
		}		
		this.forceUpdate();
	}


	handleSelect = function(selected)
	{	
		this.setState({
			selectedKategorija : selected
		});
	}

	dodajUkloni = function()
	{
		var self = this;
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		var bodyData = {
			idgrupe: this.state.selectedKategorija.id,
			idzadatka: this.props.match.params.id,
			zapamcenje: this.state.selectedKategorija.zapamceno
		};
		axios.post(ruta+'/zapamtiZadatak', bodyData, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					self.state.selectedKategorija.zapamceno = res.data.rezultat;
					self.forceUpdate();
					if(res.data.rezultat == 0)
					{
						self.setState({
							obavjestenje: {
								tip: 2,
								tekst: "Zadatak uklonjen"
							}
						});
						self.props.setTimeout(self.ocistiObavijest, 3000)
					}
					else
					{
						self.setState({
							obavjestenje: {
								tip: 2,
								tekst: "Zadatak zapamćen"
							}
						});
						self.props.setTimeout(self.ocistiObavijest, 3000)
					}
				}
			}
		).catch(
			function(err)
			{
				if(err.response.status == 401)
				{
					//self.props.history.push('/zabrana');
				}
			}
		);
	}

	obrisiZadatak = function()
	{
		var self = this;
		var bodyData = {
			idZadatka: self.props.match.params.id
		};
		var headers = {
			headers: {
			"Content-Type": "application/json",
			"auth-token": localStorage.getItem('token')
			}
		};
		axios.post(ruta+'/obrisiZadatak', bodyData, headers).then(
			function(res)
			{
				if(res.status == 200)
				{
					var ruta = "/";
					self.props.history.push(ruta);
				}
			}
		).catch(
			function(err)
			{
				if(err.request.status == 401)
				{
					
				}
			}
		);
	}


	editujZadatak = function()
	{
		var ruta = "/editujZadatak/"+this.props.match.params.id;
		this.props.history.push(ruta);
	}
	
	render()
	{
		//HINT
	  const prikaziRjesenje = this.state.rjesenje;
	  const prikaziHint = this.state.hint;
	  const prikaziZagonetku = this.state.zagonetka;


	  let rjes;
	  if(prikaziRjesenje == true)
	  {
		  rjes = <>
		  <button className = "RHZ" onClick = {() => {this.toggleRjesenje()}}>Sakrij rješenje</button>
		  <button className = "RHZ" onClick = {() => {this.toggleHint()}}>Prikaži hint</button>
		  <button className = "RHZ" onClick = {() => {this.toggleZagonetka()}}>Provjera rješenja</button>
		  <div id="tekstRjesenja">
				<Latex>{this.state.zadatak.rjesenje}
				</Latex>
		  </div></>;
	  }
	  else if(prikaziHint == true)
	  {
		  rjes = <>
		  <button className = "RHZ" onClick = {() => {this.toggleRjesenje()}}>Prikaži rješenje</button>
		  <button className = "RHZ" onClick = {() => {this.toggleHint()}}>Sakrij hint</button>
		  <button className = "RHZ" onClick = {() => {this.toggleZagonetka()}}>Provjera rješenja</button>
		  <div id="tekstRjesenja">
				<Latex>{this.state.zadatak.hint}
				</Latex>
		  </div></>;
	  }
	  else if(prikaziZagonetku == true)
	  {
		  rjes = <>
		  <button className = "RHZ" onClick = {() => {this.toggleRjesenje()}}>Prikaži rješenje</button>
		  <button className = "RHZ" onClick = {() => {this.toggleHint()}}>Prikaži hint</button>
		  <button className = "RHZ" onClick = {() => {this.toggleZagonetka()}}>Sakrij provjeru</button>
		  <div id="tekstRjesenja">
	  			<Latex>{this.state.zadatak.zagonetka}	
				</Latex>
		  </div></>;
	  }
	  else
	  {
		  rjes = <><button className = "RHZ" onClick = {() => {this.toggleRjesenje()}}>Prikaži rješenje</button>
		  <button className = "RHZ" onClick = {() => {this.toggleHint()}}>Prikaži hint</button>
		  <button className = "RHZ" onClick = {() => {this.toggleZagonetka()}}>Provjera rješenja</button>
		  </>;
	  }

	  let p = this.state.zadatak.postavka;//.replace(/\\/g, "\\textbackslash ");

	  let pamcenje;
	  if(localStorage.getItem("logovan") != 0)
	  {
		  if(this.state.selectedKategorija.zapamceno != 1)
		  {
				pamcenje = <>
				<div className="cuvanjeZadatka">
					<h2>Sačuvajte ili obrišite ovaj zadatak</h2><br/>
					Kategorija: <Select
						className = "spasavanje" 
						value={this.selectedKategorija}
						onChange={this.handleSelect}
						options = {this.state.kategorije}
						getOptionLabel = {option => option.naziv}
					/>
					<br/>
					<button className = "spasavanjeButton" onClick = {() => {this.dodajUkloni()}}>Sačuvaj</button>
				</div>
				</>;
		  }
		  else
		  {
				pamcenje = <>
				<div className="cuvanjeZadatka">
					<h2>Sačuvajte ili obrišite ovaj zadatak</h2><br/>
					Kategorija: <Select
						className = "spasavanje" 
						value={this.selectedKategorija}
						onChange={this.handleSelect}
						options = {this.state.kategorije}
						getOptionLabel = {option => option.naziv}
					/>
					<br/>
					<button className = "spasavanjeButton" onClick = {() => {this.dodajUkloni()}}>Ukloni</button>
				</div>
				</>;
		  }
	  }
	  else
	  {
		  pamcenje = <></>;
	  }

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

		let naslov;
		if(localStorage.getItem("privilegija") != null && localStorage.getItem("privilegija") > 1)
		{
			naslov = <h2>Zadatak br. {this.state.zadatak.id} <img className="ikonaEdit" src={iconEdit} onClick = {() => {this.editujZadatak()}}/> <img className="ikonaBrisanje" src={iconBrisanje} onClick = {() => {this.obrisiZadatak()}}/></h2>
				
		}
		else
		{
			naslov = <h2>Zadatak br. {this.state.zadatak.id} </h2>
				
		}

	  return (
		  <>
			<div className="glavniKontejner"> 
				<div className = "postavkaZadatka">
				{naslov}
				
				<div>
					<Latex>{p}
					</Latex><br/>

				</div>
				</div>
				<div className = "rjesenjeZadatka">
				{rjes}
				</div>
				<br/>
				{pamcenje}
				
			</div>
			{obavijest}
		 </>
	  );
	}
}
/*
class Hint extends React.Component
{
	render()
	{
		return(
			<div id="tekstHinta">
				<Latex>Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. 
				Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. 
				Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. 
				Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. Ovo je neki LaTeX $(3\times 4) \div (5-3)$ tekst. 
				</Latex>
			</div>
		);
	}
}
*/
export default ReactTimeout(Zadatak);
