package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.TagTestSamples.*;
import static com.mycompany.myapp.domain.TaskTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class TagTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tag.class);
        Tag tag1 = getTagSample1();
        Tag tag2 = new Tag();
        assertThat(tag1).isNotEqualTo(tag2);

        tag2.setId(tag1.getId());
        assertThat(tag1).isEqualTo(tag2);

        tag2 = getTagSample2();
        assertThat(tag1).isNotEqualTo(tag2);
    }

    @Test
    void tasksTest() throws Exception {
        Tag tag = getTagRandomSampleGenerator();
        Task taskBack = getTaskRandomSampleGenerator();

        tag.addTasks(taskBack);
        assertThat(tag.getTasks()).containsOnly(taskBack);
        assertThat(taskBack.getTags()).containsOnly(tag);

        tag.removeTasks(taskBack);
        assertThat(tag.getTasks()).doesNotContain(taskBack);
        assertThat(taskBack.getTags()).doesNotContain(tag);

        tag.tasks(new HashSet<>(Set.of(taskBack)));
        assertThat(tag.getTasks()).containsOnly(taskBack);
        assertThat(taskBack.getTags()).containsOnly(tag);

        tag.setTasks(new HashSet<>());
        assertThat(tag.getTasks()).doesNotContain(taskBack);
        assertThat(taskBack.getTags()).doesNotContain(tag);
    }
}
