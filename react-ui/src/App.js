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
    const rootRef = firebase.database().ref().child('bar');
    rootRef.on('value', snap => {
      this.setState({
        data: snap.val()
      })
    });

    const coordsRef = rootRef.child('coordinates');
    console.log(coordsRef)
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
    console.log(this.state.data.coordinates)
    this.state.data.coordinates ? console.log(this.state.data.name) : console.log("hello")
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{this.state.data.name}</p>
          <p>{this.state.data.name}</p>

        </div>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}>
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "harbor-15" }}>
              <Feature coordinates={[51.3233379650232, -0.481747846041145]}/>
            </Layer>
        </Map>
      </div>
    );
  }
}

export default App;
