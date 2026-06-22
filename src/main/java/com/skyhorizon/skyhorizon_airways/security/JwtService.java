package com.skyhorizon.skyhorizon_airways.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "mysecretkeymysecretkeymysecretkeymysecretkey";

    private SecretKey getSigningKey() {

    return Keys.hmacShaKeyFor(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

    return extractClaim(token, Claims::getSubject);

    }

    public <T> T extractClaim(
        String token,
        Function<Claims, T> resolver) {

    Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return resolver.apply(claims);
    }

  public boolean isTokenValid(
        String token,
        String email) {

    return extractUsername(token).equals(email)
            && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

    return extractClaim(token, Claims::getExpiration)
            .before(new Date());

    }

}