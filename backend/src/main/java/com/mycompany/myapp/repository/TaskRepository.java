package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Task;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Task entity.
 *
 * When extending this class, extend TaskRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface TaskRepository extends TaskRepositoryWithBagRelationships, JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @Query("select task from Task task where task.owner.login = ?#{authentication.name}")
    Page<Task> findByOwnerIsCurrentUser(Specification<Task> spec, Pageable pageable);

//    @Query("select task from Task task where task.owner.id = ?#{}")
//    Page<Task> findByOwnerId(Specification<Task> spec, Pageable pageable);

    default Optional<Task> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Task> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Task> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
