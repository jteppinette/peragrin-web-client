import L from 'leaflet';

L.Icon.Default.imagePath = '/';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export const MARKER_BASE = {
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
};

export const CATEGORIES = [
    {name: 'Accommodation', icon: 'hotel'},
    {name: 'Restaurant', icon: 'restaurant_menu'},
    {name: 'Entertainment', icon: 'local_activity'},
    {name: 'Retail', icon: 'shopping_basket'},
    {name: 'Organization', icon: 'group_work'},
    {name: 'Service', icon: 'build'},
    {name: 'Realestate', icon: 'home'},
    {name: 'Health', icon: 'favorite'}
];

export const MARKERS = CATEGORIES.concat({name: 'Community Leader'}).reduce((result, category) => {
  result[category.name] = L.icon({...MARKER_BASE, iconUrl: require(`../../../assets/markers/${category.name.toLowerCase().replace(' ', '-')}.png`)});
  return result;
}, {});
