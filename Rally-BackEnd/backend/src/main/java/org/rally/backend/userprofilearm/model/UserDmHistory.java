package org.rally.backend.userprofilearm.model;

import java.util.List;

public class UserDmHistory {

    List<UserEntity> userEntities;
    List<DirectMessage> directMessageList;
    List<ProfilePicture> profilePictures;

    public UserDmHistory(List<UserEntity> userEntities, List<DirectMessage> directMessageList, List<ProfilePicture> profilePictures) {
        this.userEntities = userEntities;
        this.directMessageList = directMessageList;
        this.profilePictures = profilePictures;
    }

    public List<ProfilePicture> getProfilePictures() {
        return profilePictures;
    }

    public void setProfilePictures(List<ProfilePicture> profilePictures) {
        this.profilePictures = profilePictures;
    }

    public List<UserEntity> getUserEntities() {
        return userEntities;
    }

    public void setUserEntities(List<UserEntity> userEntities) {
        this.userEntities = userEntities;
    }

    public List<DirectMessage> getDirectMessageList() {
        return directMessageList;
    }

    public void setDirectMessageList(List<DirectMessage> directMessageList) {
        this.directMessageList = directMessageList;
    }
}
