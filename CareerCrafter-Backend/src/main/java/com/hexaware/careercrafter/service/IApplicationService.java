package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.ApplicationDTO;

import java.util.List;

/*
 * service interface defining business logic for application.
 */

public interface IApplicationService {
	
    ApplicationDTO applyForJob(ApplicationDTO applicationDTO);
    ApplicationDTO getApplicationById(int id);
    List<ApplicationDTO> getAllApplications();
    List<ApplicationDTO> getApplicationsByJobSeekerId(int seekerId);
    ApplicationDTO updateApplication(ApplicationDTO applicationDTO);
    void deleteApplication(int id);
    
}
