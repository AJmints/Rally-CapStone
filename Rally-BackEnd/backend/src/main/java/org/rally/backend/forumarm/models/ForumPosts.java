package org.rally.backend.forumarm.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.rally.backend.userprofilearm.model.UserEntity;

import java.util.ArrayList;
import java.util.List;

@Entity
public class ForumPosts extends AbstractEntity{
    @ManyToOne
    private UserEntity userEntity;
    @OneToMany(mappedBy = "forumPosts")
    private final List<Replies> replies = new ArrayList<>();
    @OneToOne(cascade = CascadeType.PERSIST)
    private ForumPostLike forumPostLike;

    private Boolean favorite;

    private String title;
    private String description;
    private String category;
    public ForumPosts(String title, String description, String category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }
    public ForumPosts(){}

    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }

    public void setForumPostLike(ForumPostLike forumPostLike) {
        this.forumPostLike = forumPostLike;
    }

    public ForumPostLike getForumPostLike() {
        return forumPostLike;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void addReply(Replies reply){
        this.replies.add(reply);
    }

    public void removeReply(Replies reply){ this.replies.remove(reply); }
}
