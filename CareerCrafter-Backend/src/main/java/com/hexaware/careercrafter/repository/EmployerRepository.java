package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.Employer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository interface for employer entities.
 */

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Integer> {
	
	List<Employer> findByUserUserId(int userId);
	

}
