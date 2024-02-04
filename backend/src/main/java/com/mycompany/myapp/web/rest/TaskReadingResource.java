package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.TaskQueryService;
import com.mycompany.myapp.service.criteria.TaskCriteria;
import com.mycompany.myapp.service.dto.TaskDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.web.util.PaginationUtil;

import java.util.List;

@RestController
@RequestMapping("/api/user/{userId}/tasks")
public class TaskReadingResource {
    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    public TaskQueryService taskQueryService;

    public TaskReadingResource(TaskQueryService taskQueryService) {
        this.taskQueryService = taskQueryService;
    }


}
