import React, { Component } from 'react';

export class Dialog extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
    const divStyle = {
      backgroundColor: 'white',
      height: '100px',
      width: '100%'
    }

   return (
     <div style={divStyle}>
      <h1>{this.props.barName}</h1>
      <p>{this.props.barPhone}</p>
     </div>
   );
 }
}
