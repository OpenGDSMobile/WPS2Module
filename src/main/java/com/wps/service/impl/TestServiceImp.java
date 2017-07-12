package com.wps.service.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TestServiceImp {
	
	@Autowired
	TestDAO testDAO;
	
	public String execute(JSONObject InputJson){
		
		String result = testDAO.requestCGI(InputJson);
		return result;
	}

} 