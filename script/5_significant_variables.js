// significant_variables

// Paso 1: Lista de bandas
var bandas = ['b1', 'b2', 'b3', 'b4'];

// Paso 2: Crear tabla con medias por clase para cada banda
var listaTablas = bandas.map(function(banda) {
  var tabla = training.reduceColumns({
    reducer: ee.Reducer.mean().group({
      groupField: 1,
      groupName: 'class'
    }),
    selectors: [banda, 'class']
  }).get('groups');
  
  tabla = ee.List(tabla).map(function(item) {
    item = ee.Dictionary(item);
    return ee.Feature(null, {
      banda: banda,
      clase_id: item.get('class'),
      valor: item.get('mean')
    });
  });
  return ee.FeatureCollection(tabla);
});
var datosFinales = ee.FeatureCollection(listaTablas).flatten();
print('📊 Media por banda y clase (ID de clase)', datosFinales.limit(100));

var chart = ui.Chart.feature.groups({
  features: datosFinales,
  xProperty: 'clase_id',
  yProperty: 'valor',
  seriesProperty: 'banda'
}).setChartType('LineChart')
  .setOptions({
    title: 'Medias por clase y banda',
    hAxis: {title: 'Clase ID'},
    vAxis: {title: 'Valor medio'},
    lineWidth: 2,
    pointSize: 4
  });

print(chart);

// Índices NDVI y pseudo-NDBI
var ndvi = image.normalizedDifference(['b3', 'b1']).rename('NDVI');
var pseudoNDBI = image.normalizedDifference(['b2', 'b3']).rename('PseudoNDBI');
var imageWithIndices = image.addBands([ndvi, pseudoNDBI]);

// Muestreo por clase
function sampleWithClass(geom, classValue) {
  var fc = ee.FeatureCollection(geom.coordinates().map(function(coord) {
    return ee.Feature(ee.Geometry.Point(coord), {'class': classValue});
  }));
  return imageWithIndices.sampleRegions({
    collection: fc,
    properties: ['class'],
    scale: 10
  });
}

var muestras = ee.FeatureCollection([
  sampleWithClass(geometry, 0),
  sampleWithClass(geometry3, 2),
  sampleWithClass(geometry4, 3),
  sampleWithClass(geometry5, 4),
  sampleWithClass(geometry7, 6),
  sampleWithClass(geometry8, 7),
  sampleWithClass(geometry9, 8)
]).flatten();

var claseUrbana = muestras.filter(ee.Filter.eq('class', 0));
var histNDBI = ui.Chart.feature.groups({
  features: claseUrbana,
  xProperty: 'PseudoNDBI',
  yProperty: 'class',
  seriesProperty: 'class'
}).setChartType('Histogram')
  .setOptions({
    title: 'Histograma de Pseudo-NDBI para Tejido urbano',
    hAxis: {title: 'Pseudo-NDBI'},
    vAxis: {title: 'Frecuencia'},
    colors: ['#e41a1c']
  });
print(histNDBI);

var clasesVegetacion = muestras.filter(ee.Filter.inList('class', [2, 3, 4, 6, 7, 8]));
var jittered = clasesVegetacion.randomColumn('random').map(function(f) {
  var jitter = ee.Number(f.get('random')).multiply(0.4).subtract(0.2);
  return f.set('x', ee.Number(f.get('class')).add(jitter));
});

var ndviScatter = ui.Chart.feature.groups({
  features: jittered,
  xProperty: 'x',
  yProperty: 'NDVI',
  seriesProperty: 'class'
}).setChartType('ScatterChart')
  .setOptions({
    title: 'NDVI por clase (tipo boxplot)',
    hAxis: {
      title: 'Clase (ver leyenda)',
      ticks: [
        {v:2, f:'2: Cultivos permanentes'},
        {v:3, f:'3: Pastos limpios'},
        {v:4, f:'4: Mosaicos agropecuarios'},
        {v:6, f:'6: Bosque ripario'},
        {v:7, f:'7: Plantación forestal'},
        {v:8, f:'8: Vegetación secundaria'}
      ]
    },
    vAxis: {title: 'NDVI'},
    pointSize: 4,
    legend: {position: 'none'},
    colors: ['#66c2a5']
  });
print(ndviScatter);


// Simular boxplot por banda con jitter (dispersión) — ayuda a justificar la normalización
bandas.forEach(function(banda) {
  var trainingJittered = training.randomColumn('random').map(function(f) {
    var jitter = ee.Number(f.get('random')).multiply(0.4).subtract(0.2);
    return f.set('x', ee.Number(f.get('class')).add(jitter));
  });

  var chart = ui.Chart.feature.groups({
    features: trainingJittered,
    xProperty: 'x',
    yProperty: banda,
    seriesProperty: 'class'
  })
  .setChartType('ScatterChart')
  .setOptions({
    title: 'Simulación tipo boxplot para ' + banda,
    hAxis: {
      title: 'Clase (ver leyenda)',
      ticks: [
        {v:0, f:'0: Urbano'},
        {v:1, f:'1: Minería'},
        {v:2, f:'2: Cultivos'},
        {v:3, f:'3: Pastos'},
        {v:4, f:'4: Mosaico'},
        {v:5, f:'5: Río'},
        {v:6, f:'6: Bosque ripario'},
        {v:7, f:'7: Forestal'},
        {v:8, f:'8: Secundaria'},
        {v:9, f:'9: Desnudas'},
        {v:10, f:'10: Nubes'}
      ]
    },
    vAxis: {title: 'Valor de ' + banda},
    pointSize: 3,
    legend: {position: 'none'},
    colors: ['#7570b3']
  });

  print(chart);
});
