package com.placement.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
public class SpaController implements ErrorController {

    @RequestMapping("/error")
    public Object handleError(HttpServletRequest request) {
        String uri = (String) request.getAttribute("jakarta.servlet.error.request_uri");
        Integer status = (Integer) request.getAttribute("jakarta.servlet.error.status_code");

        // Do not forward API endpoints or database console - return JSON error
        if (uri != null && (uri.startsWith("/api") || uri.startsWith("/h2-console"))) {
            HttpStatus httpStatus = status != null ? HttpStatus.resolve(status) : HttpStatus.NOT_FOUND;
            if (httpStatus == null) httpStatus = HttpStatus.NOT_FOUND;
            return ResponseEntity.status(httpStatus).body(Map.of("error", "Endpoint not found: " + uri));
        }

        // Forward SPA browser routing to index.html
        return "forward:/index.html";
    }
}
