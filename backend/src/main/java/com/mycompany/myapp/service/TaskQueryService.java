package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.*; // for static metamodels
import com.mycompany.myapp.domain.Task;
import com.mycompany.myapp.repository.TaskRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.criteria.TaskCriteria;
import com.mycompany.myapp.service.dto.TaskDTO;
import com.mycompany.myapp.service.mapper.TaskMapper;
import jakarta.persistence.criteria.JoinType;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;
import tech.jhipster.service.filter.StringFilter;

/**
 * Service for executing complex queries for {@link Task} entities in the database.
 * The main input is a {@link TaskCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link TaskDTO} or a {@link Page} of {@link TaskDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class TaskQueryService extends QueryService<Task> {

    private final Logger log = LoggerFactory.getLogger(TaskQueryService.class);

    private final TaskRepository taskRepository;

    private final TaskMapper taskMapper;

    public TaskQueryService(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    /**
     * Return a {@link Page} of {@link TaskDTO} which matches the criteria from the database.
     *
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page     The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<TaskDTO> findByCriteria(TaskCriteria criteria, Pageable page, String login) {
        log.debug("find by criteria : {}, page: {}", criteria, page);

        String resultLogin = getLogin(login);

        StringFilter ownerLoginFilter = new StringFilter();
        ownerLoginFilter.setEquals(resultLogin);
        criteria.setOwnerLogin(ownerLoginFilter);

        log.debug("ownerLogin {}", criteria.getOwnerLogin());
        final Specification<Task> specification = (createSpecification(criteria));
        return taskRepository.findAll(specification, page).map(taskMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TaskCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Task> specification = createSpecification(criteria);
        return taskRepository.count(specification);
    }

    protected String getLogin(String login) {
        if (login == null) {
            Optional<String> optionalLogin = SecurityUtils.getCurrentUserLogin();

            return optionalLogin.orElse("-1");

        } else {
            return login;
        }
    }

    /**
     * Function to convert {@link TaskCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Task>createSpecification(TaskCriteria criteria) {
        Specification<Task> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            if (criteria.getDistinct() != null) {
                specification = specification.and(distinct(criteria.getDistinct()));
            }
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Task_.id));
            }
            if (criteria.getTitle() != null) {
                specification = specification.and(buildStringSpecification(criteria.getTitle(), Task_.title));
            }
            if (criteria.getContent() != null) {
                specification = specification.and(buildStringSpecification(criteria.getContent(), Task_.content));
            }
            if (criteria.getPriorityId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPriorityId(), Task_.priorityId));
            }
            if (criteria.getStatusId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStatusId(), Task_.statusId));
            }
            if (criteria.getStartedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getStartedAt(), Task_.startedAt));
            }
            if (criteria.getFinishedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getFinishedAt(), Task_.finishedAt));
            }
            if (criteria.getOwnerId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getOwnerId(), root -> root.join(Task_.owner, JoinType.LEFT).get(User_.id))
                    );
            }
            if (criteria.getOwnerLogin() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getOwnerLogin(), root -> root.join(Task_.owner, JoinType.LEFT).get(User_.login))
                    );
            }
            if (criteria.getCategoryId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getCategoryId(), root -> root.join(Task_.category, JoinType.LEFT).get(Category_.id))
                    );
            }
            if (criteria.getTagsId() != null) {
                specification =
                    specification.and(buildSpecification(criteria.getTagsId(), root -> root.join(Task_.tags, JoinType.LEFT).get(Tag_.id)));
            }
        }
        return specification;
    }
}
