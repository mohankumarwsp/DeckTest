import React, { useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import {Map} from 'react-map-gl';
import {PathLayer} from '@deck.gl/layers';
import { useState } from "react";
//import 'mapbox-gl/dist/mapbox-gl.css';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoicml2aW5kdSIsImEiOiJjazZpZXo0amUwMGJ1M21zYXpzZGMzczdiIn0.eoArFYnhz0jEPQEnF0vdKQ';
// Viewport settings

const INITIAL_VIEW_STATE = {
  latitude:-36.859067426240394, longitude:174.76020812611904, zoom:14,
  pitch: 0,
  bearing: 0
};

function App({props}) {
  const [formatedData, setFromatedData] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  async function formatData () {
    debugger;
    let dataArray = []
    let res = await fetch("http://localhost:3000/Closure_2.geojson");
    
    const data = await res.json();
    data["features"] && data["features"].forEach(element => {
      let jsonObject = {};
      jsonObject["name"] = element["properties"]["FID"];
      jsonObject["color"] = selectedItem && element["properties"]["FID"] === selectedItem["name"] ? [209,42,33]: [50,168,82] ;
      jsonObject["path"] = element["geometry"]["coordinates"];
      dataArray.push(jsonObject);
    });
    setFromatedData(dataArray);
  }

  // function UpdateMapColor(){
  //   //formatData()
  //   formatedData.forEach(element => {
  //     element["color"] = selectedItem && element["properties"]["FID"] === selectedItem["name"] ? [209,42,33]: [50,168,82] ;
  //   });

  //   setFromatedData(formatedData);
  
  // }

  function UpdateColor(selectedRoad){
      setSelectedItem(selectedRoad)
      formatData();
  }

  useEffect(() => {
    formatData();
  });

  return (
    <React.Fragment>
      <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      layers={[new PathLayer({
        id: 'PathLayer',
        data : formatedData, // 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json',
        getColor: d => d.color,
        getPath: d => d.path,
        getWidth: d => 5,
        onClick: d => UpdateColor(d.object),
        widthMinPixels: 1,
        widthScale: 4,
        parameters: {
          depthMask: false
        },
        pickable: true,
      })]}
      getTooltip={({object}) => object && object.name}
    >
      <Map   
       mapStyle = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
       mapboxAccessToken={MAPBOX_ACCESS_TOKEN} 
       mapProvider= 'mapbox'
       />
    </DeckGL> 
     
    </React.Fragment>
   
  );

}
export default App;
