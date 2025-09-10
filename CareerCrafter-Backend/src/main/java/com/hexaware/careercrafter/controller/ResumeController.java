package com.hexaware.careercrafter.controller;

import com.hexaware.careercrafter.dto.ResumeDTO;
import com.hexaware.careercrafter.service.IResumeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;

/*
 * Rest Controller for resume operations.
 */

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Resumes", description = "Resume upload, update, and download APIs")
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);

    @Autowired
    private IResumeService resumeService;

    @PreAuthorize("hasRole('JOBSEEKER')")
    @Operation(summary = "Upload resume file")
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeDTO> uploadResume(@RequestParam("jobSeekerId") int jobSeekerId,
                                                  @RequestPart("file") MultipartFile file) throws IOException {
        logger.info("Request to upload resume for jobSeekerId: {}", jobSeekerId);
        String fileName = file.getOriginalFilename();
        String fileStoragePath = "./resumes/" + jobSeekerId + "_" + System.currentTimeMillis() + "_" + fileName;
        java.nio.file.Files.createDirectories(java.nio.file.Paths.get("./resumes/"));
        file.transferTo(java.nio.file.Paths.get(fileStoragePath));
        ResumeDTO resumeDTO = new ResumeDTO();
        resumeDTO.setJobSeekerId(jobSeekerId);
        resumeDTO.setFilePath(fileStoragePath);
        resumeDTO.setPrimary(true);
        ResumeDTO created = resumeService.uploadResume(resumeDTO);
        logger.info("Resume uploaded successfully with ID: {}", created.getResumeId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOBSEEKER')")
    @Operation(summary = "Get resume metadata by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ResumeDTO> getResumeById(@PathVariable int id) {
        logger.info("Request to fetch resume with ID: {}", id);
        ResumeDTO resume = resumeService.getResumeById(id);
        logger.info("Successfully fetched resume with ID: {}", id);
        return ResponseEntity.ok(resume);
    }

    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOBSEEKER')")
    @Operation(summary = "Get resumes by job seeker ID")
    @GetMapping("/jobseeker/{jobSeekerId}")
    public ResponseEntity<List<ResumeDTO>> getResumesByJobSeekerId(@PathVariable int jobSeekerId) {
        logger.info("Request to fetch resumes for jobSeekerId: {}", jobSeekerId);
        List<ResumeDTO> resumes = resumeService.getResumesByJobSeekerId(jobSeekerId);
        logger.info("Fetched {} resumes for jobSeekerId: {}", resumes.size(), jobSeekerId);
        return ResponseEntity.ok(resumes);
    }

    @PreAuthorize("hasRole('JOBSEEKER')")
    @Operation(summary = "Update resume metadata")
    @PutMapping
    public ResponseEntity<ResumeDTO> updateResume(@Valid @RequestBody ResumeDTO resumeDTO) {
        logger.info("Request to update resume with ID: {}", resumeDTO.getResumeId());
        ResumeDTO updated = resumeService.updateResume(resumeDTO);
        logger.info("Resume with ID {} updated successfully", resumeDTO.getResumeId());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOBSEEKER')")
    @Operation(summary = "Delete resume by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable int id) {
        logger.info("Request to delete resume with ID: {}", id);
        resumeService.deleteResume(id);
        logger.info("Resume with ID {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Download or view resume file")
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadResumeFile(@PathVariable int id, @RequestParam(value = "inline", defaultValue = "false") boolean inline) throws MalformedURLException, IOException {
        logger.info("Request to {} resume file with ID: {}", inline ? "view" : "download", id);
        
        ResumeDTO resumeDTO;
        try {
            resumeDTO = resumeService.getResumeById(id);
        } catch (Exception ex) {
            logger.error("Resume ID {} not found", id);
            return ResponseEntity.notFound().build();
        }
        java.nio.file.Path path = java.nio.file.Paths.get(resumeDTO.getFilePath());
        if (!java.nio.file.Files.exists(path)) {
            logger.error("Resume file not found at path: {}", resumeDTO.getFilePath());
            return ResponseEntity.notFound().build();
        }
        Resource resource = new org.springframework.core.io.UrlResource(path.toUri());
        String contentType;
        try {
            contentType = java.nio.file.Files.probeContentType(path);
        } catch (IOException ex) {
            logger.warn("Could not determine content type, defaulting to application/octet-stream");
            contentType = "application/octet-stream";
        }
        
        String fileName = path.getFileName().toString();
        String disposition = inline ? "inline" : "attachment";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + fileName + "\"")
                .body(resource);
    }
}