package com.mycompany.myapp.service;

import ch.qos.logback.classic.Logger;
import com.mycompany.myapp.domain.PublicUser;
import com.mycompany.myapp.repository.PublicUserRepository;
import com.mycompany.myapp.security.SecurityUtils;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PublicUserService {

    private final Logger log = (Logger) LoggerFactory.getLogger(PublicUserService.class);

    private String login;

    private final PublicUserRepository publicUserRepository;

    public PublicUserService(PublicUserRepository publicUserRepository) {
        this.publicUserRepository = publicUserRepository;
    }

    @Transactional(readOnly = true)
    public Optional<PublicUser> getUserByLogin(String login) {
        this.login = login;
        return publicUserRepository.findOneByLogin(login);

    }

    public Optional<String> getCurrentUsername() {
        Optional<String> username = (SecurityUtils.getCurrentUserLogin());
        log.debug("Username of current User: {}", username);
        return username;
    }

    public boolean isCurrentUser() {
        return this.getCurrentUsername().equals(Optional.of(this.login));
    }

}
