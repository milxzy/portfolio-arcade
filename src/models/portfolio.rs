// portfolio configuration data structures
// represents all the user info and settings needed for generation

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortfolioConfig {
    pub user: UserInfo,
    pub projects: Vec<Project>,
    pub theme: String, // "ps3", "ps5", "wii"
    pub cms: CmsType,
    pub dev_port: u16,
}

impl Default for PortfolioConfig {
    fn default() -> Self {
        Self {
            user: UserInfo::default(),
            projects: vec![create_sample_project()],
            theme: "ps5".to_string(), // default to most modern theme
            cms: CmsType::Decap,      // recommended for beginners
            dev_port: 3000,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    pub name: String,
    pub title: String,
    pub bio: String,
    pub avatar: String,
    pub social: SocialLinks,
}

impl Default for UserInfo {
    fn default() -> Self {
        Self {
            name: "your name".to_string(),
            title: "software developer".to_string(),
            bio: "passionate about creating amazing digital experiences".to_string(),
            avatar: "/images/avatar.jpg".to_string(),
            social: SocialLinks::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SocialLinks {
    pub github: Option<String>,
    pub linkedin: Option<String>,
    pub email: Option<String>,
    pub website: Option<String>,
    pub twitter: Option<String>,
}

impl Default for SocialLinks {
    fn default() -> Self {
        Self {
            github: Some("https://github.com/username".to_string()),
            linkedin: Some("https://linkedin.com/in/username".to_string()),
            email: Some("hello@example.com".to_string()),
            website: None,
            twitter: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub title: String,
    pub description: String,
    pub full_description: String,
    pub tech_stack: Vec<String>,
    pub category: String,
    pub featured: bool,
    pub links: ProjectLinks,
    pub date: String,
    pub thumbnail: String,
    pub screenshots: Vec<String>,
    // theme-specific data will be added by adapters
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectLinks {
    pub github: Option<String>,
    pub live: Option<String>,
    pub demo: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum CmsType {
    Decap,   // git-based cms (netlify cms successor)
    Payload, // self-hosted headless cms
    None,    // manual json editing
}

impl std::fmt::Display for CmsType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CmsType::Decap => write!(f, "git-based (decap cms)"),
            CmsType::Payload => write!(f, "self-hosted (payload cms)"),
            CmsType::None => write!(f, "none - manual json editing"),
        }
    }
}

// creates a sample project to help users get started
fn create_sample_project() -> Project {
    Project {
        id: "portfolio-website".to_string(),
        title: "portfolio website".to_string(),
        description: "a modern, responsive portfolio website showcasing my projects and skills".to_string(),
        full_description: "built with modern web technologies, this portfolio website features a clean design, smooth animations, and optimal performance. showcases my development skills and project portfolio in an engaging, user-friendly interface.".to_string(),
        tech_stack: vec![
            "react".to_string(),
            "next.js".to_string(), 
            "typescript".to_string(),
            "tailwind css".to_string(),
        ],
        category: "web development".to_string(),
        featured: true,
        links: ProjectLinks {
            github: Some("https://github.com/username/portfolio".to_string()),
            live: Some("https://yourname.dev".to_string()),
            demo: None,
        },
        date: "2024-01".to_string(),
        thumbnail: "/projects/portfolio-thumb.jpg".to_string(),
        screenshots: vec![
            "/projects/portfolio-1.jpg".to_string(),
            "/projects/portfolio-2.jpg".to_string(),
        ],
        extra: HashMap::new(),
    }
}
