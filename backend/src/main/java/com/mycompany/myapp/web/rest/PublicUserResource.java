package com.mycompany.myapp.web.rest;
import com.mycompany.myapp.config.Constants;
import com.mycompany.myapp.domain.PublicUser;
import com.mycompany.myapp.service.PublicUserService;
import com.mycompany.myapp.service.dto.PublicUserDTO;
import jakarta.validation.constraints.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.jhipster.web.util.ResponseUtil;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class PublicUserResource {

    private final Logger log = LoggerFactory.getLogger(PublicUserResource.class);

    private final PublicUserService publicUserService;

    public PublicUserResource(PublicUserService publicUserService) {
        this.publicUserService = publicUserService;
    }

    @GetMapping("/{login}")
    public ResponseEntity<?> getUserByLogin(@PathVariable("login") @Pattern(regexp = Constants.LOGIN_REGEX) String login) {
        log.debug("REST request to get User : {}", login);

        Optional<PublicUser> publicUser = publicUserService.getUserByLogin(login);

        if (publicUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (publicUserService.isCurrentUser()) {
            return ResponseUtil.wrapOrNotFound(publicUser);
        } else {
            PublicUserDTO publicUserDTO = new PublicUserDTO(publicUser.get());
            return ResponseUtil.wrapOrNotFound(Optional.of(publicUserDTO));
        }
    }
}
