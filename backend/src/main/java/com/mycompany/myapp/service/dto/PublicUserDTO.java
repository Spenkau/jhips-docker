package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.PublicUser;
import com.mycompany.myapp.domain.User;

import java.io.Serializable;
import java.util.Optional;

/**
 * A DTO representing a user, with only the public attributes.
 */
public class PublicUserDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String login;

    private String firstName;

    private String lastName;

    public PublicUserDTO() {
        // Empty constructor needed for Jackson.
    }

    public PublicUserDTO(PublicUser publicUser) {
        this.id = publicUser.getId();
        // Customize it here if you need, or not, firstName/lastName/etc
        this.login = publicUser.getLogin();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PublicUserDTO{" +
            "id='" + id + '\'' +
            ", login='" + login + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            "}";
    }
}
