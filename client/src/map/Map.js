import React, { useEffect, useState } from 'react';
import './mapStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapLayout from './MapLayout';
import axios from 'axios';

const Map = () => {
  const [cafes, setCafes] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8080/mapMarker')
    .then(response => {
      setCafes(response.data);
      console.log(response.data);
    })
    .catch(error => {
      console.error('에러:', error);
    });
  }, []); 

return (
    <div className='Map'>
      <MapLayout cafes={cafes}/>
    </div>
  );
};

export default Map;