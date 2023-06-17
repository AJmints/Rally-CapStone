package org.rally.backend.userprofilearm.model;

import org.rally.backend.eventsarm.models.Event;
import org.rally.backend.forumarm.models.ForumPosts;
import org.rally.backend.forumarm.models.Replies;
import org.rally.backend.resourcearm.model.Resource;
import org.rally.backend.servicesarm.model.response.Service;

import java.util.List;

public class UserPostHistory {

    List<HiddenPost> viewUserHiddenPost;
    List<ForumPosts> viewUserFavoritePost;
    List<ForumPosts> viewUserForumPost;
    List<Replies> viewUserForumReplies;
    List<Event> viewUserEventPost;
    List<Service> viewUserServicePost;
    List<Resource> viewUserResourcePost;
    //List<RestaurantReview> viewUserRestaurantReviews;



    public UserPostHistory() {
    }

    public List<ForumPosts> getViewUserFavoritePost() {
        return viewUserFavoritePost;
    }

    public void setViewUserFavoritePost(List<ForumPosts> viewUserFavoritePost) {
        this.viewUserFavoritePost = viewUserFavoritePost;
    }

    public List<Resource> getViewUserResourcePost() {
        return viewUserResourcePost;
    }

    public void setViewUserResourcePost(List<Resource> viewUserResourcePost) {
        this.viewUserResourcePost = viewUserResourcePost;
    }

    public List<HiddenPost> getViewUserHiddenPost() {
        return viewUserHiddenPost;
    }

    public void setViewUserHiddenPost(List<HiddenPost> viewUserHiddenPost) {
        this.viewUserHiddenPost = viewUserHiddenPost;
    }

    public List<ForumPosts> getViewUserForumPost() {
        return viewUserForumPost;
    }

    public void setViewUserForumPost(List<ForumPosts> viewUserForumPost) {
        this.viewUserForumPost = viewUserForumPost;
    }

    public List<Event> getViewUserEventPost() {
        return viewUserEventPost;
    }

    public void setViewUserEventPost(List<Event> viewUserEventPost) {
        this.viewUserEventPost = viewUserEventPost;
    }

    public List<Service> getViewUserServicePost() {
        return viewUserServicePost;
    }

    public void setViewUserServicePost(List<Service> viewUserServicePost) {
        this.viewUserServicePost = viewUserServicePost;
    }

    public List<Replies> getViewUserForumReplies() {
        return viewUserForumReplies;
    }

    public void setViewUserForumReplies(List<Replies> viewUserForumReplies) {
        this.viewUserForumReplies = viewUserForumReplies;
    }
}
