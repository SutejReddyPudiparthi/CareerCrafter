package com.hexaware.careercrafter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("CareerCrafter API Documentation")
                .version("1.0")
                .description("CareerCrafter Backend REST API documentation")
                .contact(new Contact().name("Support Team").email("support@careercrafter.com"))
                .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
