package com.hexaware.careercrafter.exception;

public class DuplicateResourceException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	/*
	 * Exception thrown when an attempt is made for that which is already exists.
	 */
	
	public DuplicateResourceException(String message) {
        super(message);
    }
	
}
