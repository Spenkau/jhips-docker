package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.*; // for static metamodels
import com.mycompany.myapp.domain.Task;
import com.mycompany.myapp.repository.PublicUserRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.criteria.PublicUserCriteria;
import com.mycompany.myapp.service.criteria.TaskCriteria;
import com.mycompany.myapp.service.dto.TaskDTO;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Task} entities in the database.
 * The main input is a {@link TaskCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link TaskDTO} or a {@link Page} of {@link TaskDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class PublicUserService extends QueryService<PublicUser> {

    private final Logger log = (Logger) LoggerFactory.getLogger(PublicUserService.class);

    private String login;

    private final PublicUserRepository publicUserRepository;


    public PublicUserService(PublicUserRepository publicUserRepository) {
        this.publicUserRepository = publicUserRepository;
    }

    /**
     * Return a {@link Page} of {@link TaskDTO} which matches the criteria from the database.
     *
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<PublicUser> findByCriteria(PublicUserCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<PublicUser> specification = (createSpecification(criteria));

        return publicUserRepository.findAll(specification);

    }

    @Transactional(readOnly = true)
    public Optional<PublicUser> getUserByLogin(String login) {
        this.login = login;
        return publicUserRepository.findOneByLogin(login);

    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(PublicUserCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<PublicUser> specification = createSpecification(criteria);
        return publicUserRepository.count(specification);
    }

    public Optional<String> getCurrentUsername() {
        Optional<String> username = (SecurityUtils.getCurrentUserLogin());
        log.debug("Username of current User: {}", username);
        return username;
    }

    public boolean isCurrentUser() {
        return this.getCurrentUsername().equals(Optional.of(this.login));
    }

    /**
     * Function to convert {@link PublicUserCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<PublicUser>createSpecification(PublicUserCriteria criteria) {
        Specification<PublicUser> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), PublicUser_.id));
            }
            if (criteria.getLogin() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLogin(), PublicUser_.login));
            }
        }
        return specification;
    }
}
