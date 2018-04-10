import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import { Dialog } from './Dialog';

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
      currentMapCoordinates: [-76.5936, 39.2812],
      data: []
    };
    this.clickedFeature = this.clickedFeature.bind(this);

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

    const schedRef = firebase.database().ref().child('schedule');
    schedRef.on('value', snap => {
      this.setState({
        schedule: snap.val()
      })
    });

    const specialsRef = firebase.database().ref().child('specials');
    specialsRef.on('value', snap => {
      this.setState({
        specials: snap.val()
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

  findBars(allLayers) {
    let hour = new Date().getHours();
    this.state.schedule ?
      Object.values(this.state.schedule).map((bar, index) => {
        const startTime = (Object.values(this.state.schedule)[index].start) + 12
        const endTime = (Object.values(this.state.schedule)[index].end) + 12
        console.log(startTime)
        console.log(index)
        console.log(hour)

        // Today @: happy hours whose start time is > current time
        // Happening Now: happy hours whose start time < current time < end time
        // Ending Soon: happy hours whose (end time - current time) == 1
        // Tomorrow @: happy hours whose end time < current time

        if (hour < startTime) {
          console.log("Today @ " + startTime)
          allLayers[0].push(index)

        } else if ((endTime - hour) == 1) {
          console.log("Ending Soon")
          allLayers[1].push(index)

        } else if (hour > startTime && hour < endTime) {
          console.log("Happening Now")
          allLayers[2].push(index)

        } else {
          console.log("Tomorrow @")
          allLayers[3].push(index)

        }
      }) :
      console.log('undefined')
      return allLayers
  }

  displayLayers() {
    let todayAt = [];
    let happeningNow = [];
    let endingSoon = [];
    let tomorrowAt = [];
    let allLayers = [todayAt, happeningNow, endingSoon, tomorrowAt]
    this.findBars(allLayers)
    console.log(allLayers)

    let layers = allLayers.map(layer => {
      return <Layer
        type="symbol"
        id="marker"
        layout={{ "icon-image": "harbor-15" }}>
        
        </Layer>
    });
    console.log(layers)
    // return a Layer for each array in allLayers
    // where each Layer has as many Features as items in the array
    // where each Feature has the coordinate value of the corresponding item to its index value in this.state.coords

  }

  clickedFeature(index) {
    let selectedBarName = Object.values(this.state.bars)[index].name;
    let selectedBarPhone = Object.values(this.state.bars)[index].phone;
    let selectedBarCoordinates = Object.values(Object.values(this.state.coords)[index])
    this.setState({
      selectedBarName: selectedBarName,
      selectedBarPhone: selectedBarPhone,
      currentMapCoordinates: selectedBarCoordinates
    })
  }

  displayBars() {
    console.log(this.state.coords)
    return this.state.coords ?
      Object.values(this.state.coords).map((coord, index) => {
        const name = Object.keys(this.state.coords)[index]
        return <Feature name={name} onClick={() => this.clickedFeature(index)} key={index} coordinates={Object.values(coord)}/>
      }) :
      console.log('undefined')
  }

  render() {

    return (
      <div className="App">
        {this.displayLayers()}
        {this.state.selectedBarName ? <Dialog barName={this.state.selectedBarName} barPhone={this.state.selectedBarPhone}/> : console.log("undefined")}
        <Map
          center= {this.state.currentMapCoordinates}
          zoom={[15]}
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100vw"
          }}>

        </Map>
      </div>
    );
  }
}

export default App;
