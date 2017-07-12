var map;
var dragBox;

function initMap() {
	map = new ol.Map({
		target : 'map',
		layers : [ new ol.layer.Tile({
			source : new ol.source.OSM()
		}) ],
		view : new ol.View({
			center : ol.proj.fromLonLat([ 128.613730, 38.198097 ]),
			// center : ol.proj.fromLonLat([ 127.3, 36.4 ]),// Sejong
			zoom : 12
		})
	});

	var indexImageLayer = new ol.layer.Tile({
		title : 'index',
		source : new ol.source.TileWMS(({
			// url : 'http://113.198.80.8:5052/geoserver/wms',
			url : 'http://113.198.80.56/geoserver/wms',
			params : {
				'LAYERS' : 'index:LC81150342016165LGN00_RGB',
				// 'LAYERS' : 'index:LC81150342016165LGN00_RGB_jpg',
				// 'LAYERS' : 'index:kompsat2_10801272_epsg3857'.
				'TILED' : true
			},
			serverType : 'geoserver'
		}))
	});
	map.addLayer(indexImageLayer);
}

var initAlrgorithmMenuModalView = function() {

	var modal = document.getElementById('selectAlgorithmModal');
	generateAlrgorithmMenu();
	$('#selectBtn').click(function() {
		$('#selectAlgorithmModal').css('display', 'block');
		$('#notice').css('display', 'none');
	})

	$('#closeSelectMenu').click(function() {
		$('#selectAlgorithmModal').css('display', 'none');
	})

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
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
							$("#modalBody").append(
									'<li value="' + AlgorithmName + '">'
											+ ViewAlgorithmName + '</li>');
						});
			}
		});
	});
}

var generateAlgorithmPopUpMenu = function() {
	var indentifierValue = $(this).attr('value');
	$('#selectAlgorithmModal').css('display', 'none');
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

	if (typeof (dragBox) == 'undefined') {
		dragBox = new RectangularDraw(map);
		$('#notice').css('display', 'block');
		dragBox.getInteractionObj().on('boxend', dragBoxEndEvent);
	} else {
		dragBox.drawFlag(true);
		$('#notice').css('display', 'block');
		dragBox.getInteractionObj().on('boxend', dragBoxEndEvent);

	}
}

var dragBoxEndEvent = function() {
	var ext = dragBox.getExtent('EPSG:3857');
	console.log(ext);
	$('#Latitude_Min').val(ext[1]);
	$('#Latitude_Max').val(ext[3]);
	$('#Longitude_Min').val(ext[0]);
	$('#Longitude_Max').val(ext[2]);

	dragBox.drawFlag(false);
	$('#notice').css('display', 'none');
	$('#paramModal').css('display', 'block');

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
}

var execute = function(paramDataList) {
	var modal = $('#paramModal');
	var statusList = $('#statusSlideList');
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
						statusList.append('<div class="status-layer1">'
								+ processingAlgorithm.replace('_', '&nbsp')
								+ ' : </div>');
						statusList.append('<div id=' + data.JobID + '>'
								+ data.Status + '</div>');
						$("#" + data.JobID).attr("class", "status-layer2");
						$("#" + data.JobID).data("processingName", processingAlgorithm);
						openNav();
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
	// var geoserverURL = "http://113.198.80.8:8004/geoserver/";
	// var geoserverURL = "http://113.198.80.8:5052/geoserver/";
	console.log(data);
	console.log(data.processName + ":" + data.layerName);

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

var openNav = function() {
	$('#statusSlideList').css('width', '20%');
}

var closeNav = function closeNav() {
	$('#statusSlideList').css('width', '0%');
}

var noneWPSProcessingEvent = function() {/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	var paramDataList;
	var identifier = $(".header").attr('value');
	var inputList = {};
	var validate = false;

	$('input').each(function(index) {
		if ($(this).val() == '') {
			alert($(this).attr('id') + "has no value");
			validate = true;
			return false;
		}
		var keyname = $(this).attr('id');
		var data = $(this).val();
		inputList[keyname] = data;
	});

	console.log(inputList);
	
	if (validate) {
		return;
	}
	var geoserverURL = "http://113.198.80.56/geoserver/";
	$.ajax({
		url : context + '/wps2/none_WPS_Service.do',
		type : "GET",
		data: inputList,
		success : function(response) {
			console.log(response);
			response = JSON.parse(response.result);
			console.log(response);
			var outputImageLayer = new ol.layer.Tile({
				title : response.data,
				source : new ol.source.TileWMS(({
					url : geoserverURL + 'wms',
					params : {
						'LAYERS' : "Cloud_Detection:" + response.data,
						'TILED' : true
					},
					serverType : 'geoserver'
				}))
			});
			map.addLayer(outputImageLayer);
		}
	});
}

$(document).ready(function() {
	initMap();
	initAlrgorithmMenuModalView();
	$('#selectAlgorithmModal').on("click", "li", generateAlgorithmPopUpMenu);
	$('#executeButton').click(executeClickEvent);
	$('#cancelButton').click(cancelClickEvent);
	$('#statusCheckButton').click(openNav);
	$('#closeStatusSlideList').click(closeNav);

	$('#testButton').click(noneWPSProcessingEvent);

});
