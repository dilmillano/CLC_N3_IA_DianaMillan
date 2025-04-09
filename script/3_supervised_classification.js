
// 3_supervised_classification

// 1. Cargar la imagen
var image = ee.Image('projects/ee-millanorduzdiana/assets/cropped_image_1_subset');

// 2. Revisar nombres de bandas
print('Bandas disponibles:', image.bandNames());

// 3. Seleccionar bandas reales (ajustadas al nombre correcto)
var bands = ['b1', 'b2', 'b3', 'b4'];  // Usualmente RGB + NIR (dependiendo del orden original)
var imageSelected = image.select(bands);

// 4. Tomar muestra de entrenamiento
var training = imageSelected.sample({
  region: image.geometry(),
  scale: 10,
  numPixels: 5000,
  seed: 42,
  geometries: true
});

// 5. Aplicar KMeans
var clusterer = ee.Clusterer.wekaKMeans(6).train({
  features: training,
  inputProperties: bands
});

// 6. Clasificar imagen
var result = imageSelected.cluster(clusterer);

// 7. Visualizar
Map.centerObject(image, 12);
Map.addLayer(result.randomVisualizer(), {}, 'KMeans Clusters');

// 8. (Opcional) Exportar clasificación
Export.image.toDrive({
  image: result,
  description: 'clasificacion_kmeans_correcta',
  folder: 'GEE_OUTPUT',
  scale: 10,
  region: image.geometry(),
  maxPixels: 1e13
});
