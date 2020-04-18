import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';


import Pocetna from './komponente/Pocetna';
import UradjeniZadaci from './komponente/UradjeniZadaci';
import ZapamceniZadaci from './komponente/ZapamceniZadaci';
import UklonjeniZadaci from './komponente/UklonjeniZadaci';
import Nav from './komponente/Nav';
import Zadatak from './komponente/Zadatak';
import Registracija from './komponente/Registracija';
import AccessDenied from './komponente/AccessDenied';
import dodajZadatak from './komponente/dodajZadatak';
import editujZadatak from './komponente/editujZadatak';

class App extends React.Component {
	render()
	{
	  return (
		<Router>
		  <div className="app">
			<Nav/>
			<Switch>
			  <Route path="/" exact component = {Pocetna}/>
			  <Route path="/zapamceni" exact component = {ZapamceniZadaci}/>
			  <Route path="/zadatak/:id" exact component = {Zadatak}/>
			  <Route path="/registracija" exact component = {Registracija}/>
			  <Route path="/zabrana" exact component = {AccessDenied}/>
			  <Route path="/dodajZadatak" exact component = {dodajZadatak}/>
			  <Route path="/editujZadatak/:id" exact component = {editujZadatak}/>
			</Switch>
		  </div>
		</Router>
	  );
	}
}

export default App;
