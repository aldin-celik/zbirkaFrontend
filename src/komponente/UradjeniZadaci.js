import React from 'react';
import {Link} from 'react-router-dom';

class UradjeniZadaci extends React.Component {
	render()
	{
		return (
			<div className="glavniKontejner">
				<h1>Ovo su uradjeni zadaci</h1>
				<Link className = "navigacijaLink" to='/zadatak/1'>Pregled zadatkova</Link>
			</div>
	    );
	}
}

export default UradjeniZadaci;
