package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.ResumeDTO;
import com.hexaware.careercrafter.entities.JobSeeker;
import com.hexaware.careercrafter.entities.Resume;
import com.hexaware.careercrafter.exception.InvalidRequestException;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.ResumeRepository;
import com.hexaware.careercrafter.repository.JobSeekerRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/*
 * Implementation of IResumeService.
 * Implements resume related operations.
 */

@Service
public class ResumeServiceImpl implements IResumeService {
    private static final Logger logger = LoggerFactory.getLogger(ResumeServiceImpl.class);

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Override
    public ResumeDTO uploadResume(ResumeDTO dto) {
        logger.debug("Attempting to upload resume for jobSeekerId: {}", dto.getJobSeekerId());
        if (dto.getFilePath() == null || dto.getJobSeekerId() == 0) {
            logger.error("Resume upload failed - missing file path or jobSeekerId");
            throw new InvalidRequestException("File path and associated job seeker are required.");
        }
        if (dto.isPrimary()) {
            List<Resume> existingPrimaries = resumeRepository.findByJobSeeker_JobSeekerIdAndIsPrimaryTrue(dto.getJobSeekerId());
            for (Resume r : existingPrimaries) {
                r.setPrimary(false);
                resumeRepository.save(r);
            }
        }
        Resume entity = mapToEntity(dto);
        Resume saved = resumeRepository.save(entity);
        logger.info("Resume uploaded successfully with ID: {}", saved.getResumeId());
        return mapToDTO(saved);
    }

    @Override
    public ResumeDTO getResumeById(int id) {
        logger.debug("Fetching resume with ID: {}", id);
        Resume entity = resumeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Resume with ID {} not found", id);
                    return new ResourceNotFoundException("Resume not found with ID: " + id);
                });
        return mapToDTO(entity);
    }

    @Override
    public List<ResumeDTO> getResumesByJobSeekerId(int jobSeekerId) {
        logger.debug("Fetching resumes for jobSeekerId: {}", jobSeekerId);
        List<Resume> resumes = resumeRepository.findByJobSeeker_JobSeekerId(jobSeekerId);
        List<ResumeDTO> dtos = new ArrayList<>();
        for (Resume resume : resumes) {
            dtos.add(mapToDTO(resume));
        }
        logger.info("Fetched {} resumes for jobSeekerId: {}", dtos.size(), jobSeekerId);
        return dtos;
    }

    @Override
    public ResumeDTO updateResume(ResumeDTO dto) {
        logger.debug("Updating resume with ID: {}", dto.getResumeId());
        if (!resumeRepository.existsById(dto.getResumeId())) {
            logger.error("Cannot update - resume with ID {} not found", dto.getResumeId());
            throw new ResourceNotFoundException("Cannot update. Resume not found with ID: " + dto.getResumeId());
        }
        
        if (dto.isPrimary()) {
            List<Resume> existingPrimaries = resumeRepository.findByJobSeeker_JobSeekerIdAndIsPrimaryTrue(dto.getJobSeekerId());
            for (Resume r : existingPrimaries) {
                if (r.getResumeId() != dto.getResumeId()) {
                    r.setPrimary(false);
                    resumeRepository.save(r);
                }
            }
        }
        Resume entity = mapToEntity(dto);
        Resume saved = resumeRepository.save(entity);
        logger.info("Resume with ID {} updated successfully", saved.getResumeId());
        return mapToDTO(saved);
    }

    @Override
    public void deleteResume(int id) {
        logger.debug("Deleting resume with ID: {}", id);
        if (!resumeRepository.existsById(id)) {
            logger.error("Cannot delete - resume with ID {} not found", id);
            throw new ResourceNotFoundException("Cannot delete. Resume not found with ID: " + id);
        }
        resumeRepository.deleteById(id);
        logger.info("Resume with ID {} deleted successfully", id);
    }

    private ResumeDTO mapToDTO(Resume entity) {
        ResumeDTO dto = new ResumeDTO();
        dto.setResumeId(entity.getResumeId());
        dto.setJobSeekerId(entity.getJobSeeker() != null ? entity.getJobSeeker().getJobSeekerId() : 0);
        dto.setFilePath(entity.getFilePath());
        dto.setPrimary(entity.isPrimary());
        return dto;
    }

    private Resume mapToEntity(ResumeDTO dto) {
        Resume entity = new Resume();
        entity.setResumeId(dto.getResumeId());
        JobSeeker jobSeeker = jobSeekerRepository.findById(dto.getJobSeekerId())
                .orElseThrow(() -> {
                    logger.error("JobSeeker not found with ID: {}", dto.getJobSeekerId());
                    return new ResourceNotFoundException("JobSeeker not found with id " + dto.getJobSeekerId());
                });
        entity.setJobSeeker(jobSeeker);
        entity.setFilePath(dto.getFilePath());
        entity.setPrimary(dto.isPrimary());
        if (entity.getUploadDate() == null) {
            entity.setUploadDate(LocalDateTime.now());
        }
        return entity;
    }
}
