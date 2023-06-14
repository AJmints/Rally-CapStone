package org.rally.backend.springsecurity.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BadJWT {

    /** JWT flagged as invalid **/

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String badToken;

    public BadJWT() {
    }

    public Integer getId() {
        return id;
    }

    public String getBadToken() {
        return badToken;
    }

    public void setBadToken(String badToken) {
        this.badToken = badToken;
    }
}
