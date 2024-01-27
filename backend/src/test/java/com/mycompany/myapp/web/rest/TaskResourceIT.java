package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Category;
import com.mycompany.myapp.domain.Tag;
import com.mycompany.myapp.domain.Task;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.TaskRepository;
import com.mycompany.myapp.service.TaskService;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TaskResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TaskResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRIORITY_ID = 1;
    private static final Integer UPDATED_PRIORITY_ID = 2;
    private static final Integer SMALLER_PRIORITY_ID = 1 - 1;

    private static final Integer DEFAULT_STATUS_ID = 1;
    private static final Integer UPDATED_STATUS_ID = 2;
    private static final Integer SMALLER_STATUS_ID = 1 - 1;

    private static final LocalDate DEFAULT_STARTED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_STARTED_AT = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_STARTED_AT = LocalDate.ofEpochDay(-1L);

    private static final LocalDate DEFAULT_FINISHED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_FINISHED_AT = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_FINISHED_AT = LocalDate.ofEpochDay(-1L);

    private static final String ENTITY_API_URL = "/api/tasks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TaskRepository taskRepository;

    @Mock
    private TaskRepository taskRepositoryMock;

    @Mock
    private TaskService taskServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaskMockMvc;

    private Task task;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Task createEntity(EntityManager em) {
        Task task = new Task()
            .title(DEFAULT_TITLE)
            .content(DEFAULT_CONTENT)
            .priorityId(DEFAULT_PRIORITY_ID)
            .statusId(DEFAULT_STATUS_ID)
            .startedAt(DEFAULT_STARTED_AT)
            .finishedAt(DEFAULT_FINISHED_AT);
        return task;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Task createUpdatedEntity(EntityManager em) {
        Task task = new Task()
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .priorityId(UPDATED_PRIORITY_ID)
            .statusId(UPDATED_STATUS_ID)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);
        return task;
    }

    @BeforeEach
    public void initTest() {
        task = createEntity(em);
    }

    @Test
    @Transactional
    void createTask() throws Exception {
        int databaseSizeBeforeCreate = taskRepository.findAll().size();
        // Create the Task
        restTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isCreated());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeCreate + 1);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTask.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testTask.getPriorityId()).isEqualTo(DEFAULT_PRIORITY_ID);
        assertThat(testTask.getStatusId()).isEqualTo(DEFAULT_STATUS_ID);
        assertThat(testTask.getStartedAt()).isEqualTo(DEFAULT_STARTED_AT);
        assertThat(testTask.getFinishedAt()).isEqualTo(DEFAULT_FINISHED_AT);
    }

    @Test
    @Transactional
    void createTaskWithExistingId() throws Exception {
        // Create the Task with an existing ID
        task.setId(1L);

        int databaseSizeBeforeCreate = taskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTasks() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(task.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].priorityId").value(hasItem(DEFAULT_PRIORITY_ID)))
            .andExpect(jsonPath("$.[*].statusId").value(hasItem(DEFAULT_STATUS_ID)))
            .andExpect(jsonPath("$.[*].startedAt").value(hasItem(DEFAULT_STARTED_AT.toString())))
            .andExpect(jsonPath("$.[*].finishedAt").value(hasItem(DEFAULT_FINISHED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTasksWithEagerRelationshipsIsEnabled() throws Exception {
        when(taskServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTaskMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(taskServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTasksWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(taskServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTaskMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(taskRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get the task
        restTaskMockMvc
            .perform(get(ENTITY_API_URL_ID, task.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(task.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT))
            .andExpect(jsonPath("$.priorityId").value(DEFAULT_PRIORITY_ID))
            .andExpect(jsonPath("$.statusId").value(DEFAULT_STATUS_ID))
            .andExpect(jsonPath("$.startedAt").value(DEFAULT_STARTED_AT.toString()))
            .andExpect(jsonPath("$.finishedAt").value(DEFAULT_FINISHED_AT.toString()));
    }

    @Test
    @Transactional
    void getTasksByIdFiltering() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        Long id = task.getId();

        defaultTaskShouldBeFound("id.equals=" + id);
        defaultTaskShouldNotBeFound("id.notEquals=" + id);

        defaultTaskShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultTaskShouldNotBeFound("id.greaterThan=" + id);

        defaultTaskShouldBeFound("id.lessThanOrEqual=" + id);
        defaultTaskShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title equals to DEFAULT_TITLE
        defaultTaskShouldBeFound("title.equals=" + DEFAULT_TITLE);

        // Get all the taskList where title equals to UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title in DEFAULT_TITLE or UPDATED_TITLE
        defaultTaskShouldBeFound("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE);

        // Get all the taskList where title equals to UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title is not null
        defaultTaskShouldBeFound("title.specified=true");

        // Get all the taskList where title is null
        defaultTaskShouldNotBeFound("title.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByTitleContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title contains DEFAULT_TITLE
        defaultTaskShouldBeFound("title.contains=" + DEFAULT_TITLE);

        // Get all the taskList where title contains UPDATED_TITLE
        defaultTaskShouldNotBeFound("title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where title does not contain DEFAULT_TITLE
        defaultTaskShouldNotBeFound("title.doesNotContain=" + DEFAULT_TITLE);

        // Get all the taskList where title does not contain UPDATED_TITLE
        defaultTaskShouldBeFound("title.doesNotContain=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllTasksByContentIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where content equals to DEFAULT_CONTENT
        defaultTaskShouldBeFound("content.equals=" + DEFAULT_CONTENT);

        // Get all the taskList where content equals to UPDATED_CONTENT
        defaultTaskShouldNotBeFound("content.equals=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllTasksByContentIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where content in DEFAULT_CONTENT or UPDATED_CONTENT
        defaultTaskShouldBeFound("content.in=" + DEFAULT_CONTENT + "," + UPDATED_CONTENT);

        // Get all the taskList where content equals to UPDATED_CONTENT
        defaultTaskShouldNotBeFound("content.in=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllTasksByContentIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where content is not null
        defaultTaskShouldBeFound("content.specified=true");

        // Get all the taskList where content is null
        defaultTaskShouldNotBeFound("content.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByContentContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where content contains DEFAULT_CONTENT
        defaultTaskShouldBeFound("content.contains=" + DEFAULT_CONTENT);

        // Get all the taskList where content contains UPDATED_CONTENT
        defaultTaskShouldNotBeFound("content.contains=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllTasksByContentNotContainsSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where content does not contain DEFAULT_CONTENT
        defaultTaskShouldNotBeFound("content.doesNotContain=" + DEFAULT_CONTENT);

        // Get all the taskList where content does not contain UPDATED_CONTENT
        defaultTaskShouldBeFound("content.doesNotContain=" + UPDATED_CONTENT);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId equals to DEFAULT_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.equals=" + DEFAULT_PRIORITY_ID);

        // Get all the taskList where priorityId equals to UPDATED_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.equals=" + UPDATED_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId in DEFAULT_PRIORITY_ID or UPDATED_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.in=" + DEFAULT_PRIORITY_ID + "," + UPDATED_PRIORITY_ID);

        // Get all the taskList where priorityId equals to UPDATED_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.in=" + UPDATED_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId is not null
        defaultTaskShouldBeFound("priorityId.specified=true");

        // Get all the taskList where priorityId is null
        defaultTaskShouldNotBeFound("priorityId.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId is greater than or equal to DEFAULT_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.greaterThanOrEqual=" + DEFAULT_PRIORITY_ID);

        // Get all the taskList where priorityId is greater than or equal to UPDATED_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.greaterThanOrEqual=" + UPDATED_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId is less than or equal to DEFAULT_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.lessThanOrEqual=" + DEFAULT_PRIORITY_ID);

        // Get all the taskList where priorityId is less than or equal to SMALLER_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.lessThanOrEqual=" + SMALLER_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId is less than DEFAULT_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.lessThan=" + DEFAULT_PRIORITY_ID);

        // Get all the taskList where priorityId is less than UPDATED_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.lessThan=" + UPDATED_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByPriorityIdIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where priorityId is greater than DEFAULT_PRIORITY_ID
        defaultTaskShouldNotBeFound("priorityId.greaterThan=" + DEFAULT_PRIORITY_ID);

        // Get all the taskList where priorityId is greater than SMALLER_PRIORITY_ID
        defaultTaskShouldBeFound("priorityId.greaterThan=" + SMALLER_PRIORITY_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId equals to DEFAULT_STATUS_ID
        defaultTaskShouldBeFound("statusId.equals=" + DEFAULT_STATUS_ID);

        // Get all the taskList where statusId equals to UPDATED_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.equals=" + UPDATED_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId in DEFAULT_STATUS_ID or UPDATED_STATUS_ID
        defaultTaskShouldBeFound("statusId.in=" + DEFAULT_STATUS_ID + "," + UPDATED_STATUS_ID);

        // Get all the taskList where statusId equals to UPDATED_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.in=" + UPDATED_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId is not null
        defaultTaskShouldBeFound("statusId.specified=true");

        // Get all the taskList where statusId is null
        defaultTaskShouldNotBeFound("statusId.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId is greater than or equal to DEFAULT_STATUS_ID
        defaultTaskShouldBeFound("statusId.greaterThanOrEqual=" + DEFAULT_STATUS_ID);

        // Get all the taskList where statusId is greater than or equal to UPDATED_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.greaterThanOrEqual=" + UPDATED_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId is less than or equal to DEFAULT_STATUS_ID
        defaultTaskShouldBeFound("statusId.lessThanOrEqual=" + DEFAULT_STATUS_ID);

        // Get all the taskList where statusId is less than or equal to SMALLER_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.lessThanOrEqual=" + SMALLER_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId is less than DEFAULT_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.lessThan=" + DEFAULT_STATUS_ID);

        // Get all the taskList where statusId is less than UPDATED_STATUS_ID
        defaultTaskShouldBeFound("statusId.lessThan=" + UPDATED_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStatusIdIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where statusId is greater than DEFAULT_STATUS_ID
        defaultTaskShouldNotBeFound("statusId.greaterThan=" + DEFAULT_STATUS_ID);

        // Get all the taskList where statusId is greater than SMALLER_STATUS_ID
        defaultTaskShouldBeFound("statusId.greaterThan=" + SMALLER_STATUS_ID);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt equals to DEFAULT_STARTED_AT
        defaultTaskShouldBeFound("startedAt.equals=" + DEFAULT_STARTED_AT);

        // Get all the taskList where startedAt equals to UPDATED_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.equals=" + UPDATED_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt in DEFAULT_STARTED_AT or UPDATED_STARTED_AT
        defaultTaskShouldBeFound("startedAt.in=" + DEFAULT_STARTED_AT + "," + UPDATED_STARTED_AT);

        // Get all the taskList where startedAt equals to UPDATED_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.in=" + UPDATED_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt is not null
        defaultTaskShouldBeFound("startedAt.specified=true");

        // Get all the taskList where startedAt is null
        defaultTaskShouldNotBeFound("startedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt is greater than or equal to DEFAULT_STARTED_AT
        defaultTaskShouldBeFound("startedAt.greaterThanOrEqual=" + DEFAULT_STARTED_AT);

        // Get all the taskList where startedAt is greater than or equal to UPDATED_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.greaterThanOrEqual=" + UPDATED_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt is less than or equal to DEFAULT_STARTED_AT
        defaultTaskShouldBeFound("startedAt.lessThanOrEqual=" + DEFAULT_STARTED_AT);

        // Get all the taskList where startedAt is less than or equal to SMALLER_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.lessThanOrEqual=" + SMALLER_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt is less than DEFAULT_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.lessThan=" + DEFAULT_STARTED_AT);

        // Get all the taskList where startedAt is less than UPDATED_STARTED_AT
        defaultTaskShouldBeFound("startedAt.lessThan=" + UPDATED_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByStartedAtIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where startedAt is greater than DEFAULT_STARTED_AT
        defaultTaskShouldNotBeFound("startedAt.greaterThan=" + DEFAULT_STARTED_AT);

        // Get all the taskList where startedAt is greater than SMALLER_STARTED_AT
        defaultTaskShouldBeFound("startedAt.greaterThan=" + SMALLER_STARTED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt equals to DEFAULT_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.equals=" + DEFAULT_FINISHED_AT);

        // Get all the taskList where finishedAt equals to UPDATED_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.equals=" + UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsInShouldWork() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt in DEFAULT_FINISHED_AT or UPDATED_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.in=" + DEFAULT_FINISHED_AT + "," + UPDATED_FINISHED_AT);

        // Get all the taskList where finishedAt equals to UPDATED_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.in=" + UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt is not null
        defaultTaskShouldBeFound("finishedAt.specified=true");

        // Get all the taskList where finishedAt is null
        defaultTaskShouldNotBeFound("finishedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt is greater than or equal to DEFAULT_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.greaterThanOrEqual=" + DEFAULT_FINISHED_AT);

        // Get all the taskList where finishedAt is greater than or equal to UPDATED_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.greaterThanOrEqual=" + UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt is less than or equal to DEFAULT_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.lessThanOrEqual=" + DEFAULT_FINISHED_AT);

        // Get all the taskList where finishedAt is less than or equal to SMALLER_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.lessThanOrEqual=" + SMALLER_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsLessThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt is less than DEFAULT_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.lessThan=" + DEFAULT_FINISHED_AT);

        // Get all the taskList where finishedAt is less than UPDATED_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.lessThan=" + UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByFinishedAtIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        // Get all the taskList where finishedAt is greater than DEFAULT_FINISHED_AT
        defaultTaskShouldNotBeFound("finishedAt.greaterThan=" + DEFAULT_FINISHED_AT);

        // Get all the taskList where finishedAt is greater than SMALLER_FINISHED_AT
        defaultTaskShouldBeFound("finishedAt.greaterThan=" + SMALLER_FINISHED_AT);
    }

    @Test
    @Transactional
    void getAllTasksByOwnerIsEqualToSomething() throws Exception {
        User owner;
        if (TestUtil.findAll(em, User.class).isEmpty()) {
            taskRepository.saveAndFlush(task);
            owner = UserResourceIT.createEntity(em);
        } else {
            owner = TestUtil.findAll(em, User.class).get(0);
        }
        em.persist(owner);
        em.flush();
        task.setOwner(owner);
        taskRepository.saveAndFlush(task);
        Long ownerId = owner.getId();
        // Get all the taskList where owner equals to ownerId
        defaultTaskShouldBeFound("ownerId.equals=" + ownerId);

        // Get all the taskList where owner equals to (ownerId + 1)
        defaultTaskShouldNotBeFound("ownerId.equals=" + (ownerId + 1));
    }

    @Test
    @Transactional
    void getAllTasksByCategoryIsEqualToSomething() throws Exception {
        Category category;
        if (TestUtil.findAll(em, Category.class).isEmpty()) {
            taskRepository.saveAndFlush(task);
            category = CategoryResourceIT.createEntity(em);
        } else {
            category = TestUtil.findAll(em, Category.class).get(0);
        }
        em.persist(category);
        em.flush();
        task.setCategory(category);
        taskRepository.saveAndFlush(task);
        Long categoryId = category.getId();
        // Get all the taskList where category equals to categoryId
        defaultTaskShouldBeFound("categoryId.equals=" + categoryId);

        // Get all the taskList where category equals to (categoryId + 1)
        defaultTaskShouldNotBeFound("categoryId.equals=" + (categoryId + 1));
    }

    @Test
    @Transactional
    void getAllTasksByTagsIsEqualToSomething() throws Exception {
        Tag tags;
        if (TestUtil.findAll(em, Tag.class).isEmpty()) {
            taskRepository.saveAndFlush(task);
            tags = TagResourceIT.createEntity(em);
        } else {
            tags = TestUtil.findAll(em, Tag.class).get(0);
        }
        em.persist(tags);
        em.flush();
        task.addTags(tags);
        taskRepository.saveAndFlush(task);
        Long tagsId = tags.getId();
        // Get all the taskList where tags equals to tagsId
        defaultTaskShouldBeFound("tagsId.equals=" + tagsId);

        // Get all the taskList where tags equals to (tagsId + 1)
        defaultTaskShouldNotBeFound("tagsId.equals=" + (tagsId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTaskShouldBeFound(String filter) throws Exception {
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(task.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT)))
            .andExpect(jsonPath("$.[*].priorityId").value(hasItem(DEFAULT_PRIORITY_ID)))
            .andExpect(jsonPath("$.[*].statusId").value(hasItem(DEFAULT_STATUS_ID)))
            .andExpect(jsonPath("$.[*].startedAt").value(hasItem(DEFAULT_STARTED_AT.toString())))
            .andExpect(jsonPath("$.[*].finishedAt").value(hasItem(DEFAULT_FINISHED_AT.toString())));

        // Check, that the count call also returns 1
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTaskShouldNotBeFound(String filter) throws Exception {
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTaskMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingTask() throws Exception {
        // Get the task
        restTaskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task
        Task updatedTask = taskRepository.findById(task.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedTask are not directly saved in db
        em.detach(updatedTask);
        updatedTask
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .priorityId(UPDATED_PRIORITY_ID)
            .statusId(UPDATED_STATUS_ID)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);

        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTask.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTask.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testTask.getPriorityId()).isEqualTo(UPDATED_PRIORITY_ID);
        assertThat(testTask.getStatusId()).isEqualTo(UPDATED_STATUS_ID);
        assertThat(testTask.getStartedAt()).isEqualTo(UPDATED_STARTED_AT);
        assertThat(testTask.getFinishedAt()).isEqualTo(UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void putNonExistingTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, task.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTaskWithPatch() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task using partial update
        Task partialUpdatedTask = new Task();
        partialUpdatedTask.setId(task.getId());

        partialUpdatedTask.finishedAt(UPDATED_FINISHED_AT);

        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTask.getContent()).isEqualTo(DEFAULT_CONTENT);
        assertThat(testTask.getPriorityId()).isEqualTo(DEFAULT_PRIORITY_ID);
        assertThat(testTask.getStatusId()).isEqualTo(DEFAULT_STATUS_ID);
        assertThat(testTask.getStartedAt()).isEqualTo(DEFAULT_STARTED_AT);
        assertThat(testTask.getFinishedAt()).isEqualTo(UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void fullUpdateTaskWithPatch() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeUpdate = taskRepository.findAll().size();

        // Update the task using partial update
        Task partialUpdatedTask = new Task();
        partialUpdatedTask.setId(task.getId());

        partialUpdatedTask
            .title(UPDATED_TITLE)
            .content(UPDATED_CONTENT)
            .priorityId(UPDATED_PRIORITY_ID)
            .statusId(UPDATED_STATUS_ID)
            .startedAt(UPDATED_STARTED_AT)
            .finishedAt(UPDATED_FINISHED_AT);

        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTask.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTask))
            )
            .andExpect(status().isOk());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
        Task testTask = taskList.get(taskList.size() - 1);
        assertThat(testTask.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTask.getContent()).isEqualTo(UPDATED_CONTENT);
        assertThat(testTask.getPriorityId()).isEqualTo(UPDATED_PRIORITY_ID);
        assertThat(testTask.getStatusId()).isEqualTo(UPDATED_STATUS_ID);
        assertThat(testTask.getStartedAt()).isEqualTo(UPDATED_STARTED_AT);
        assertThat(testTask.getFinishedAt()).isEqualTo(UPDATED_FINISHED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, task.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(task))
            )
            .andExpect(status().isBadRequest());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTask() throws Exception {
        int databaseSizeBeforeUpdate = taskRepository.findAll().size();
        task.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTaskMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(task)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Task in the database
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTask() throws Exception {
        // Initialize the database
        taskRepository.saveAndFlush(task);

        int databaseSizeBeforeDelete = taskRepository.findAll().size();

        // Delete the task
        restTaskMockMvc
            .perform(delete(ENTITY_API_URL_ID, task.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Task> taskList = taskRepository.findAll();
        assertThat(taskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
