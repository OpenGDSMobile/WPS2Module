<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>WPS 2.0 Processing</title>

<script
	src="${pageContext.request.contextPath}/js/jquery/jquery-3.1.0.min.js"></script>
<script src="${pageContext.request.contextPath}/js/ol3/ol.js"></script>
<script src="${pageContext.request.contextPath}/js/wps2.0/WPS2.0_API.js"></script>
<script src="${pageContext.request.contextPath}/js/main/main_mobile.js"></script>
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/ol3/ol.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/customMobile.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/customW3schoolModalMobile.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/customW3schoolSlideMobile.css"
	type="text/css">
<script>
	var context = "${pageContext.request.contextPath}";
</script>
</head>

<body>
	<div id="map"></div>
	<div id="upper_button">
		<div id="algorithm_select_button"><h1>  Satellite Processing Algorithm
			Selection</h1></div>
		<div id="process_status_button"><h1>Process Status  </h1></div>
	</div>


	<div id="alrgorithmMenu" class="alrgorithmMenu">
		<x href="javascript:void(0)" class="closebtn" onclick="closeAlrgorithmMenu()">&times;</x>
	</div>

	<div id="processStatus" class="processStatus">
		<x href="javascript:void(0)" class="closebtn" onclick="closeProcessStatus()">&times;</x>
	</div>	
	
	<div id="paramModal" class="param-modal">
		<div class="param-modal-content">
			<div id='paramModalHeader' class="param-modal-header"></div>
			<div id='paramModalBody' class="param-modal-body">
				<div id='paramModalBody1' class="param-modal-body-1"></div>
				<div id='paramModalBody2' class="param-modal-body-2"></div>
			</div>
			<div id='paramModalFooter' class='param-modal-footer'>
				<div class='execute-button-div'>
					<a id='executeButton' class="execute-button">Execute</a>
				</div>
				<div class='cancel-button-div'>
					<a id='cancelButton' class="cancel-button">Cancel</a>
				</div>
<!-- 				<div class='test-button-div'>
					<a id='testButton' class="test-button">Test</a>
				</div> -->				
			</div>
		</div>
	</div>

</body>
</html>