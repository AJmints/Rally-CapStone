package org.rally.backend.userprofilearm.repository;

import org.rally.backend.userprofilearm.model.FavoritePosts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritesRepository extends JpaRepository<FavoritePosts, Long> {
}
