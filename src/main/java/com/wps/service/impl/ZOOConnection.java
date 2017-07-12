package com.wps.service.impl;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL; 
import org.springframework.stereotype.Repository;


@Repository
public class ZOOConnection {
	
	static final String ZOO_URL = "http://113.198.80.56/cgi-bin/zoo_loader.cgi";
	//static final String ZOO_URL = "http://113.198.80.8:8002/cgi-bin/zoo_loader.cgi";
	//static final String ZOO_URL = "http://113.198.80.8:8004/cgi-bin/zoo_loader.cgi";
	
	public String requestCGI(String schema) {
		HttpURLConnection connection = null;
		OutputStream os = null;
		String resultXML = "";
		
		try{
			URL url = new URL(ZOO_URL);
			connection = (HttpURLConnection) url.openConnection();
			connection.setDoOutput(true);
			connection.setRequestMethod("POST");
			connection.setRequestProperty("Content-Type", "application/xml");
			os = connection.getOutputStream();
			os.write(schema.getBytes("UTF-8"));
			os.flush();
			os.close();
			
			// 결과값 수신
			int rc = connection.getResponseCode();
			if (rc == 200) {

				InputStreamReader in = new InputStreamReader(connection.getInputStream(), "UTF-8");
				BufferedReader br = new BufferedReader(in);
				String strLine;
				while ((strLine = br.readLine()) != null) {
					resultXML = resultXML.concat(strLine);
				}
				System.out.println(resultXML);
				return resultXML;

			} else {
				System.out.println("http response code error: " + rc + "\n");
			}
		}catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;		
	}

}
