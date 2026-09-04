package com.disputeshield.backend.config;

import com.disputeshield.backend.domain.Role;
import com.disputeshield.backend.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Service for generating, signing, parsing, and validating JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${disputeshield.jwt.secret:disputeshield-production-grade-jwt-secret-key-2026-safe-default-signature}") String secret,
            @Value("${disputeshield.jwt.expiration-ms:86400000}") long expirationMs) {
        this.signingKey = deriveSigningKey(secret);
        this.expirationMs = expirationMs;
    }

    private SecretKey deriveSigningKey(String rawSecret) {
        try {
            // Ensure at least 256-bit SHA-256 derived key for robust HMAC-SHA256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawSecret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm unavailable", e);
        }
    }

    public String generateToken(User user) {
        return generateToken(Map.of(
                "userId", user.getId(),
                "role", user.getRole().name()
        ), user.getEmail());
    }

    public String generateToken(Map<String, Object> extraClaims, String subject) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        Object userIdObj = claims.get("userId");
        if (userIdObj instanceof Number number) {
            return number.longValue();
        }
        return null;
    }

    public Role extractRole(String token) {
        Claims claims = extractAllClaims(token);
        String roleStr = (String) claims.get("role");
        if (roleStr != null) {
            try {
                return Role.valueOf(roleStr);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return null;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, String expectedEmail) {
        try {
            final String email = extractEmail(token);
            return (email.equalsIgnoreCase(expectedEmail)) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
