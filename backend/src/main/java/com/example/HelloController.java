package com.example;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Arrays;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "https://*.amplifyapp.com"})
public class HelloController {
    
    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Java Spring Boot Backend!";
    }
    
    @GetMapping("/api/countries")
    public List<String> getCountries() {
        return Arrays.asList("USA", "Canada", "UK", "Germany", "France", "Japan", "Australia");
    }
    
    @GetMapping("/api/states")
    public List<String> getStates() {
        return Arrays.asList("California", "Texas", "Florida", "New York", "Illinois", "Pennsylvania");
    }
}