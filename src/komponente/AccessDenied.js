import React from 'react';
import './Stil.css';


class AccessDenied extends React.Component {

	constructor(props)
	{
		super(props);
		this.state = 
		{
			
		}
		
	}
	render()
	{
		return (
			<div className="glavniKontejner">
				<h2> Nemate pristup datom sadržaju</h2><br/>
			</div>
	    );
	}
}


export default AccessDenied;
