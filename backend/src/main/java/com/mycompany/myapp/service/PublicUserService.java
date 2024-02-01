package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.PublicUser;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.PublicUserRepository;
import com.mycompany.myapp.service.dto.UserDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class PublicUserService {

    private final PublicUserRepository publicUserRepository;

    public PublicUserService(PublicUserRepository publicUserRepository) {
        this.publicUserRepository = publicUserRepository;
    }

    public Optional<PublicUser> getUserByLogin(String login) {
        return publicUserRepository.findOneByLogin(login);
    }
}
