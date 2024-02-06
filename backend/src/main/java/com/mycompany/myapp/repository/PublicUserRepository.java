package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PublicUser;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Task entity.
 *
 * When extending this class, extend TaskRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface PublicUserRepository extends JpaRepository<PublicUser, Long>, JpaSpecificationExecutor<PublicUser> {

    Optional<PublicUser> findOneByLogin(String login);

}
