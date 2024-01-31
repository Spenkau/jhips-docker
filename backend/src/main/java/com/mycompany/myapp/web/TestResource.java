package com.mycompany.myapp.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestResource {

    @GetMapping("/api/test")
    public ResponseEntity<String> Test() {
        return ResponseEntity.ok().body("{\"res\": \"test was successfully\"}");
    }
}
