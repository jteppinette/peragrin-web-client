import L from 'leaflet';

export const MARKER_BASE = {
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
};

export const MARKERS = ['Restaurant', 'Entertainment', 'Retail', 'Organization', 'Service', 'Realestate', 'Health', 'Community Leader'].reduce((result, key) => {
  result[key] = L.icon({...MARKER_BASE, iconUrl: require(`../../../assets/markers/${key.toLowerCase().replace(' ', '-')}.png`)});
  return result;
}, {});
