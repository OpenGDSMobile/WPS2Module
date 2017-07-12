package com.wps.service.impl;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL; 
import org.json.JSONObject;
import org.springframework.stereotype.Repository;


@Repository
public class TestDAO {
	
	static final String Measure_performance_URL = "http://113.198.80.56/cgi-bin/none_WPS_Service.py";
	
	public String requestCGI(JSONObject InputJson) {
        URL url = null;
        String paramData = InputJson.toString();
        String result = "";

		try{
			url = new URL(Measure_performance_URL + "?paramData=" + paramData);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			
			int responseCode = con.getResponseCode();
			System.out.println("\nSending 'GET' request to URL : " + url);
			System.out.println("Response Code : " + responseCode);

			BufferedReader in = new BufferedReader(
			        new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			//print result
			result = response.toString();			
			
			
		}catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return result;
	
}
}
