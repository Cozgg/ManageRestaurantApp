/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.utils;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.util.Date;

/**
 *
 * @author Admin
 */
public class JwtUtils {
    // SECRET nên được lưu bằng biến môi trường,
    private static final String SECRET = "12345678901234567890123456789012"; // 32 ký tự (AES key)
    private static final long ACCESS_EXPIRATION_MS = 86400000; // 1 ngày
    private static final long REFRESH_EXPIRATION_MS = 604800000; // 7 ngày

    public static String generateToken(String username, String role) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("role", role)
                .claim("type", "ACCESS")
                .subject(username)
                .expirationTime(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_MS))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }
    
    public static String generateRefreshToken(String username) throws Exception {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .claim("type", "REFRESH")
                .subject(username)
                .expirationTime(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_MS))
                .issueTime(new Date())
                .build();

        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader(JWSAlgorithm.HS256),
                claimsSet
        );

        signedJWT.sign(signer);

        return signedJWT.serialize();
    }

    public static String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            Date expiration = claims.getExpirationTime();
            String type = claims.getStringClaim("type");
            if (expiration.after(new Date()) && "ACCESS".equals(type)) {
                return claims.getSubject();
            }
        }
        return null;
    }
    
    public static String validateRefreshTokenAndGetUsername(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET);

        if (signedJWT.verify(verifier)) {
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            Date expiration = claims.getExpirationTime();
            String type = claims.getStringClaim("type");
            if (expiration.after(new Date()) && "REFRESH".equals(type)) {
                return claims.getSubject();
            }
        }
        return null;
    }
    
    public static String getRoleFromToken(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet().getStringClaim("role"); 
    }
}
