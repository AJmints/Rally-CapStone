package org.rally.backend.userprofilearm.model.dto;

public class FavoritesPostsDTO {
    private String postType;
    private Integer postId;
    private String userName;

    public FavoritesPostsDTO(String postType, Integer postId, String userName) {
        this.postType = postType;
        this.postId = postId;
        this.userName = userName;
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
