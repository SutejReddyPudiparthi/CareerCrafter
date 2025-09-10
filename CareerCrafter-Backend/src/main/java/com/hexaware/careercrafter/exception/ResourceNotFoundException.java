package com.hexaware.careercrafter.exception;

public class ResourceNotFoundException extends RuntimeException {
    
	private static final long serialVersionUID = 1L;

	/*
	 * Exception thrown when a requested resource cannot be found.
	 */
	
	public ResourceNotFoundException(String message) {
        super(message);
    }
}
