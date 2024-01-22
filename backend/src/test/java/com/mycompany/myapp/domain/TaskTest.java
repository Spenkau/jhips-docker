package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CategoryTestSamples.*;
import static com.mycompany.myapp.domain.TagTestSamples.*;
import static com.mycompany.myapp.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TaskTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Task.class);
        Task task1 = getTaskSample1();
        Task task2 = new Task();
        assertThat(task1).isNotEqualTo(task2);

        task2.setId(task1.getId());
        assertThat(task1).isEqualTo(task2);

        task2 = getTaskSample2();
        assertThat(task1).isNotEqualTo(task2);
    }

    @Test
    void categoryTest() throws Exception {
        Task task = getTaskRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        task.setCategory(categoryBack);
        assertThat(task.getCategory()).isEqualTo(categoryBack);

        task.category(null);
        assertThat(task.getCategory()).isNull();
    }

    @Test
    void tagsTest() throws Exception {
        Task task = getTaskRandomSampleGenerator();
        Tag tagBack = getTagRandomSampleGenerator();

        task.addTags(tagBack);
        assertThat(task.getTags()).containsOnly(tagBack);

        task.removeTags(tagBack);
        assertThat(task.getTags()).doesNotContain(tagBack);

        task.tags(new HashSet<>(Set.of(tagBack)));
        assertThat(task.getTags()).containsOnly(tagBack);

        task.setTags(new HashSet<>());
        assertThat(task.getTags()).doesNotContain(tagBack);
    }
}
