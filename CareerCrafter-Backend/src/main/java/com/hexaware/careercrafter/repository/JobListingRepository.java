package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.JobListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, Integer>,  JpaSpecificationExecutor<JobListing> {

    List<JobListing> findByEmployerEmployerId(int employerId);
    List<JobListing> findByActiveTrue();

    @Query(value = "SELECT * FROM job_listings j WHERE j.active = true AND (LOWER(j.required_skills) REGEXP :skillsRegex OR LOWER(J.location) = :location)", nativeQuery = true)
    List<JobListing> findRecommendedJobs(@Param("skillsRegex") String skillsRegex, @Param("location") String location);
}
