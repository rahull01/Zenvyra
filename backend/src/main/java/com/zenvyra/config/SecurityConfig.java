package com.zenvyra.config;

import com.zenvyra.security.JwtAuthenticationFilter;
import com.zenvyra.security.ApiKeyAuthenticationFilter;
import com.zenvyra.security.OAuth2SuccessHandler;
import com.zenvyra.security.RateLimitFilter;
import com.zenvyra.security.RequestCorrelationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final ApiKeyAuthenticationFilter apiKeyAuthenticationFilter;
    private final RateLimitFilter rateLimitFilter;
    private final UserDetailsService userDetailsService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final RequestCorrelationFilter requestCorrelationFilter;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${cors.allowed-origins:http://localhost:3000}")
    private String corsAllowedOrigins;

    @Value("${app.security.hsts-enabled:false}")
    private boolean hstsEnabled;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();
        csrfRequestHandler.setCsrfRequestAttributeName("_csrf");

        http
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(csrfRequestHandler)
                        // CSRF is enforced for every state-changing authenticated request because the SPA
                        // stores the JWT in a cookie that the browser will happily attach to cross-origin
                        // form submissions. The three groups below are the documented exceptions:
                        //   1. /auth/**           - unauthenticated; the user has no session/CSRF cookie yet,
                        //                           so CSRF cannot be checked at this layer.
                        //   2. /dodo/webhooks/**, /webhooks/payment, /payments/dodo-webhook
                        //                         - third-party payment providers; they authenticate by
                        //                           signature, not by a browser-held CSRF cookie.
                        //   3. /scan/free, /scan/leads, /consent/log, /consent/audit-log, /consent/sync
                        //                         - public fire-and-forget endpoints (scanners and the
                        //                           consent banner) called from third-party scripts that
                        //                           do not carry a CSRF cookie. They are protected by CORS
                        //                           origin checks and per-IP rate limits instead of CSRF.
                        .ignoringRequestMatchers(
                                new AntPathRequestMatcher("/auth/signup", "POST"),
                                new AntPathRequestMatcher("/auth/login", "POST"),
                                new AntPathRequestMatcher("/auth/refresh", "POST"),
                                new AntPathRequestMatcher("/auth/forgot-password", "POST"),
                                new AntPathRequestMatcher("/auth/send-verification", "POST"),
                                new AntPathRequestMatcher("/auth/verify-email", "POST"),
                                new AntPathRequestMatcher("/auth/reset-password", "POST"),
                                new AntPathRequestMatcher("/dodo/webhooks/**", "POST"),
                                new AntPathRequestMatcher("/webhooks/payment", "POST"),
                                new AntPathRequestMatcher("/payments/dodo-webhook", "POST"),
                                new AntPathRequestMatcher("/scan/free", "POST"),
                                new AntPathRequestMatcher("/scan/leads", "POST"),
                                new AntPathRequestMatcher("/consent/log", "POST"),
                                new AntPathRequestMatcher("/consent/audit-log", "POST"),
                                new AntPathRequestMatcher("/consent/sync", "POST")
                        ))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> {
                    headers.contentSecurityPolicy(csp -> csp
                            .policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'"));
                    headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::deny);
                    if (hstsEnabled) {
                        headers.httpStrictTransportSecurity(hsts -> hsts
                                .maxAgeInSeconds(31536000)
                                .includeSubDomains(true));
                    }
                })
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        .requestMatchers("/login/oauth2/**").permitAll()
                        // Public lookup of a team-invite by token so the
                        // accept-invite page can render before sign-in.
                        // Accept/revoke still require authentication.
                        .requestMatchers(HttpMethod.GET, "/team/invite/*").permitAll()
                        .requestMatchers("/verify/**").permitAll()
                        .requestMatchers("/badge/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/csrf").permitAll()
                        .requestMatchers(HttpMethod.POST, "/dodo/webhooks/**", "/webhooks/payment", "/payments/dodo-webhook").permitAll()
                        .requestMatchers(HttpMethod.POST, "/scan/free").permitAll()
                        .requestMatchers(HttpMethod.POST, "/scan/leads").permitAll()
                        .requestMatchers("/scan/free").permitAll()
                        .requestMatchers("/health", "/health/ready").permitAll()
                        .requestMatchers("/banners/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/consent/log", "/consent/audit-log", "/consent/sync").permitAll()
                        .requestMatchers(HttpMethod.GET, "/consent/sync").permitAll()
                        .requestMatchers(HttpMethod.GET, "/policies/public/**").permitAll()

                        .requestMatchers("/admin/ops/**").hasRole("ADMIN")
                        .requestMatchers("/dashboard/**").authenticated()
                        .requestMatchers("/websites/**").authenticated()
                        .requestMatchers("/policies/**").authenticated()
                        .requestMatchers("/monitoring/**").authenticated()
                        .requestMatchers("/competitors/**").authenticated()
                        .requestMatchers("/agency/**").authenticated()
                        .requestMatchers("/ai-act/**").authenticated()
                        .requestMatchers("/reports/**").authenticated()
                        .requestMatchers("/team/**").authenticated()
                        .requestMatchers("/subscription/**").authenticated()
                        .requestMatchers("/setup-package/**").authenticated()
                        .requestMatchers("/developer/**").authenticated()
                        .requestMatchers("/v1/external/**").authenticated()

                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2SuccessHandler))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(requestCorrelationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(apiKeyAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(rateLimitFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> allowedOrigins = new java.util.ArrayList<>(
                CorsOriginGuard.parseAndValidate(corsAllowedOrigins, environment));

        if (!allowedOrigins.contains(frontendUrl)) {
            allowedOrigins.add(frontendUrl);
        }

        if (allowedOrigins.contains("*")) {
            configuration.setAllowedOriginPatterns(allowedOrigins);
        } else {
            configuration.setAllowedOrigins(allowedOrigins);
        }
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "X-Api-Key",
                "X-Correlation-Id",
                "X-CSRF-TOKEN",
                "X-XSRF-TOKEN",
                "X-CSRF-Intent"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
