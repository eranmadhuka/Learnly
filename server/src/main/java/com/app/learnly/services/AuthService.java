package com.app.learnly.services;

import com.app.learnly.models.User;
import com.app.learnly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class AuthService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // "google"
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");

        if (email == null || providerId == null) {
            throw new OAuth2AuthenticationException("Email or Provider ID not found for " + provider);
        }

        // Check if user exists by email
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Create new user
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPicture(picture);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setFollowers(new ArrayList<>());
            user.setFollowing(new ArrayList<>());
            user.setSavedPosts(new ArrayList<>());
        } else {
            // Update syncable fields for existing user
            user.setName(name);
            if (user.getPicture() == null || user.getPicture().isEmpty()) {
                user.setPicture(picture);
            }
            user.setProvider(provider);
            user.setProviderId(providerId);
        }

        userRepository.save(user);

        // Return OAuth2User for security context
        String nameAttributeKey = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        return new DefaultOAuth2User(
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                nameAttributeKey
        );
    }
}