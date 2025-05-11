package com.app.learnly.repository;

import com.app.learnly.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByProviderId(String providerId);
    Optional<User> findByEmail(String email);
    List<User> findByIdIn(List<String> ids);

    /**
     * Finds all users except the one with the specified provider ID.
     * @param providerId Provider ID to exclude
     * @return List of users
     */
    @Query("{ 'providerId': { $ne: ?0 } }")
    List<User> findByProviderIdNot(String providerId);

}