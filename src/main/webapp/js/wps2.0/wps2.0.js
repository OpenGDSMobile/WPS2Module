
/*
 * 
 * successFunction -> function parameter
 * successFunction(data)
 * data -> data.result
 * data is not JSON Object change to JSON Object using JSON.parse();
 * 
 * */
		function getCapabilitiesForProcessList(successFunction) {	

			$.ajax({
						type : "POST",
						url : './schema/getCapabilities.xml',
						contentType : 'text/xml',
						dataType : 'text',
						success : function(schema) {
							$.ajax({
										type : "POST",
										url : "/mobile/wps/getCapabilities.do",
										contentType : 'application/json;charset=UTF-8',
										dataType : 'json',
										data : schema,
										success : function(data){
											if(successFunction == null){
												successFunction = function(data){
													console.log(data.result);
												}
												successFunction(data);
											}else{
												successFunction(data);
											}
										},
										error : function(e) {
											console.log(e);
											alert("error2");
										}
									});
						},
						error : function(e) {
							console.log(e);
							alert("error1");
						}
					});
		}

		function describeProcess(identifier, successFunction) {//JSONObject	

			console.log(JSON.stringify(identifier));
			$.ajax({
						type : "POST",
						url : './schema/describeProcess.xml',
						contentType : 'text/xml',
						dataType : 'text',
						success : function(schema) {
							
							$.ajax({
										type : "POST",
										url : "/mobile/wps/describeProcess.do",
										contentType : 'application/json;charset=UTF-8',
										dataType : 'json',
										data : schemaModifier('describeProcess', schema, identifier),
										success : function(data){
											if(successFunction == null){
												successFunction = function(data){
													console.log(data.result);
												}
												successFunction(data);
											}else{
												successFunction(data);
											}
										},
										error : function(e) {
											console.log(e);
											alert("error2");
										}
									});
						},
						error : function(e) {
							console.log(e);
							alert("error1");
						}
					});

		}

		function execute(paramDataList, successFunction) {

			$.ajax({
						type : "POST",
						url : './schema/execute.xml',
						contentType : 'text/xml',
						dataType : 'text',
						success : function(schema) {
     							$.ajax({
										type : "POST",
										url : "/mobile/wps/execute.do",
										contentType : 'application/json;charset=UTF-8',
										dataType : 'json',
										data : schemaModifier('execute', schema, paramDataList),
										success : function(data){
											if(successFunction == null){
												successFunction = function(data){
													console.log(data.result);
												}
												successFunction(data);
											}else{
												successFunction(data);
											}
										},
										error : function(e) {
											console.log(e);
											alert("error2");
										}
									}); 
						},
						error : function(e) {
							console.log(e);
							alert("error1");
						}
					});
		}

		function getResult(jobID, successFunction) {

			$.ajax({
						type : "POST",
						url : './schema/getResult.xml',
						contentType : 'text/xml',
						dataType : 'text',
						success : function(schema) {
     							$.ajax({
										type : "POST",
										url : "/mobile/wps/getResult.do",
										contentType : 'application/json;charset=UTF-8',
										dataType : 'json',
										data : schemaModifier('getResult', schema, jobID),
										success : function(data){
											if(successFunction == null){
												successFunction = function(data){
													console.log(data.result);
												}
												successFunction(data);
											}else{
												successFunction(data);
											}
										},
										error : function(e) {
											console.log(e);
											alert("error2");
										}
									}); 
						},
						error : function(e) {
							console.log(e);
							alert("error1");
						}
					});
		}		
		
		function getStatus(jobID, successFunction) {

			$.ajax({
						type : "POST",
						url : './schema/getStatus.xml',
						contentType : 'text/xml',
						dataType : 'text',
						success : function(schema) {
     							$.ajax({
										type : "POST",
										url : "/mobile/wps/getStatus.do",
										contentType : 'application/json;charset=UTF-8',
										dataType : 'json',
										data : schemaModifier('getStatus', schema, jobID),
										success : function(data){
											if(successFunction == null){
												successFunction = function(data){
													console.log(data.result);
												}
												successFunction(data);
											}else{
												successFunction(data);
											}
										},
										error : function(e) {
											console.log(e);
											alert("error2");
										}
									}); 
						},
						error : function(e) {
							console.log(e);
							alert("error1");
						}
					});
		}		
		
		function schemaModifier(service ,schema, addNodeList) {
			if (window.DOMParser) {
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(schema, "text/xml");
			} else // Internet Explorer
			{
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(schema);
			}
			
			if(service == 'describeProcess'){
				$.each(addNodeList, function(key, value) {
					$.each(value, function(key, value){
						//console.log(key + ":" + value);
						var newNode = xmlDoc.createElement('Identifier');
						var newValue = xmlDoc.createTextNode(value);
						newNode.appendChild(newValue);
						xmlDoc.documentElement.appendChild(newNode);
						});
					});
			}
			else if(service == 'execute'){
				//console.log(key + ":" + value);
				var newNode = xmlDoc.createElement('Identifier');
				var newValue = xmlDoc.createTextNode(addNodeList.identifier);
				newNode.appendChild(newValue);
				xmlDoc.documentElement.appendChild(newNode);
				
				$.each(addNodeList.inputList, function(key, value) {
						var newInputNode = xmlDoc.createElement('wps:Input');//add node
						var newIdAtt = xmlDoc.createAttribute('id');//add attribute
						newIdAtt.nodeValue = value.id;//set attribute
						newInputNode.setAttributeNode(newIdAtt);
						
						var newDataNode = xmlDoc.createElement('wps:Data');//add node
						var newValue = xmlDoc.createTextNode(value.data);
						newDataNode.appendChild(newValue);
						newInputNode.appendChild(newDataNode);

						xmlDoc.documentElement.appendChild(newInputNode);
					});
				
 				var newOutputNode = xmlDoc.createElement('wps:Output');//add node
				var newOutputIdAtt = xmlDoc.createAttribute('id');//add attribute
				newOutputIdAtt.nodeValue = 'Result';//set attribute
				newOutputNode.setAttributeNode(newOutputIdAtt);
/* 				var newOutputTransmissionAtt = xmlDoc.createAttribute('transmission');//add attribute
				newOutputTransmissionAtt.nodeValue = 'reference';//set attribute
				newOutputNode.setAttributeNode(newOutputTransmissionAtt); 
 */				
				xmlDoc.documentElement.appendChild(newOutputNode); 
			}
			else if(service == 'getResult' || service == 'getStatus'){
						console.log(addNodeList);
						var newNode = xmlDoc.createElement('wps:JobID');
						var newValue = xmlDoc.createTextNode(addNodeList.JobID);
						newNode.appendChild(newValue);
						xmlDoc.documentElement.appendChild(newNode);
			}
			console.log(xmlDoc);
			var newSchema = (new XMLSerializer()).serializeToString(xmlDoc);
			return newSchema;
		}