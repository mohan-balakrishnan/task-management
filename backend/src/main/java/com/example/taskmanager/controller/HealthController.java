package com.example.taskmanager.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/status")
    public Map<String, String> getStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "OK");
        status.put("message", "Task Manager Backend is running successfully!");
        status.put("timestamp", java.time.Instant.now().toString());
        return status;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Task Manager Pro Backend! 🚀";
    }
}