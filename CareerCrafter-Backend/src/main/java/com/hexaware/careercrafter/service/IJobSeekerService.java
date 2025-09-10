package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.*;

import java.util.List;

/*
 * service interface specifying operations for job seeker profiles.
 */

public interface IJobSeekerService {
    JobSeekerDTO createJobSeeker(JobSeekerDTO jobSeekerDTO);
    JobSeekerDTO getJobSeekerById(int id);
    JobSeekerDTO getJobSeekerByUserId(int userId);
    List<JobSeekerDTO> getAllJobSeekers();
    JobSeekerDTO updateJobSeeker(JobSeekerDTO jobSeekerDTO);
    List<JobListingDTO> getJobRecommendations(int jobSeekerId);
    void deleteJobSeeker(int id);
    
}

