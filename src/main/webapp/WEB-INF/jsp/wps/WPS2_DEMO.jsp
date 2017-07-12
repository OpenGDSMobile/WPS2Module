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
<script src="${pageContext.request.contextPath}/js/main/main.js"></script>
<script
	src="${pageContext.request.contextPath}/js/util/ol3-RectangleDraw.js"></script>
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/ol3/ol.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/custom.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/customW3schoolModal.css"
	type="text/css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/custom/customW3schoolSlide.css"
	type="text/css">
<script>
	var context = "${pageContext.request.contextPath}";
</script>
</head>

<body>
	<div id='map'></div>
	<div id='notice'>
		<h2>Please Select Processing Area (Using Drag-and-Drop)</h2>
	</div>
	<div id='selectBtn'>
		<h2>Algorithm List</h2>
	</div>

	<div id="selectAlgorithmModal" class="modal">
		<!-- Modal content -->
		<div class="modal-content">
			<div class="modal-header">
				<span id = "closeSelectMenu" class="close">X</span>
				<h2>Algorithm Selection</h2>
			</div>
			<div id='modalBody' class="modal-body"></div>
		</div>
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
	<div id="statusCheckButton"><img src="${pageContext.request.contextPath}/image/list.png" width="50" height="50"></img></div>
	<div id="statusSlideList" class="sidenav">
		<span id="closeStatusSlideList" class="closebtn">X</span>
		<h1>Progressing Algorithm</h1>
	</div>

</body>
</html>