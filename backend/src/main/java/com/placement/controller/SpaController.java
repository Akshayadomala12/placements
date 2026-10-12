package com.placement.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        String uri = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        // Do not forward API endpoints or database console
        if (uri != null && (uri.startsWith("/api") || uri.startsWith("/h2-console"))) {
            return null;
        }
        // Forward SPA browser routing to index.html
        return "forward:/index.html";
    }
}
