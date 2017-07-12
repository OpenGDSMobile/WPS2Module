package com.wps.api;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.wps.service.impl.TestServiceImp;
import com.wps.service.impl.WPSServiceImp;


@RestController
@RequestMapping("/wps2")
public class WPS2Controller {
	
	@Autowired
	WPSServiceImp service;
	@Autowired
	TestServiceImp test_service;
	
	@RequestMapping(value="/{name}.do", method = RequestMethod.GET)
	public Map<String, Object> wpsGet(@PathVariable("name") String name, HttpServletRequest request){

		Map<String, Object> message = new HashMap<String, Object>();
		
		String schema = request.getParameter("schema");

		schema = schema.replaceAll("&lt;", "\\<").replaceAll("&quot;", "\"").replaceAll("&gt;", "\\>");
		String result = "";
		
		if (name.equals("getCapabilities")) {
			result = service.getCapabilities(schema);						
		}else if (name.equals("describeProcess")) {
			result = service.describeProcess(schema);
		}else if (name.equals("getResult")) {
			result = service.getResult(schema);
		}else if (name.equals("getStatus")) {
			result = service.getStatus(schema);
			
		}	
		message.put("result", result);
		
		return message;
	}
	
	@RequestMapping(value="/execute.do", method = RequestMethod.POST)
	public Map<String, Object> execute(@RequestBody String schema){
		
		Map<String, Object> message = new HashMap<String, Object>();
		String result = service.execute(schema);
		message.put("result", result);
		return message;
	}

	@RequestMapping(value="/none_WPS_Service.do" , method = RequestMethod.GET)
	public Map<String, Object> CloudDetection(HttpServletRequest request){
		
		Map<String, Object> message = new HashMap<String, Object>();
		JSONObject InputJson = new JSONObject();
		InputJson.put("Longitude_Min", request.getParameter("Longitude_Min"));
		InputJson.put("Latitude_Min", request.getParameter("Latitude_Min"));
		InputJson.put("Longitude_Max", request.getParameter("Longitude_Max"));
		InputJson.put("Latitude_Max", request.getParameter("Latitude_Max"));
		InputJson.put("Threshold_Min", request.getParameter("Threshold_Min"));
		InputJson.put("Threshold_Max", request.getParameter("Threshold_Max"));

		String result = test_service.execute(InputJson);
		message.put("result", result);
		return message;
	}
}
