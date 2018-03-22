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

let data = [
  {
    name: 'Nitin',
    address: 'Baltimore',
    coordinates: [-76.612189, 39.290385]
  },
  {
    name: 'Ert',
    address: 'London',
    coordinates: [-0.127758,51.507351]
  }
];

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
    const rootRef = database.ref().child('data');
    //const locationRef = rootRef.child('location');
    rootRef.on('value', snap => {
      this.setState({
        data: snap.val()
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

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.data.map((bar, index) => (
            <p key={index}>{bar.name}</p>
          ))}
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
            layout={{ "icon-image": "marker-15" }}>
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
          </Layer>
        </Map>
      </div>
    );
  }
}

export default App;
