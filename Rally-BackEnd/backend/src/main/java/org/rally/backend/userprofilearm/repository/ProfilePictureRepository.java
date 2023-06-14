package org.rally.backend.userprofilearm.repository;

import org.rally.backend.userprofilearm.model.ProfilePicture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, Long> {
    Optional<ProfilePicture> findByUserId(String name);
    @Override
    void deleteById(Long aLong);
}
