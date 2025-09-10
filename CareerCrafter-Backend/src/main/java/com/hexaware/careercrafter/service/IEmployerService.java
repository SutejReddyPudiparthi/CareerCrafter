package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.*;

import java.util.List;

/*
 * service interface defining business logic for employer entities.
 */


public interface IEmployerService {
	
	EmployerDTO createEmployer(EmployerDTO employerDTO);
    EmployerDTO getEmployerById(int id);
    EmployerDTO getEmployerByUserId(int userId);
    List<EmployerDTO> getAllEmployers();
    EmployerDTO updateEmployer(EmployerDTO employerDTO);
    void deleteEmployer(int id);

}
