package com.hexaware.careercrafter.repository;

import com.hexaware.careercrafter.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
 * Repository interface for user entities.
 */

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	
    User findByEmail(String email);

}