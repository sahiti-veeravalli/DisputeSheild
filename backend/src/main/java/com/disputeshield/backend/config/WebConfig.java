package com.disputeshield.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

/**
 * Allows cross-origin requests from the frontend Vite / Nginx dev and production servers.
 * Configurable via DISPUTESHIELD_CORS_ORIGINS with fallback patterns for localhost on any port.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${disputeshield.cors-origins:http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:8080,http://localhost}")
    private String corsOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> patterns = new ArrayList<>();
        patterns.add("http://localhost:*");
        patterns.add("http://127.0.0.1:*");
        patterns.add("http://localhost");
        patterns.add("http://127.0.0.1");
        patterns.add("https://*.vercel.app");
        patterns.add("https://*.netlify.app");
        patterns.add("https://*.onrender.com");

        if (corsOrigins != null && !corsOrigins.isBlank()) {
            for (String o : corsOrigins.split(",")) {
                String trimmed = o.trim();
                if (!trimmed.isEmpty() && !patterns.contains(trimmed)) {
                    patterns.add(trimmed);
                }
            }
        }

        registry.addMapping("/api/**")
                .allowedOriginPatterns(patterns.toArray(new String[0]))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders("*");
    }
}

