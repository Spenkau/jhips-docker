package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Task;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class TaskRepositoryWithBagRelationshipsImpl implements TaskRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Task> fetchBagRelationships(Optional<Task> task) {
        return task.map(this::fetchTags);
    }

    @Override
    public Page<Task> fetchBagRelationships(Page<Task> tasks) {
        return new PageImpl<>(fetchBagRelationships(tasks.getContent()), tasks.getPageable(), tasks.getTotalElements());
    }

    @Override
    public List<Task> fetchBagRelationships(List<Task> tasks) {
        return Optional.of(tasks).map(this::fetchTags).orElse(Collections.emptyList());
    }

    Task fetchTags(Task result) {
        return entityManager
            .createQuery("select task from Task task left join fetch task.tags where task.id = :id", Task.class)
            .setParameter("id", result.getId())
            .getSingleResult();
    }

    List<Task> fetchTags(List<Task> tasks) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, tasks.size()).forEach(index -> order.put(tasks.get(index).getId(), index));
        List<Task> result = entityManager
            .createQuery("select task from Task task left join fetch task.tags where task in :tasks", Task.class)
            .setParameter("tasks", tasks)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
