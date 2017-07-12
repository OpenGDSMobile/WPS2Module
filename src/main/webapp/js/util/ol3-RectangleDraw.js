var RectangularDraw = (function (RectangularDraw, ol) {
    'use strict';
    var map = null, box_interaction = null, vector = null, source = null;
    var drawing_sw = true;
    var drawing_style = {
        fill_color: 'rgba(255, 255, 255, 0.5)',
        stroke_color : '#ff0000',
        stroke_width : 2
    };
    var polygon_style = {
        fill_color: 'rgba(255, 255, 255, 0.5)',
        stroke_color : '#ff7f00',
        stroke_width : 2
    };
    var result_data = {
        extent: null,
        geometry: null
    };
    var drawEndFunc = function () {
        result_data.extent = box_interaction.getGeometry().getExtent();
        var lowerLeft = [result_data.extent[0], result_data.extent[1]];
        var upperRight = [result_data.extent[2], result_data.extent[3]];
        var point_features = [];
        result_data.geometry = [[upperRight[0], upperRight[1]],
            [lowerLeft[0], upperRight[1]],
            [lowerLeft[0], lowerLeft[1]],
            [upperRight[0], lowerLeft[1]],
            [upperRight[0], upperRight[1]]];
        if (vector !== null) {
            map.removeLayer(vector);
        }
        var geom_polygon = new ol.geom.Polygon([result_data.geometry]);
        point_features.push(new ol.Feature(geom_polygon));
        source = new ol.source.Vector({
            features: point_features
        });
        vector = new ol.layer.Vector({
            title : 'boxPolygon',
            source : source,
            style : new ol.style.Style({
                stroke : new ol.style.Stroke({
                    color : polygon_style.stroke_color,
                    width : polygon_style.stroke_width
                }),
                fill : new ol.style.Fill({
                    color : polygon_style.fill_color
                })
            })
        });
        map.addLayer(vector);
    };
    var cancelInteraction = function () {
        map.removeLayer(vector);
        map.removeInteraction(box_interaction);
        box_interaction.un('boxend', drawEndFunc, this);
        vector = box_interaction = null;
        result_data.extent = result_data.geometry = [];
    };
    var registrationInteraction = function () {
        box_interaction = new ol.interaction.DragBox({
            style : new ol.style.Style({
                fill: new ol.style.Fill({
                    color: drawing_style.fill_color
                }),
                stroke: new ol.style.Stroke({
                    color: drawing_style.stroke_color,
                    width: drawing_style.stroke_width
                })
            })
        });
        map.addInteraction(box_interaction);
        box_interaction.on('boxend', drawEndFunc);
    };
    RectangularDraw = function (map_local) {
        map = map_local;
        registrationInteraction();
    };
    RectangularDraw.prototype = {
        constructor : RectangularDraw,
        version : 1.0,
        getInteractionObj : function () {
            return box_interaction;
        },
        getExtent : function (epsg) {
            epsg = (typeof (epsg) !== 'undefined') ? epsg : null;
            if (epsg !== null) {
                var lowerLeft = [result_data.extent[0], result_data.extent[1]];
                var upperRight = [result_data.extent[2], result_data.extent[3]];
                lowerLeft = ol.proj.transform(lowerLeft, 'EPSG:3857', epsg);
                upperRight = ol.proj.transform(upperRight, 'EPSG:3857', epsg);
                return [lowerLeft[0], lowerLeft[1], upperRight[0], upperRight[1]];
            } else {
                return result_data.extent;
            }
        },
        getBoxCoords : function () {
            return result_data.geometry;
        },
        drawFlag : function (sw) {
            if (sw === false) {
                map.removeInteraction(box_interaction);
                box_interaction.un('drawend', drawEndFunc, this);
                //cancelInteraction();
                drawing_sw = false;
            } else {
                registrationInteraction();
                drawing_sw = true;
            }
        }
    };
    return RectangularDraw;
}(window.RectangularDraw || {}, ol));