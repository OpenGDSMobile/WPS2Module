	
	function getXML(name, callBack) {
		$.ajax({
			url : context + '/schema/' + name + '.xml',
			contextType : 'text/xml',
			dataType : 'text',
			success : function(schema) {
				callBack(schema);
			}
		});
	};	

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
/* 			var newOutputTransmissionAtt = xmlDoc.createAttribute('transmission');//add attribute
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