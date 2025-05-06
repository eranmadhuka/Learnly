package com.app.learnly.security;

import com.app.learnly.model.User;
import com.app.learnly.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.oauth2.redirectUri:http://localhost:5173/oauth2/redirect}")
    private String redirectUri;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        if (response.isCommitted()) {
            return;
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String pictureUrl = (String) attributes.get("picture");
        String provider = "google"; // This can be dynamic based on the provider
        String providerId = (String) attributes.get("sub");

        // Find existing user or create a new one
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User(email, name, pictureUrl, provider, providerId);
                    return userRepository.save(newUser);
                });

        // Update user information
        user.setName(name);
        user.setPicture(pictureUrl);
        userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getName(), user.getPicture());

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}