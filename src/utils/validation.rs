// input validation utilities
// ensures user input is safe and valid
// these functions are kept for testing and potential future use in the TUI

use regex::Regex;

// validates project name - alphanumeric, hyphens, underscores only
#[allow(dead_code)]
pub fn validate_project_name(name: &str) -> Result<(), String> {
    if name.trim().is_empty() {
        return Err("project name cannot be empty".to_string());
    }

    if name.len() > 50 {
        return Err("project name is too long (max 50 characters)".to_string());
    }

    // check for valid characters
    let re = Regex::new(r"^[a-zA-Z0-9\-_]+$").unwrap();
    if !re.is_match(name) {
        return Err(
            "project name can only contain letters, numbers, hyphens, and underscores".to_string(),
        );
    }

    // can't start with a hyphen
    if name.starts_with('-') {
        return Err("project name cannot start with a hyphen".to_string());
    }

    Ok(())
}

// validates port number
#[allow(dead_code)]
pub fn validate_port(port_str: &str) -> Result<u16, String> {
    match port_str.parse::<u16>() {
        Ok(port) => {
            if port < 1024 {
                Err("port must be 1024 or higher".to_string())
            } else {
                Ok(port)
            }
        }
        Err(_) => Err("port must be a valid number".to_string()),
    }
}

// validates email format (basic)
#[allow(dead_code)]
pub fn validate_email(email: &str) -> Result<(), String> {
    if email.trim().is_empty() {
        return Ok(()); // empty email is allowed
    }

    let re = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    if !re.is_match(email) {
        return Err("invalid email format".to_string());
    }

    Ok(())
}

// validates url format (basic)
#[allow(dead_code)]
pub fn validate_url(url: &str) -> Result<(), String> {
    if url.trim().is_empty() {
        return Ok(()); // empty url is allowed
    }

    let re = Regex::new(r"^https?://[^\s/$.?#].[^\s]*$").unwrap();
    if !re.is_match(url) {
        return Err("invalid url format (must start with http:// or https://)".to_string());
    }

    Ok(())
}

// sanitizes user input for file names
#[allow(dead_code)]
pub fn sanitize_filename(input: &str) -> String {
    input
        .chars()
        .map(|c| match c {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '-' | '_' | '.' => c,
            ' ' => '-',
            _ => '_',
        })
        .collect::<String>()
        .to_lowercase()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_project_name() {
        assert!(validate_project_name("my-portfolio").is_ok());
        assert!(validate_project_name("portfolio_2024").is_ok());
        assert!(validate_project_name("MyPortfolio123").is_ok());

        assert!(validate_project_name("").is_err());
        assert!(validate_project_name("-invalid").is_err());
        assert!(validate_project_name("invalid!").is_err());
    }

    #[test]
    fn test_validate_port() {
        assert!(validate_port("3000").is_ok());
        assert!(validate_port("8080").is_ok());

        assert!(validate_port("80").is_err()); // too low
        assert!(validate_port("invalid").is_err());
    }

    #[test]
    fn test_sanitize_filename() {
        assert_eq!(sanitize_filename("My Project!"), "my-project_");
        assert_eq!(sanitize_filename("Hello World 2024"), "hello-world-2024");
    }
}
