/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ccc.filters;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 *
 * @author Admin
 */
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    //Login, Thanh toán - 10 req/phút
    private Bucket createCriticalBucket() {
        return Bucket.builder().addLimit(Bandwidth.builder().capacity(10).refillGreedy(5, Duration.ofMinutes(1)).build())
                .addLimit(Bandwidth.builder().capacity(5).refillGreedy(5, Duration.ofSeconds(20)).build()).build();
    }

    //POST, PUT, DELETE - 20 req/phút
    private Bucket createWriteBucket() {
        return Bucket.builder().addLimit(Bandwidth.builder().capacity(20).refillGreedy(10, Duration.ofMinutes(1)).build()).build();
    }

    //GET - 100 req/phút
    private Bucket createReadBucket() {
        return Bucket.builder().addLimit(Bandwidth.builder().capacity(100).refillGreedy(20, Duration.ofMinutes(1)).build()).build();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String bucketKey;
        Bucket bucket;

        String uri = request.getRequestURI();
        String method = request.getMethod().toUpperCase();
        String clientId = resolveClientId(request);

        if (pathMatcher.match("/**/api/payment/**", uri)
                || pathMatcher.match("/**/api/login", uri) || pathMatcher.match("/**/api/login/", uri)
                || (pathMatcher.match("/**/api/secure/orders", uri) && method.equals("POST"))) {

            bucketKey = "CRITICAL_" + clientId;
            bucket = buckets.computeIfAbsent(bucketKey, k -> createCriticalBucket());
        } else if (method.equals("GET")) {
            bucketKey = "READ_" + clientId;
            bucket = buckets.computeIfAbsent(bucketKey, k -> createReadBucket());
        } else {
            bucketKey = "WRITE_" + clientId;
            bucket = buckets.computeIfAbsent(bucketKey, k -> createWriteBucket());
        }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"Lỗi 429: Too many Request!\"}");
        }
    }

    private String resolveClientId(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return "USER_" + auth.getName();
        }
        String ip = request.getHeader("X-Forwarded-For");
        return "IP_" + (ip != null && !ip.isEmpty() ? ip : request.getRemoteAddr());
    }

}
