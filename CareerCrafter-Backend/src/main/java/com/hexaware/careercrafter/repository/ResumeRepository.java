package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.Resume;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository interface for resume entities.
 */

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Integer> {
	
    List<Resume> findByJobSeeker_JobSeekerId(int jobSeekerId);
    List<Resume> findByJobSeeker_JobSeekerIdAndIsPrimaryTrue(int jobSeekerId);

}
