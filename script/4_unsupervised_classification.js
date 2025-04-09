// 4_unsupervised_classification

// 1. Cargar la imagen raster estilizada
var image = ee.Image('projects/ee-millanorduzdiana/assets/cropped_image_1_subset');

// Visualización RGB (ajustada)
var rgbVis = {
  bands: ['b3', 'b2', 'b1'],
  min: 0,
  max: 3000,
  gamma: 1.3
};

Map.centerObject(image, 12);
Map.addLayer(image, rgbVis, 'Imagen RGB estilizada');

// 2. Cargar los tiles seleccionados
var tiles = ee.FeatureCollection('projects/ee-millanorduzdiana/assets/tiles_para_etiquetar_AGRUPADO');

var styledTiles = tiles.style({
  color: 'red',
  fillColor: '00000000',
  width: 2
});
Map.addLayer(styledTiles, {}, 'Tiles para etiquetar');

// Función para convertir MultiPoint a FeatureCollection con clase
function multipointToClassedFeatures(geometry, classValue) {
  var coords = geometry.coordinates();
  return ee.FeatureCollection(coords.map(function(coord) {
    return ee.Feature(ee.Geometry.Point(coord)).set('class', classValue);
  }));
}

// Crear puntos de entrenamiento por clase
var class0 = multipointToClassedFeatures(geometry, 0);
var class1 = multipointToClassedFeatures(geometry2, 1);
var class2 = multipointToClassedFeatures(geometry3, 2);
var class3 = multipointToClassedFeatures(geometry4, 3);
var class4 = multipointToClassedFeatures(geometry5, 4);
var class5 = multipointToClassedFeatures(geometry6, 5);
var class6 = multipointToClassedFeatures(geometry7, 6);
var class7 = multipointToClassedFeatures(geometry8, 7);
var class8 = multipointToClassedFeatures(geometry9, 8);
var class9 = multipointToClassedFeatures(geometry10, 9);
var class10 = multipointToClassedFeatures(geometry11, 10);

var trainingPoints = class0.merge(class1)
                           .merge(class2)
                           .merge(class3)
                           .merge(class4)
                           .merge(class5)
                           .merge(class6)
                           .merge(class7)
                           .merge(class8)
                           .merge(class9)
                           .merge(class10);

var training = image.sampleRegions({
  collection: trainingPoints,
  properties: ['class'],
  scale: 10,
  geometries: true
});

var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training,
  classProperty: 'class',
  inputProperties: ['b1', 'b2', 'b3', 'b4']
});

var classified = image.classify(classifier);

var palette = [
  '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00',
  '#ffff33', '#a65628', '#f781bf', '#999999', '#F5F5DC',
  '#000000'
];

Map.addLayer(classified, {min: 0, max: 10, palette: palette}, 'Clasificación Supervisada');

var legend = ui.Panel({style: {position: 'bottom-left'}});
legend.add(ui.Label('Leyenda de Clases'));

var classNames = [
  '1.1.1 Tejido urbano continuo',
  '1.3.1 Zonas de extracción minera',
  '2.2.2 Cultivos permanentes arbustivos',
  '2.3.1 Pastos limpios',
  '2.4.3 Mosaico de cultivos, pastos y espacios naturales',
  '5.1.1 Ríos (50 m)',
  '3.1.4 Bosque de galería y ripario',
  '3.1.5 Plantación forestal',
  '3.2.3 Vegetación secundaria o en transición',
  '3.3.3 Tierras desnudas y degradadas',
  '0: Nubes'
];

for (var i = 0; i < palette.length; i++) {
  var colorBox = ui.Label('', {
    backgroundColor: palette[i],
    padding: '8px',
    margin: '0 0 4px 0'
  });
  var classLabel = ui.Label(classNames[i], {margin: '0 0 4px 6px'});
  var row = ui.Panel([colorBox, classLabel], ui.Panel.Layout.Flow('horizontal'));
  legend.add(row);
}
Map.add(legend);
