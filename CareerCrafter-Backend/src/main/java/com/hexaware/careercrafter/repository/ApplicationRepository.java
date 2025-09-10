package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.Application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository interface for application entities.
 */

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {
	
    List<Application> findByJobSeekerJobSeekerId(int jobSeekerId);

}
