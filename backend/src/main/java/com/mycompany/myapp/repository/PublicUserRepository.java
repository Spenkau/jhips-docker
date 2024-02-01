package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PublicUser;
import com.mycompany.myapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PublicUserRepository extends JpaRepository<PublicUser, Long> {
    Optional<PublicUser> findOneByLogin(String login);
}
