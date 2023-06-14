package org.rally.backend.userprofilearm.repository;

import org.rally.backend.userprofilearm.model.UserInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInformationRepository extends JpaRepository<UserInformation, Integer> {
    @Override
    Optional<UserInformation> findById(Integer integer);
    Optional<UserInformation> findByUserId(Integer name);

}
