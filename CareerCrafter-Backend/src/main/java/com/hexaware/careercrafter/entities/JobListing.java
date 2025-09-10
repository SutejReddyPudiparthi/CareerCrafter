package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import java.util.List;

/*
 * Entity representing a JobListing is made my an employer
 * It contains job details
 * It is linked to an employer and also connected to applications
 */

@Entity
@Table(name = "job_listings")
public class JobListing {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int jobListingId;
	
	@ManyToOne
	@JoinColumn(name = "employer_id", nullable = false)
	private Employer employer;
	
	@Column(length = 150)
	private String companyName;

	@Column(nullable = false)
	private String title;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String description;
	
	private String qualification;
	
	private Integer experience;

	private String location;
	
	@Min(value = 0, message = "Salary can't be negative")
	private Integer salary;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private JobType jobType;
	
	@Column(name = "required_skills")
	private String requiredSkills;

	@Column
	private LocalDate postedDate;
	
	private boolean active = true;

	@OneToMany(mappedBy = "jobListing", cascade = CascadeType.ALL)
	private List<Application> applications;

	public enum JobType {
		FULL_TIME, PART_TIME, INTERNSHIP
	}
	
	public JobListing() {
		
	}

	public JobListing(int jobListingId, Employer employer, String title, String description, String qualification, String location,
			JobType jobType, LocalDate postedDate, boolean active, String companyName, Integer experience, Integer salary, String requiredSkills, 
			List<Application> applications) {
		super();
		this.jobListingId = jobListingId;
		this.employer = employer;
		this.title = title;
		this.description = description;
		this.qualification = qualification;
		this.location = location;
		this.companyName = companyName;
        this.experience = experience;
		this.jobType = jobType;
		this.postedDate = postedDate;
		this.active = active;
		this.applications = applications;
		this.salary = salary;
		this.requiredSkills = requiredSkills;
		
	}

	public int getJobListingId() {
		return jobListingId;
	}

	public void setJobListingId(int jobListingId) {
		this.jobListingId = jobListingId;
	}

	public Employer getEmployer() {
		return employer;
	}

	public void setEmployer(Employer employer) {
		this.employer = employer;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }
    
	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}
	
	public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

	public JobType getJobType() {
		return jobType;
	}

	public void setJobType(JobType jobType) {
		this.jobType = jobType;
	}

	public LocalDate getPostedDate() {
		return postedDate;
	}

	public void setPostedDate(LocalDate postedDate) {
		this.postedDate = postedDate;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public List<Application> getApplications() {
		return applications;
	}

	public void setApplications(List<Application> applications) {
		this.applications = applications;
	}
	
	public Integer getSalary() {
	    return salary;
	}

	public void setSalary(Integer salary) {
	    this.salary = salary;
	}
	
	public String getRequiredSkills() {
	    return requiredSkills;
	}

	public void setRequiredSkills(String requiredSkills) {
	    this.requiredSkills = requiredSkills;
	}

}
