package org.rally.backend.userprofilearm.model;

import java.util.ArrayList;
import java.util.List;

public class SearchUserThumbNail {

    List<UserEntity> userNames;
    List<ProfilePicture> profilePics;

    public SearchUserThumbNail() {
    }

    public List<UserEntity> getUserNames() {
        return userNames;
    }

    public void setUserNames(List<UserEntity> userNames) {
        this.userNames = userNames;
    }

    public List<ProfilePicture> getProfilePics() {
        return profilePics;
    }

    public void setProfilePics(List<ProfilePicture> profilePics) {
        this.profilePics = profilePics;
    }
}
