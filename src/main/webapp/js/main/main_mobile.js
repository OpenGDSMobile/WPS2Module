var map;
var draw;

function initMap() {
    var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false}); 
    var controls = ol.control.defaults({ attribution: false, zoom: false, rotate: false });
    draw = false;
	map = new ol.Map({
		target : 'map',
		layers : [ new ol.layer.Tile({
			source : new ol.source.OSM()
		}) ],
		view : new ol.View({
			center : ol.proj.fromLonLat([ 128.613730, 38.198097 ]),
			zoom : 12
		}),
        interactions: interactions,
        controls: controls
	});
	var indexImageLayer = new ol.layer.Tile({
		title : 'index',
		source : new ol.source.TileWMS(({
			url : 'http://113.198.80.56/geoserver/wms',
			params : {
				'LAYERS' : 'index:LC81150342016165LGN00_RGB',
				'TILED' : true
			},
			serverType : 'geoserver'
		}))
	});
	map.addLayer(indexImageLayer);
    map.on('singleclick', singleClickEvent);
}

var singleClickEvent = function(evt) {
    if(draw){
        var coordinates = map.getEventCoordinate(evt.originalEvent);
        if ($('#Longitude_Min').val() == ''){
        	$('#Longitude_Min').val(coordinates[0]);
        	$('#Latitude_Min').val(coordinates[1]);
        }
        else{
        	$('#Longitude_Max').val(coordinates[0]);
        	$('#Latitude_Max').val(coordinates[1]);
        	
        	var temp = $('#Latitude_Min').val();
        	$('#Latitude_Min').val($('#Latitude_Max').val());
        	$('#Latitude_Max').val(temp);

        	$('#notice').css('display', 'none');
        	$('#paramModal').css('display', 'block');
        	draw = false;
        }
    }	
}

var generateAlrgorithmMenu = function() {
	getXML("getCapabilities", function(schema) {
		var data = {
			schema : schema
		};
		$.ajax({
			type : 'GET',
			url : context + '/wps2/getCapabilities.do',
			data : data,
			success : function(res) {
				var resData = JSON.parse(res.result);
				$.each(resData.result,
						function(key, value) {
							var AlgorithmName = value.Identifier;
							var ViewAlgorithmName = AlgorithmName.replace('_',
									'&nbsp');
							$("#alrgorithmMenu").append(
									'<a value="' + AlgorithmName + '">'
											+ ViewAlgorithmName + '</a>');
						});
			}
		});
	});
}
///////////////////////////////////////////////////////////////////////////////////////
var generateAlgorithmPopUpMenu = function() {
	var indentifierValue = $(this).attr('value');
	//$('#selectAlgorithmModal').css('display', 'none');
	getXML("describeProcess", function(schema) {
		var identifier = [ {
			identifier : indentifierValue
		} ];
		var data = {
			schema : schemaModifier('describeProcess', schema, identifier)
		};
		$.ajax({
			type : 'GET',
			url : context + '/wps2/describeProcess.do',
			data : data,
			success : function(res) {
				//alert(indentifierValue);
				setParameterModalView(indentifierValue);
				setParameterMenu(res);
			}
		});
	});
}

var setParameterModalView = function(modalViewName) {
	$('#paramModalHeader').empty();
	$('#paramModalBody1').empty();
	$('#paramModalBody2').empty();
	var ViewAlgorithmName = modalViewName.replace('_', '&nbsp');
	$('#paramModalHeader').append(
			'<div class="header" value="' + modalViewName + '">'
					+ ViewAlgorithmName + '</div>');
	$('#paramModalHeader').append('<span class="param-modal-close">X</span>');

	var modal = $('#paramModal');
	modal.on('click', 'span', function() {
		modal.css('display', 'none');
	});

}

var setParameterMenu = function(data) {

	data = JSON.parse(data.result);
	console.log(data);
	$.each(data, function(key, value) {
		var ParameterName = value.Identifier;
		if (key < 4) {
			$("#paramModalBody1").append(
					'<p style="font-size: 14px; font-size: 20px; font-weight:bold;">'
							+ ParameterName + '</p>');
			$("#paramModalBody1").append(
					'<input style="height:30px;" type="text" id = "'
							+ ParameterName + '" placeholder="Input Value"/>');
		} else {
			$("#paramModalBody2").append(
					'<p style="font-size: 14px; font-size: 20px; font-weight:bold;">'
							+ ParameterName + '</p>');
			$("#paramModalBody2").append(
					'<input style="height:30px;" type="text" id = "'
							+ ParameterName + '" placeholder="Input Value"/>');
		}
	});
	
	$('#notice').css('display', 'block');
	draw = true;
}

var executeClickEvent = function() {
	var paramDataList;
	var identifier = $(".header").attr('value');
	var inputList = [];
	var validate = false;

	$('input').each(function(index) {
		if ($(this).val() == '') {
			alert($(this).attr('id') + "has no value");
			validate = true;
			return false;
		}
		inputList.push({
			"id" : $(this).attr('id'),
			"data" : $(this).val()
		});
	});

	if (validate) {
		return;
	}
	console.log(identifier);
	paramDataList = {
		"identifier" : identifier,
		"inputList" : inputList
	};
	console.log(paramDataList);
	execute(paramDataList);

}

var cancelClickEvent = function() {
	var modal = $('#paramModal');
	modal.css('display', 'none');
	draw = false;
}

var execute = function(paramDataList) {
	var modal = $('#paramModal');
	var statusList = $('#processStatus');
	modal.css('display', 'none');

	getXML("execute", function(schema) {
		var schema = schemaModifier('execute', schema, paramDataList);
		console.log(schema);
		$.ajax({
					type : 'POST',
					url : context + '/wps2/execute.do',
					contentType : 'application/json;charset=UTF-8',
					data : schema,
					success : function(res) {
						console.log(res);
						var processingAlgorithm = paramDataList.identifier;
						var data = JSON.parse(res.result);
						statusList.append('<a>'
								+ processingAlgorithm.replace('_', '&nbsp')
								+ ' : </a>');
						statusList.append('<a id=' + data.JobID + '>'
								+ data.Status + '</a>');
						$("#" + data.JobID).attr("class", "status");
						$("#" + data.JobID).data("processingName", processingAlgorithm);
						openProcessStatus();
						getStatus(data);
					}
				});
	});
}

var getStatus = function(data) {

	getXML("getStatus", function(schema) {

		var JobID = {
			JobID : data.JobID
		};
		var schemaData = {
			schema : schemaModifier('getStatus', schema, JobID)
		};
		$.ajax({
			type : 'GET',
			url : context + '/wps2/getStatus.do',
			data : schemaData,
			success : function(res) {
				console.log(res);
				res = JSON.parse(res.result);
				var processingAlgorithm = $("#" + res.JobID).data(
						'processingName');
				if (res.Status == "Running") {
					$("#" + res.JobID).text("Running");
					getStatus(res);
				} else if (res.Status == "Succeeded") {
					$("#" + res.JobID).text("Completed");
					var JobID = res.JobID;
					getResult(res);
				} else if (res.Status == "Failed") {
					$("#" + res.JobID).text("Failed");
				}
			}
		});
	});
}

var getResult = function(data) {

	getXML("getResult", function(schema) {
		var JobID = {
			JobID : data.JobID
		};
		var schemaData = {
			schema : schemaModifier('getResult', schema, JobID)
		};
		$.ajax({
			type : 'GET',
			url : context + '/wps2/getResult.do',
			data : schemaData,
			success : function(res) {
				console.log(res);
				var data = JSON.parse(res.result);
				JobID = JobID.JobID;
				var layerInfo = {
					"processName" : $("#" + JobID).data('processingName'),
					"layerName" : data.Data
				};
				addResultLayer(layerInfo);
			}
		});
	});
}

var addResultLayer = function(data) {
	var geoserverURL = "http://113.198.80.56/geoserver/";
	var outputImageLayer = new ol.layer.Tile({
		title : data.layerName,
		source : new ol.source.TileWMS(({
			url : geoserverURL + 'wms',
			params : {
				'LAYERS' : data.processName + ":" + data.layerName,
				'TILED' : true
			},
			serverType : 'geoserver'
		}))
	});
	map.addLayer(outputImageLayer);
}

var initUI = function(){
	$('#algorithm_select_button').click(openAlrgorithmMenu);
	$('#process_status_button').click(openProcessStatus);
	generateAlrgorithmMenu();
	$('#alrgorithmMenu').on("click", "a", generateAlgorithmPopUpMenu);
	$('#executeButton').click(executeClickEvent);
	$('#cancelButton').click(cancelClickEvent);
}

/* Set UI Function */
var openAlrgorithmMenu = function() {
    $('#alrgorithmMenu').css('width', '25%');
}

var closeAlrgorithmMenu = function() {
    $('#alrgorithmMenu').css('width', '0%');
}

var openProcessStatus = function() {
    $('#processStatus').css('width', '25%');
}

var closeProcessStatus = function() {
    $('#processStatus').css('width', '0%');
}

$(document).ready(function() {
	initMap();
	initUI();
});
