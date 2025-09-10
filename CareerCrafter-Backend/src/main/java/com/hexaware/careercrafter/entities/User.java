package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;


/*
 * Entity which is representing a user in the system
 * A user can be a JobSeeker or Employer
 * Contains basic user details
 */


@Entity
@Table(name = "users")
public class User {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int userId;
	
	@Column(nullable = false)
    private String name;
	
	@Column(nullable = false, unique = true)
    private String email;
	
	@Column(nullable = false)
    private String password;
	
	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;
	
	private boolean active = true;
	
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private JobSeeker jobSeeker;
	
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Employer employer;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SearchRecommendation> searchRecommendations;
	
	public enum UserType {
        JOBSEEKER, EMPLOYER
    }
	
	public User() {
		
	}

	public User(int userId, String name, String email, String password, UserType userType, boolean isActive,
			LocalDateTime createdAt, JobSeeker jobSeeker, Employer employer,
			List<SearchRecommendation> searchRecommendations) {
		super();
		this.userId = userId;
		this.name = name;
		this.email = email;
		this.password = password;
		this.userType = userType;
		this.active = isActive;
		this.createdAt = createdAt;
		this.jobSeeker = jobSeeker;
		this.employer = employer;
		this.searchRecommendations = searchRecommendations;
	}
	
	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();
	}
	
	public String getRoleName() {
        return "ROLE_" + this.userType.name();
    }

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public JobSeeker getJobSeeker() {
		return jobSeeker;
	}

	public void setJobSeeker(JobSeeker jobSeeker) {
		this.jobSeeker = jobSeeker;
	}

	public Employer getEmployer() {
		return employer;
	}

	public void setEmployer(Employer employer) {
		this.employer = employer;
	}

	public List<SearchRecommendation> getSearchRecommendations() {
		return searchRecommendations;
	}

	public void setSearchRecommendations(List<SearchRecommendation> searchRecommendations) {
		this.searchRecommendations = searchRecommendations;
	}
	
}
