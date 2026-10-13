var wms_layers = [];


        var lyr_GoogleSatellite_0 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });
var format_MainSewerPipeline_1 = new ol.format.GeoJSON();
var features_MainSewerPipeline_1 = format_MainSewerPipeline_1.readFeatures(json_MainSewerPipeline_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainSewerPipeline_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainSewerPipeline_1.addFeatures(features_MainSewerPipeline_1);
var lyr_MainSewerPipeline_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainSewerPipeline_1, 
                style: style_MainSewerPipeline_1,
                popuplayertitle: 'Main Sewer Pipeline',
                interactive: true,
                title: '<img src="styles/legend/MainSewerPipeline_1.png" /> Main Sewer Pipeline'
            });
var format_MainWaterPipeline_2 = new ol.format.GeoJSON();
var features_MainWaterPipeline_2 = format_MainWaterPipeline_2.readFeatures(json_MainWaterPipeline_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainWaterPipeline_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainWaterPipeline_2.addFeatures(features_MainWaterPipeline_2);
var lyr_MainWaterPipeline_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainWaterPipeline_2, 
                style: style_MainWaterPipeline_2,
                popuplayertitle: 'Main Water Pipeline',
                interactive: true,
                title: '<img src="styles/legend/MainWaterPipeline_2.png" /> Main Water Pipeline'
            });
var format_MainBlowOffValve_3 = new ol.format.GeoJSON();
var features_MainBlowOffValve_3 = format_MainBlowOffValve_3.readFeatures(json_MainBlowOffValve_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainBlowOffValve_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainBlowOffValve_3.addFeatures(features_MainBlowOffValve_3);
var lyr_MainBlowOffValve_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainBlowOffValve_3, 
                style: style_MainBlowOffValve_3,
                popuplayertitle: 'Main Blow Off Valve',
                interactive: true,
                title: '<img src="styles/legend/MainBlowOffValve_3.png" /> Main Blow Off Valve'
            });
var format_MainEndNode_4 = new ol.format.GeoJSON();
var features_MainEndNode_4 = format_MainEndNode_4.readFeatures(json_MainEndNode_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainEndNode_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainEndNode_4.addFeatures(features_MainEndNode_4);
var lyr_MainEndNode_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainEndNode_4, 
                style: style_MainEndNode_4,
                popuplayertitle: 'Main End Node',
                interactive: true,
                title: '<img src="styles/legend/MainEndNode_4.png" /> Main End Node'
            });
var format_MainManholes_5 = new ol.format.GeoJSON();
var features_MainManholes_5 = format_MainManholes_5.readFeatures(json_MainManholes_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainManholes_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainManholes_5.addFeatures(features_MainManholes_5);
var lyr_MainManholes_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainManholes_5, 
                style: style_MainManholes_5,
                popuplayertitle: 'Main Manholes',
                interactive: true,
                title: '<img src="styles/legend/MainManholes_5.png" /> Main Manholes'
            });
var format_MainPipeJunction_6 = new ol.format.GeoJSON();
var features_MainPipeJunction_6 = format_MainPipeJunction_6.readFeatures(json_MainPipeJunction_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainPipeJunction_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainPipeJunction_6.addFeatures(features_MainPipeJunction_6);
var lyr_MainPipeJunction_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainPipeJunction_6, 
                style: style_MainPipeJunction_6,
                popuplayertitle: 'Main Pipe Junction',
                interactive: true,
                title: '<img src="styles/legend/MainPipeJunction_6.png" /> Main Pipe Junction'
            });
var format_MainServiceConnection_7 = new ol.format.GeoJSON();
var features_MainServiceConnection_7 = format_MainServiceConnection_7.readFeatures(json_MainServiceConnection_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_MainServiceConnection_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_MainServiceConnection_7.addFeatures(features_MainServiceConnection_7);
var lyr_MainServiceConnection_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_MainServiceConnection_7, 
                style: style_MainServiceConnection_7,
                popuplayertitle: 'Main Service Connection',
                interactive: true,
                title: '<img src="styles/legend/MainServiceConnection_7.png" /> Main Service Connection'
            });

lyr_GoogleSatellite_0.setVisible(true);lyr_MainSewerPipeline_1.setVisible(true);lyr_MainWaterPipeline_2.setVisible(true);lyr_MainBlowOffValve_3.setVisible(true);lyr_MainEndNode_4.setVisible(true);lyr_MainManholes_5.setVisible(true);lyr_MainPipeJunction_6.setVisible(true);lyr_MainServiceConnection_7.setVisible(true);
var layersList = [lyr_GoogleSatellite_0,lyr_MainSewerPipeline_1,lyr_MainWaterPipeline_2,lyr_MainBlowOffValve_3,lyr_MainEndNode_4,lyr_MainManholes_5,lyr_MainPipeJunction_6,lyr_MainServiceConnection_7];
lyr_MainSewerPipeline_1.set('fieldAliases', {'Pipe ID': 'Pipe ID', 'Utility Type': 'Utility Type', 'Diameter (mm)': 'Diameter (mm)', 'Material': 'Material', 'From Node': 'From Node', 'To Node': 'To Node', 'Lenght (m)': 'Lenght (m)', 'Status': 'Status', });
lyr_MainWaterPipeline_2.set('fieldAliases', {'Pipe ID': 'Pipe ID', 'Utility Type': 'Utility Type', 'Diameter (mm)': 'Diameter (mm)', 'Material': 'Material', 'From Node': 'From Node', 'To Node': 'To Node', 'Lenght (m)': 'Lenght (m)', 'Status': 'Status', });
lyr_MainBlowOffValve_3.set('fieldAliases', {'Valve ID': 'Valve ID', 'Utility Type': 'Utility Type', 'Pipe ID': 'Pipe ID', 'Diameter (mm)': 'Diameter (mm)', 'Location Description': 'Location Description', 'Discharge To': 'Discharge To', 'status': 'status', });
lyr_MainEndNode_4.set('fieldAliases', {'End Node ID': 'End Node ID', 'End Node Type': 'End Node Type', 'Pipe ID': 'Pipe ID', 'Diameter (mm)': 'Diameter (mm)', });
lyr_MainManholes_5.set('fieldAliases', {'Manhole ID': 'Manhole ID', 'Utility Type': 'Utility Type', 'Status': 'Status', 'Depth (m)': 'Depth (m)', });
lyr_MainPipeJunction_6.set('fieldAliases', {'Junction ID': 'Junction ID', 'Junction Type': 'Junction Type', 'Utiliy Type': 'Utiliy Type', 'Number of Branchs': 'Number of Branchs', 'Diameter In (mm)': 'Diameter In (mm)', 'Diameter Out (mm)': 'Diameter Out (mm)', 'Valve Present': 'Valve Present', 'Status': 'Status', });
lyr_MainServiceConnection_7.set('fieldAliases', {'Connection ID': 'Connection ID', 'Serves': 'Serves', 'Pipe ID': 'Pipe ID', 'Status': 'Status', 'Serve Type': 'Serve Type', });
lyr_MainSewerPipeline_1.set('fieldImages', {'Pipe ID': 'TextEdit', 'Utility Type': 'TextEdit', 'Diameter (mm)': 'TextEdit', 'Material': 'TextEdit', 'From Node': 'TextEdit', 'To Node': 'TextEdit', 'Lenght (m)': 'TextEdit', 'Status': 'TextEdit', });
lyr_MainWaterPipeline_2.set('fieldImages', {'Pipe ID': 'TextEdit', 'Utility Type': 'TextEdit', 'Diameter (mm)': 'TextEdit', 'Material': 'TextEdit', 'From Node': 'TextEdit', 'To Node': 'TextEdit', 'Lenght (m)': 'TextEdit', 'Status': 'TextEdit', });
lyr_MainBlowOffValve_3.set('fieldImages', {'Valve ID': 'TextEdit', 'Utility Type': 'TextEdit', 'Pipe ID': 'TextEdit', 'Diameter (mm)': 'TextEdit', 'Location Description': 'TextEdit', 'Discharge To': 'TextEdit', 'status': 'TextEdit', });
lyr_MainEndNode_4.set('fieldImages', {'End Node ID': 'TextEdit', 'End Node Type': 'TextEdit', 'Pipe ID': 'TextEdit', 'Diameter (mm)': 'TextEdit', });
lyr_MainManholes_5.set('fieldImages', {'Manhole ID': 'TextEdit', 'Utility Type': 'TextEdit', 'Status': 'TextEdit', 'Depth (m)': 'TextEdit', });
lyr_MainPipeJunction_6.set('fieldImages', {'Junction ID': 'TextEdit', 'Junction Type': 'TextEdit', 'Utiliy Type': 'TextEdit', 'Number of Branchs': 'TextEdit', 'Diameter In (mm)': 'TextEdit', 'Diameter Out (mm)': 'TextEdit', 'Valve Present': 'TextEdit', 'Status': 'TextEdit', });
lyr_MainServiceConnection_7.set('fieldImages', {'Connection ID': 'TextEdit', 'Serves': 'TextEdit', 'Pipe ID': 'TextEdit', 'Status': 'TextEdit', 'Serve Type': 'TextEdit', });
lyr_MainSewerPipeline_1.set('fieldLabels', {'Pipe ID': 'inline label - visible with data', 'Utility Type': 'inline label - visible with data', 'Diameter (mm)': 'inline label - visible with data', 'Material': 'inline label - visible with data', 'From Node': 'inline label - visible with data', 'To Node': 'inline label - visible with data', 'Lenght (m)': 'inline label - visible with data', 'Status': 'inline label - visible with data', });
lyr_MainWaterPipeline_2.set('fieldLabels', {'Pipe ID': 'inline label - visible with data', 'Utility Type': 'inline label - visible with data', 'Diameter (mm)': 'inline label - visible with data', 'Material': 'inline label - visible with data', 'From Node': 'inline label - visible with data', 'To Node': 'inline label - visible with data', 'Lenght (m)': 'inline label - visible with data', 'Status': 'inline label - visible with data', });
lyr_MainBlowOffValve_3.set('fieldLabels', {'Valve ID': 'inline label - visible with data', 'Utility Type': 'inline label - visible with data', 'Pipe ID': 'inline label - visible with data', 'Diameter (mm)': 'inline label - visible with data', 'Location Description': 'inline label - visible with data', 'Discharge To': 'inline label - visible with data', 'status': 'inline label - visible with data', });
lyr_MainEndNode_4.set('fieldLabels', {'End Node ID': 'inline label - visible with data', 'End Node Type': 'inline label - visible with data', 'Pipe ID': 'inline label - visible with data', 'Diameter (mm)': 'inline label - visible with data', });
lyr_MainManholes_5.set('fieldLabels', {'Manhole ID': 'inline label - visible with data', 'Utility Type': 'inline label - visible with data', 'Status': 'inline label - visible with data', 'Depth (m)': 'inline label - visible with data', });
lyr_MainPipeJunction_6.set('fieldLabels', {'Junction ID': 'inline label - visible with data', 'Junction Type': 'inline label - visible with data', 'Utiliy Type': 'inline label - visible with data', 'Number of Branchs': 'inline label - visible with data', 'Diameter In (mm)': 'inline label - visible with data', 'Diameter Out (mm)': 'inline label - visible with data', 'Valve Present': 'inline label - visible with data', 'Status': 'inline label - visible with data', });
lyr_MainServiceConnection_7.set('fieldLabels', {'Connection ID': 'inline label - visible with data', 'Serves': 'inline label - visible with data', 'Pipe ID': 'inline label - visible with data', 'Status': 'inline label - visible with data', 'Serve Type': 'inline label - visible with data', });
lyr_MainServiceConnection_7.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});