package com.mycompany.myapp.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.mycompany.myapp.domain.Tag} entity. This class is used
 * in {@link com.mycompany.myapp.web.rest.TagResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /tags?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TagCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private LongFilter ownerId;

    private LongFilter tasksId;

    private Boolean distinct;

    private StringFilter ownerLogin;

    public TagCriteria() {}

    public TagCriteria(TagCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.ownerId = other.ownerId == null ? null : other.ownerId.copy();
        this.ownerLogin = other.ownerLogin == null ? null : other.ownerLogin.copy();
        this.tasksId = other.tasksId == null ? null : other.tasksId.copy();
        this.distinct = other.distinct;
    }

    @Override
    public TagCriteria copy() {
        return new TagCriteria(this);
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

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
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

    public LongFilter getTasksId() {
        return tasksId;
    }

    public LongFilter tasksId() {
        if (tasksId == null) {
            tasksId = new LongFilter();
        }
        return tasksId;
    }

    public void setTasksId(LongFilter tasksId) {
        this.tasksId = tasksId;
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
        final TagCriteria that = (TagCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(ownerId, that.ownerId) &&
            Objects.equals(tasksId, that.tasksId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, ownerId, tasksId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TagCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (ownerId != null ? "ownerId=" + ownerId + ", " : "") +
            (tasksId != null ? "tasksId=" + tasksId + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
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

}
