package com.wps.service.impl;

import java.io.IOException;
import java.io.StringReader;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;


@Service
public class WPSServiceImp {
	
	@Autowired
	ZOOConnection zooCGI;
	
	public String getCapabilities(String schema){
		JSONObject resultJSON = null;
		
		String result = zooCGI.requestCGI(schema);
		InputSource is = new InputSource(new StringReader(result));
		Document doc = null;
		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			resultJSON = generateJSONObjectbyResultData(doc, "Identifier");
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//make xml
		
		return resultJSON.toString();
		
	}
	public String describeProcess(String schema) {
		String result = zooCGI.requestCGI(schema);
		InputSource is = new InputSource(new StringReader(result));
		Document doc;
		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			JSONObject tempJSON = generateJSONObjectbyResultData(doc, "Identifier");
			JSONArray tempJArray = (JSONArray) tempJSON.get("result");
			tempJArray.remove(0);
			tempJArray.remove(tempJArray.length()-1);
			return tempJArray.toString();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//make xml
		return null;
	}
	public String getResult(String schema) {
		String result = zooCGI.requestCGI(schema);

		JSONArray returnData = null;
		JSONObject returnJO = null;
		InputSource is = new InputSource(new StringReader(result));
		Document doc;
		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			returnData = generateJSONObjectbyResultData(doc, "Data").getJSONArray("result");
			JSONObject Datajo = ((JSONObject) returnData.get(0));
			
			returnJO = new JSONObject();
			returnJO.put("Data", Datajo.get("Data"));
			return returnJO.toString();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//make xml
		
		return null;
		
	}
	public String getStatus(String schema) {
		JSONObject returnJO = null;
		JSONArray returnJID = null;
		JSONArray returnStatus = null;
		
		
		
		String result = zooCGI.requestCGI(schema);
		InputSource is = new InputSource(new StringReader(result));
		Document doc;
		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			returnJID = generateJSONObjectbyResultData(doc, "JobID").getJSONArray("result");
			returnStatus = generateJSONObjectbyResultData(doc, "Status").getJSONArray("result");

			JSONObject JIDjo = ((JSONObject) returnJID.get(0));
			JSONObject Statusjo = ((JSONObject) returnStatus.get(0));
			
			returnJO = new JSONObject();
			returnJO.put("JobID", JIDjo.get("JobID"));
			returnJO.put("Status", Statusjo.get("Status"));
			
			return returnJO.toString();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//make xml
		
		
		return null;
		
	}
	public String execute(String schema) {
		String result = zooCGI.requestCGI(schema);
		InputSource is = new InputSource(new StringReader(result));
		Document doc;
		try {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(is);
			JSONArray returnJID = generateJSONObjectbyResultData(doc, "JobID").getJSONArray("result");
			JSONObject JIDjo = ((JSONObject) returnJID.get(0));
			JSONObject returnJO = new JSONObject();
			returnJO.put("JobID", JIDjo.get("JobID"));
			return returnJO.toString();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}//make xml
		
		return null;
		
	}
	

	public JSONObject generateJSONObjectbyResultData(Document doc, String key) {

		JSONObject result = new JSONObject();
		JSONArray list = new JSONArray();

		try {
			XPath xpath = XPathFactory.newInstance().newXPath();
			String expression = "//*/" + key;
			NodeList cols = (NodeList) xpath.compile(expression).evaluate(doc, XPathConstants.NODESET);

			for (int i = 0; i < cols.getLength(); i++) {
				JSONObject idx = new JSONObject();
				String value = cols.item(i).getTextContent();
				idx.put(key, value);
				list.put(idx);
			}
			result.put("result", list);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

} 