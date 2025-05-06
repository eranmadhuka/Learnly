//package com.app.learnly.config;
//
//import com.app.learnly.security.JwtAuthenticationFilter;
//import com.app.learnly.security.OAuth2AuthenticationSuccessHandler;
//import com.app.learnly.service.AuthService;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.authentication.logout.LogoutHandler;
//import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.messaging.simp.SimpMessageType;
//
//import java.util.List;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
//public class SecurityConfig {
//
//    @Autowired
//    private AuthService authService;
//
//    @Autowired
//    private JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @Autowired
//    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
//
//    @Value("${frontend.url:http://localhost:5173}")
//    private String frontendUrl;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
//                .csrf(csrf -> csrf
//                        .ignoringRequestMatchers("/group-chat/**", "/api/groups/**")
//                        .disable()) // Disable CSRF for token-based auth
//                .sessionManagement(session -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless for JWT
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/login", "/error", "/api/auth/user", "/group-chat/**", "/oauth2/authorization/**").permitAll()
//                        .requestMatchers("/user/profile", "/api/users/**", "/api/groups/**", "/api/plans/**", "/api/progress/**").authenticated()
//                        .anyRequest().authenticated()
//                )
//                .oauth2Login(oauth2 -> oauth2
//                        .userInfoEndpoint(userInfo -> userInfo.userService(authService))
//                        .successHandler(oAuth2AuthenticationSuccessHandler)
//                        .failureUrl(frontendUrl + "/login?error=true")
//                )
//                .logout(logout -> logout
//                        .logoutUrl("/logout")
//                        .clearAuthentication(true)
//                        .addLogoutHandler(logoutHandler())
//                        .logoutSuccessHandler((request, response, authentication) -> {
//                            response.setStatus(HttpServletResponse.SC_OK);
//                            response.getWriter().write("Logout successful");
//                        })
//                        .permitAll()
//                )
//                .exceptionHandling(exception -> exception
//                        .authenticationEntryPoint((request, response, authException) -> {
//                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
//                        })
//                )
//                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter
//
//        return http.build();
//    }
//
//    @Bean
//    public MessageMatcherDelegatingAuthorizationManager.Builder messageAuthorization() {
//        return MessageMatcherDelegatingAuthorizationManager.builder()
//                .simpTypeMatchers(SimpMessageType.CONNECT, SimpMessageType.HEARTBEAT, SimpMessageType.DISCONNECT).permitAll()
//                .simpDestMatchers("/app/**", "/topic/**").authenticated()
//                .anyMessage().denyAll();
//    }
//
//    @Bean
//    public LogoutHandler logoutHandler() {
//        return new SecurityContextLogoutHandler();
//    }
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of(frontendUrl));
//        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setAllowCredentials(true);
//        configuration.setExposedHeaders(List.of("Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//}