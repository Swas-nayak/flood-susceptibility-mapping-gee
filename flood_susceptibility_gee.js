/*
Uncertainty-Aware Flood Susceptibility Mapping
Author: Swasthi S Nayak
Platform: Google Earth Engine (JavaScript API)

Description:
- Generates flood susceptibility probability map
- Computes model uncertainty using entropy
- Deploys interactive GEE Web Application
*/
// --- 1. DATA LOADING ---
var userPath = "users/swasthi23cs170/"; 

// Load Images
// We select band 0 (the first band) regardless of its name to avoid errors
var susceptibility = ee.Image(userPath + "Coastal_Karnataka_Flood_RAW3").select(0).rename('Risk');
var uncertainty = ee.Image(userPath + "Coastal_Karnataka_Uncertainty_RAW3").select(0).rename('Uncert');

// Define Region
var roi = ee.Geometry.Rectangle([74.0, 12.0, 75.5, 15.0]); 

// --- 2. UI SETUP ---
ui.root.clear();
var map = ui.Map();
var panel = ui.Panel({
  style: {width: '350px', padding: '15px', backgroundColor: '#ffffff'}
});

ui.root.add(panel);
ui.root.add(map);

map.centerObject(roi, 9);
map.setOptions('HYBRID');

// --- 3. ADD LAYERS ---
var suscVis = {min: 0, max: 1, palette: ['green', 'yellow', 'orange', 'red']};
var uncertVis = {min: 0, max: 1, palette: ['white', 'blue', 'black']}; 

map.addLayer(susceptibility, suscVis, 'Flood Susceptibility', true);
map.addLayer(uncertainty, uncertVis, 'Model Uncertainty', false);
// --- ADD DISTRICT BOUNDARIES (To prove coverage) ---
var districts = ee.FeatureCollection("FAO/GAUL/2015/level2")
  .filter(ee.Filter.or(
    ee.Filter.eq('ADM2_NAME', 'Dakshina Kannada'),
    ee.Filter.eq('ADM2_NAME', 'Udupi'),
    ee.Filter.eq('ADM2_NAME', 'Uttara Kannada')
  ));

// Create a hollow black outline
var empty = ee.Image().byte();
var outline = empty.paint({
  featureCollection: districts,
  color: 1,
  width: 2
});

map.addLayer(outline, {palette: 'black'}, 'District Boundaries', true, 0.7);
// --- 4. SIDEBAR ---
panel.add(ui.Label({
  value: 'Coastal Karnataka Flood Mapper',
  style: {fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0'}
}));

panel.add(ui.Label('Project: Uncertainty-Aware Machine Learning Framework'));

function makeLegend(title, vis) {
  var legendPanel = ui.Panel({style: {margin: '15px 0'}});
  legendPanel.add(ui.Label(title, {fontWeight: 'bold', fontSize: '12px'}));
  var colorBar = ui.Thumbnail({
    image: ee.Image.pixelLonLat().select(0),
    params: {bbox:[0,0,1,0.1], dimensions:'200x15', format:'png', min:0, max:1, palette: vis.palette},
    style: {width: '280px', height: '15px', margin: '5px 0'}
  });
  legendPanel.add(colorBar);
  return legendPanel;
}

panel.add(makeLegend('Flood Susceptibility', suscVis));
panel.add(makeLegend('Uncertainty', uncertVis));

// --- 5. INSPECTOR (Robust Version) ---
panel.add(ui.Label({
  value: 'INTERACTIVE INSPECTOR',
  style: {fontWeight: 'bold', fontSize: '14px', margin: '20px 0 5px 0'}
}));

panel.add(ui.Label('Click on the map to see Flood Probability %'));

var inspector = ui.Panel({style: {border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9'}});
panel.add(inspector);

map.onClick(function(coords) {
  inspector.clear();
  inspector.add(ui.Label('Calculating...'));
  
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  
  // Combine images
  var combined = susceptibility.addBands(uncertainty);
  
  // Use reduceRegion (Safer than sample)
  var dictionary = combined.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 30, // Must match your export scale
    maxPixels: 1e9
  });
  
  dictionary.evaluate(function(val) {
    inspector.clear();
    
    // Check if we found data
    if (val && val.Risk != null) {
      var prob = (val.Risk * 100).toFixed(1);
      var uncert = (val.Uncert * 100).toFixed(1);
      
      var color = 'green';
      if (val.Risk > 0.4) color = 'orange';
      if (val.Risk > 0.7) color = 'red';
      
      inspector.add(ui.Label({
        value: 'Flood Probability: ' + prob + '%',
        style: {fontSize: '18px', fontWeight: 'bold', color: color}
      }));
      
      inspector.add(ui.Label('Model Uncertainty: ' + uncert + '%'));
      
      // Debug info
      inspector.add(ui.Label({
        value: '(Raw Value: ' + val.Risk.toFixed(4) + ')',
        style: {fontSize: '10px', color: '#999'}
      }));
      
    } else {
      inspector.add(ui.Label('No data here. Try clicking closer to land center.'));
    }
  });
});