import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Tile as TileLayer} from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import {Fill, Stroke, Style, Text} from 'ol/style';
import countries from './data/geojson/countries.geojson';
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';

const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1,
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3,
    }),
  }),
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    url: countries,
    format: new GeoJSON(),
  }),
  style: function (feature) {
    style.getText().setText(feature.get('name'));
    return style;
  },
});

var key = 'LyQy9qw9UCmRLxaIx5SK';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url:
      'https://api.maptiler.com/maps/basic/{z}/{x}/{y}@2x.png?key=' +
      key,
    tilePixelRatio: 2, // THIS IS IMPORTANT
    tileSize: 512,
    crossOrigin: 'anonymous',
  }),
});

const map = new Map({
  layers: [raster, vectorLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});

const highlightStyle = new Style({
  stroke: new Stroke({
    color: '#f00',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(255,0,0,0.1)',
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
});


// select interaction working on "singleclick"
const select = new Select();


  if (select !== null) {
    map.addInteraction(select);
    select.on('select', function (e) {
      var country = e.target.getFeatures().getArray()[0].id_;

      fetch(`https://disease.sh/v3/covid-19/countries/${country}`)  
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
      console.log(data);
      document.getElementById('f-title').innerHTML = data.country;
      document.getElementById('flag').src = data.countryInfo.flag;

      document.getElementById('cases').value = numberWithCommas(data.cases);
      document.getElementById('recovered').value = numberWithCommas(data.recovered);
      document.getElementById('deaths').value = numberWithCommas(data.deaths);
      document.getElementById('tests').value = numberWithCommas(data.tests);
    })
    .catch(function() {
      // catch any errors
    });
    });
  
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}