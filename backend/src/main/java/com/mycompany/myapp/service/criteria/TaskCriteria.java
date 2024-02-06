package com.mycompany.myapp.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.mycompany.myapp.domain.Task} entity. This class is used
 * in {@link com.mycompany.myapp.web.rest.TaskResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /tasks?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TaskCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private StringFilter content;

    private IntegerFilter priorityId;

    private IntegerFilter statusId;

    private LocalDateFilter startedAt;

    private LocalDateFilter finishedAt;

    private LongFilter ownerId;

    private StringFilter ownerLogin;

    private LongFilter categoryId;

    private LongFilter tagsId;

    private Boolean distinct;

    public TaskCriteria() {}

    public TaskCriteria(TaskCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.title = other.title == null ? null : other.title.copy();
        this.content = other.content == null ? null : other.content.copy();
        this.priorityId = other.priorityId == null ? null : other.priorityId.copy();
        this.statusId = other.statusId == null ? null : other.statusId.copy();
        this.startedAt = other.startedAt == null ? null : other.startedAt.copy();
        this.finishedAt = other.finishedAt == null ? null : other.finishedAt.copy();
        this.ownerId = other.ownerId == null ? null : other.ownerId.copy();
        this.ownerLogin = other.ownerLogin == null ? null : other.ownerLogin.copy();
        this.categoryId = other.categoryId == null ? null : other.categoryId.copy();
        this.tagsId = other.tagsId == null ? null : other.tagsId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public TaskCriteria copy() {
        return new TaskCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitle() {
        return title;
    }

    public StringFilter title() {
        if (title == null) {
            title = new StringFilter();
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public StringFilter getContent() {
        return content;
    }

    public StringFilter content() {
        if (content == null) {
            content = new StringFilter();
        }
        return content;
    }

    public void setContent(StringFilter content) {
        this.content = content;
    }

    public IntegerFilter getPriorityId() {
        return priorityId;
    }

    public IntegerFilter priorityId() {
        if (priorityId == null) {
            priorityId = new IntegerFilter();
        }
        return priorityId;
    }

    public void setPriorityId(IntegerFilter priorityId) {
        this.priorityId = priorityId;
    }

    public IntegerFilter getStatusId() {
        return statusId;
    }

    public IntegerFilter statusId() {
        if (statusId == null) {
            statusId = new IntegerFilter();
        }
        return statusId;
    }

    public void setStatusId(IntegerFilter statusId) {
        this.statusId = statusId;
    }

    public LocalDateFilter getStartedAt() {
        return startedAt;
    }

    public LocalDateFilter startedAt() {
        if (startedAt == null) {
            startedAt = new LocalDateFilter();
        }
        return startedAt;
    }

    public void setStartedAt(LocalDateFilter startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateFilter getFinishedAt() {
        return finishedAt;
    }

    public LocalDateFilter finishedAt() {
        if (finishedAt == null) {
            finishedAt = new LocalDateFilter();
        }
        return finishedAt;
    }

    public void setFinishedAt(LocalDateFilter finishedAt) {
        this.finishedAt = finishedAt;
    }

    public LongFilter getOwnerId() {
        return ownerId;
    }

    public LongFilter ownerId() {
        if (ownerId == null) {
            ownerId = new LongFilter();
        }
        return ownerId;
    }

    public void setOwnerId(LongFilter ownerId) {
        this.ownerId = ownerId;
    }

    public StringFilter getOwnerLogin() { return ownerLogin; }
    public StringFilter ownerLogin() {
        if (ownerLogin == null) {
            ownerLogin = new StringFilter();
        }
        return ownerLogin;
    }

    public void setOwnerLogin(StringFilter ownerLogin) {
        this.ownerLogin = ownerLogin;
    }


    public LongFilter getCategoryId() {
        return categoryId;
    }

    public LongFilter categoryId() {
        if (categoryId == null) {
            categoryId = new LongFilter();
        }
        return categoryId;
    }

    public void setCategoryId(LongFilter categoryId) {
        this.categoryId = categoryId;
    }

    public LongFilter getTagsId() {
        return tagsId;
    }

    public LongFilter tagsId() {
        if (tagsId == null) {
            tagsId = new LongFilter();
        }
        return tagsId;
    }

    public void setTagsId(LongFilter tagsId) {
        this.tagsId = tagsId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TaskCriteria that = (TaskCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(content, that.content) &&
            Objects.equals(priorityId, that.priorityId) &&
            Objects.equals(statusId, that.statusId) &&
            Objects.equals(startedAt, that.startedAt) &&
            Objects.equals(finishedAt, that.finishedAt) &&
            Objects.equals(ownerId, that.ownerId) &&
            Objects.equals(categoryId, that.categoryId) &&
            Objects.equals(tagsId, that.tagsId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, content, priorityId, statusId, startedAt, finishedAt, ownerId, categoryId, tagsId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaskCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (title != null ? "title=" + title + ", " : "") +
            (content != null ? "content=" + content + ", " : "") +
            (priorityId != null ? "priorityId=" + priorityId + ", " : "") +
            (statusId != null ? "statusId=" + statusId + ", " : "") +
            (startedAt != null ? "startedAt=" + startedAt + ", " : "") +
            (finishedAt != null ? "finishedAt=" + finishedAt + ", " : "") +
            (ownerId != null ? "ownerId=" + ownerId + ", " : "") +
            (categoryId != null ? "categoryId=" + categoryId + ", " : "") +
            (tagsId != null ? "tagsId=" + tagsId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
