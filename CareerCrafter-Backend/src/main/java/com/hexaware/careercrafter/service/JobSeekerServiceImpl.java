package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.JobListingDTO;
import com.hexaware.careercrafter.dto.JobSeekerDTO;
import com.hexaware.careercrafter.entities.JobListing;
import com.hexaware.careercrafter.entities.JobSeeker;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.exception.InvalidRequestException;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.JobListingRepository;
import com.hexaware.careercrafter.repository.JobSeekerRepository;
import com.hexaware.careercrafter.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/*
 * Implementation of IJobSeekerService.
 * Implements jobseeker-related operations.
 */

@Service
public class JobSeekerServiceImpl implements IJobSeekerService {
    private static final Logger logger = LoggerFactory.getLogger(JobSeekerServiceImpl.class);

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobListingRepository jobListingRepository;

    @Override
    public JobSeekerDTO createJobSeeker(JobSeekerDTO dto) {
        logger.debug("Attempting to create job seeker for userId: {}", dto.getUserId());
        if (dto.getFullName() == null || dto.getUserId() <= 0) {
            logger.error("Invalid request - missing required job seeker fields");
            throw new InvalidRequestException("Full name and valid userId are required.");
        }
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", dto.getUserId());
                    return new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
                });
        JobSeeker jobSeeker = convertToEntity(dto, user);
        JobSeeker saved = jobSeekerRepository.save(jobSeeker);
        logger.info("Job seeker created successfully with ID: {}", saved.getJobSeekerId());
        return convertToDTO(saved);
    }

    @Override
    public List<JobSeekerDTO> getAllJobSeekers() {
        logger.debug("Fetching all job seekers from database");
        return jobSeekerRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JobSeekerDTO getJobSeekerById(int id) {
        logger.debug("Fetching job seeker with ID: {}", id);
        JobSeeker jobSeeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Job seeker not found with ID: {}", id);
                    return new ResourceNotFoundException("Job seeker not found with ID: " + id);
                });
        return convertToDTO(jobSeeker);
    }
    
    @Override
    public JobSeekerDTO getJobSeekerByUserId(int userId) {
        JobSeeker jobSeeker = jobSeekerRepository.findAll()
            .stream()
            .filter(js -> js.getUser().getUserId() == userId)
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("JobSeeker not found for userId: " + userId));
        return convertToDTO(jobSeeker);
    }

    @Override
    public JobSeekerDTO updateJobSeeker(JobSeekerDTO dto) {
        logger.debug("Updating job seeker with ID: {}", dto.getJobSeekerId());
        if (!jobSeekerRepository.existsById(dto.getJobSeekerId())) {
            logger.error("Cannot update - job seeker not found with ID: {}", dto.getJobSeekerId());
            throw new ResourceNotFoundException("Cannot update. JobSeeker not found with ID: " + dto.getJobSeekerId());
        }
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> {
                    logger.error("User not found with ID: {}", dto.getUserId());
                    return new ResourceNotFoundException("User not found with ID: " + dto.getUserId());
                });
        JobSeeker updatedEntity = convertToEntity(dto, user);
        JobSeeker saved = jobSeekerRepository.save(updatedEntity);
        logger.info("Job seeker with ID {} updated successfully", saved.getJobSeekerId());
        return convertToDTO(saved);
    }
    
    @Override
    public void deleteJobSeeker(int id) {
        logger.debug("Deleting job seeker with ID: {}", id);
        if (!jobSeekerRepository.existsById(id)) {
            logger.error("Cannot delete - job seeker not found with ID: {}", id);
            throw new ResourceNotFoundException("Cannot delete. JobSeeker not found with ID: " + id);
        }
        jobSeekerRepository.deleteById(id);
        logger.info("Job seeker with ID {} deleted successfully", id);
    }

    @Override
    public List<JobListingDTO> getJobRecommendations(int jobSeekerId) {
        logger.debug("Fetching job recommendations for job seeker ID: {}", jobSeekerId);
        JobSeeker jobSeeker = jobSeekerRepository.findById(jobSeekerId)
                .orElseThrow(() -> new ResourceNotFoundException("JobSeeker not found with ID: " + jobSeekerId));

        if (jobSeeker.getSkills() == null || jobSeeker.getSkills().isEmpty()) {
            logger.info("Job seeker has no skills listed, returning empty recommendation list");
            return Collections.emptyList();
        }

        String[] seekerSkills = jobSeeker.getSkills().toLowerCase().split(",\\s*");
        String skillsRegex = String.join("|", seekerSkills);
        String location = jobSeeker.getAddress() != null ? jobSeeker.getAddress().toLowerCase() : "";
        List<JobListing> matchedJobs = jobListingRepository.findRecommendedJobs(skillsRegex, location);
        return matchedJobs.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private JobListingDTO mapToDTO(JobListing jobListing) {
        JobListingDTO dto = new JobListingDTO();
        dto.setJobListingId(jobListing.getJobListingId());
        dto.setEmployerId(jobListing.getEmployer() != null ? jobListing.getEmployer().getEmployerId() : 0);
        dto.setTitle(jobListing.getTitle());
        dto.setDescription(jobListing.getDescription());
        dto.setQualification(jobListing.getQualification());
        dto.setLocation(jobListing.getLocation());
        dto.setCompanyName(jobListing.getCompanyName());
        dto.setExperience(jobListing.getExperience());
        dto.setJobType(jobListing.getJobType());
        dto.setActive(jobListing.isActive());
        dto.setSalary(jobListing.getSalary());
        dto.setPostedDate(jobListing.getPostedDate());
        dto.setRequiredSkills(jobListing.getRequiredSkills());
        return dto;
    }

    private JobSeeker convertToEntity(JobSeekerDTO dto, User user) {
        JobSeeker jobSeeker = new JobSeeker();
        jobSeeker.setJobSeekerId(dto.getJobSeekerId());
        jobSeeker.setUser(user);
        jobSeeker.setFullName(dto.getFullName());
        jobSeeker.setPhone(dto.getPhone());
        jobSeeker.setAddress(dto.getAddress());
        jobSeeker.setEducation(dto.getEducation());
        jobSeeker.setSkills(dto.getSkills());
        jobSeeker.setExperience(dto.getExperience());
        jobSeeker.setEmail(dto.getEmail());
        jobSeeker.setGender(dto.getGender());
        jobSeeker.setDateOfBirth(dto.getDateOfBirth());
        return jobSeeker;
    }

    private JobSeekerDTO convertToDTO(JobSeeker jobSeeker) {
        JobSeekerDTO dto = new JobSeekerDTO();
        dto.setJobSeekerId(jobSeeker.getJobSeekerId());
        dto.setUserId(jobSeeker.getUser().getUserId());
        dto.setFullName(jobSeeker.getFullName());
        dto.setPhone(jobSeeker.getPhone());
        dto.setAddress(jobSeeker.getAddress());
        dto.setEducation(jobSeeker.getEducation());
        dto.setSkills(jobSeeker.getSkills());
        dto.setExperience(jobSeeker.getExperience());
        dto.setEmail(jobSeeker.getEmail());
        dto.setGender(jobSeeker.getGender());
        dto.setDateOfBirth(jobSeeker.getDateOfBirth());
        return dto;
    }
}
