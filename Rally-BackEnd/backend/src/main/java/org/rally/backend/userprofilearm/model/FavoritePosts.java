package org.rally.backend.userprofilearm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class FavoritePosts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String postType;
    private Integer postId;
    private String userName;

    public FavoritePosts(String postType, Integer postId, String userName) {
        this.postType = postType;
        this.postId = postId;
        this.userName = userName;
    }

    public Integer getId() {
        return id;
    }

    public String getPostType() {
        return postType;
    }

    public Integer getPostId() {
        return postId;
    }

    public String getUserName() {
        return userName;
    }
}
