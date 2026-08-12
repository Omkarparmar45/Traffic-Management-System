package com.traffic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application Class for Traffic Management System
 * 
 * This application monitors traffic rule violations including:
 * - Helmet detection for motorcycle riders
 * - Overloading detection (more than 2 persons on a two-wheeler)
 */
@SpringBootApplication
public class TrafficManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrafficManagementApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("Traffic Management System Started Successfully!");
        System.out.println("===========================================\n");
    }
}
