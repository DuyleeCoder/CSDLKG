import contextmenu from './map_module/contextMenu.js';  
import { map } from './map_module/default.js';

var rasterLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
map.addControl(contextmenu);
map.addLayer(rasterLayer);


