package com.wps.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class PageController {
	
	@RequestMapping(value="/WPSProcessing.do")
	public String demo(){
		return "wps/WPS2_DEMO";
	}
	@RequestMapping(value="/WPSProcessing.mdo")
	public String demoMobile(){
		return "wps/WPS2_Mobile_DEMO";
	}
	

}
