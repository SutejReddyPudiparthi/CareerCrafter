package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.SearchRecommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository interface for SearchRecommendation.
 */

@Repository
public interface SearchRecommendationRepository extends JpaRepository<SearchRecommendation, Integer> {
	
    List<SearchRecommendation> findByUserUserId(int userId);

}
