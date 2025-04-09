# Proyecto de Clasificación de Coberturas CLC N3 con IA

Este repositorio contiene la estructura de trabajo y los insumos utilizados para entrenar un modelo de clasificación supervisada con imágenes satelitales Sentinel-2 y referencias del Corine Land Cover (CLC) nivel 3.

## Estructura de carpetas

### 📁 `data/`
Contiene los insumos espaciales utilizados como entrada, entre ellos:
- `area_estudio_prueba.*`: Shape del área de interés.
- `CLC_2020_area_estudio.*`: Capa de referencia de coberturas CLC 2020.
- `cropped_image_1.tif`: Imagen Sentinel recortada para entrenamiento.

### 📁 `doc/`
- `Informe_CLC_IA_DianaMillan.docx`: Documento explicativo con metodología, resultados y análisis.

### 📁 `output/`
Contiene productos del análisis y del modelo:
- `clasificacion_supervisada.tif`: Resultado del modelo entrenado.
- `coberturas_CLCN3_revisado.*`: Shapefile de referencia ajustado.
- `nube_mask.*`: Máscara de nubes aplicada en el preprocesamiento.
- `tiles_index.*`, `tiles_para_etiquetar.*`: Indexación espacial y agrupación de tiles.
- `tiles_por_clase.xlsx`: Estadísticas de cobertura por tile.
- `Mapa_Coberturas_CLC_N3.jpg`: Visualización del resultado.

### 📁 `output/dataset/`
Subcarpeta con los insumos de entrenamiento para el modelo:
- `images/`: Imágenes raster por tile en formato `.tif`.
- `labels/`: Etiquetas vectoriales correspondientes en formato `.geojson`.

### 📁 `script/`
Contiene los scripts y notebooks usados en el flujo de trabajo:
- `1_preprocesamiento.ipynb`: Preprocesamiento y normalización de imágenes.
- `2_seleccion_tiles_arcgis.ipynb`: Selección espacial de tiles basada en Corine.
- `3_supervised_classification.js`: Clasificación supervisada en GEE.
- `4_unsupervised_classification.js`: Análisis no supervisado (k-means).
- `5_significant_variables.js`: Evaluación de variables relevantes.
- `6_exportar_labels_images.ipynb`: Exportación de imágenes y etiquetas.
- `7_entrenamiento.ipynb`: Entrenamiento del modelo de segmentación.

## Notas adicionales
- Todos los archivos shapefile se incluyen con sus componentes `.shp`, `.shx`, `.dbf`, `.prj`, etc.
- El etiquetado se realizó a partir de una combinación de clasificación supervisada y no supervisada, con validación manual por cobertura.

## Autor
Diana Millan Orduz 
Fecha: abril de 2025  
