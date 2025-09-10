package com.hexaware.careercrafter.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/*
 * REST controller for fetching details of authenticated user.
 */

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Authenticated User", description = "Fetch logged-in user details")
public class AuthUserController {

    @Operation(summary = "Get authenticated username or anonymous")
    @GetMapping("/me")
    public String me(Authentication auth) {
        if (auth == null) {
            return "anonymous";
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}
