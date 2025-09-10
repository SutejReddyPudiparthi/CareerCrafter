package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.JobSeeker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/*
 * Repository interface for job seeker.
 */

@Repository
public interface JobSeekerRepository extends JpaRepository<JobSeeker, Integer> {
	
	List<JobSeeker> findByFullNameContainingIgnoreCase(String fullName);
	Optional<JobSeeker> findByUserUserId(int userId);
	
}