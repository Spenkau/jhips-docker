package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Category;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    @Query("select category from Category category where category.owner.login = ?#{authentication.name}")
    List<Category> findByOwnerIsCurrentUser();
}
