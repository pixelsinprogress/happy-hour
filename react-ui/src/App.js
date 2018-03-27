import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

var config = {
    apiKey: "AIzaSyAnLoOrNYLClAbK7xrA7JnFxZtycHA7_Fk",
    authDomain: "fir-test-1ffc9.firebaseapp.com",
    databaseURL: "https://fir-test-1ffc9.firebaseio.com",
    projectId: "fir-test-1ffc9",
    storageBucket: "fir-test-1ffc9.appspot.com",
    messagingSenderId: "213145455350"
};

firebase.initializeApp(config);
var database = firebase.database();

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoibml0aW45MyIsImEiOiJjaXpkam5jZTIyYmM2MndvOHZrN2d0bXBvIn0.zZL24G9KtqbOv7d9m775xQ"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true,
      location: "Baltimore",
      data: []
    };

  }

  componentDidMount() {
    const barsRef = firebase.database().ref().child('bars');
    barsRef.on('value', snap => {
      this.setState({
        bars: snap.val()
      })
    });

    const coordsRef = firebase.database().ref().child('coordinates');
    coordsRef.on('value', snap => {
      this.setState({
        coords: snap.val()
      })
    });

    /*
    fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          message: json.message,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      })
    */
  }

  // {this.state.data.map((bar, index) => (
  //   <p key={index}>{bar.name}</p>
  // ))}

  render() {
    {this.state.coords ?
    Object.keys(this.state.coords).map(function(keyName, keyIndex) {
      console.log(keyName)
      // use keyName to get current key's name
      // and a[keyName] to get its value
    }) :
    console.log('no')}
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

        </div>
        <Map
          center= {[-76.5936, 39.2842]}
          zoom={[15]}
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"

          }}>
          {this.state.coords ?
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "harbor-15" }}>
              <Feature coordinates={[
                this.state.coords.beerbar.latitude,
                this.state.coords.beerbar.longitude
              ]}/>
            </Layer>
          : console.log("no") }
        </Map>
      </div>
    );
  }
}

export default App;
