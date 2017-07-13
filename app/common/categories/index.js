import L from 'leaflet';

export const MARKER_BASE = {
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
};

export const CATEGORIES = ['Restaurant', 'Entertainment', 'Retail', 'Organization', 'Service', 'Realestate', 'Health'];

export const ICONS = [
    {icon: 'restaurant_menu', name: 'Restaurant'},
    {icon: 'local_activity', name: 'Entertainment'},
    {icon: 'shopping_basket', name: 'Retail'},
    {icon: 'group_work', name: 'Organization'},
    {icon: 'build', name: 'Service'},
    {icon: 'home', name: 'Realestate'},
    {icon: 'favorite', name: 'Health'}
];

export const MARKERS = CATEGORIES.concat('Community Leader').reduce((result, key) => {
  result[key] = L.icon({...MARKER_BASE, iconUrl: require(`../../../assets/markers/${key.toLowerCase().replace(' ', '-')}.png`)});
  return result;
}, {});
