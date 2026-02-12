// theme definitions and metadata for console templates
// each theme knows how to adapt data for its specific template format

use crate::models::portfolio::{PortfolioConfig, Project};
use anyhow::Result;
use serde_json::Value;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct Theme {
    pub id: String,
    pub display_name: String,
    pub description: String,
    pub template_dir: String,
}

impl Theme {
    // returns all available console themes
    pub fn available_themes() -> Vec<Theme> {
        vec![
            Theme {
                id: "ps3".to_string(),
                display_name: "ps3 xmb interface".to_string(),
                description: "classic crossbar menu design with smooth navigation".to_string(),
                template_dir: "ps3-template".to_string(),
            },
            Theme {
                id: "ps5".to_string(),
                display_name: "ps5 modern ui".to_string(),
                description: "sleek, modern interface with user profiles and game library"
                    .to_string(),
                template_dir: "ps5-template".to_string(),
            },
            Theme {
                id: "wii".to_string(),
                display_name: "wii channel menu".to_string(),
                description: "friendly grid layout with colorful channel tiles".to_string(),
                template_dir: "wii-template".to_string(),
            },
        ]
    }

    // finds a theme by its id
    pub fn find_by_id(id: &str) -> Option<Theme> {
        Self::available_themes().into_iter().find(|t| t.id == id)
    }

    // adapts portfolio data to theme-specific format
    pub fn adapt_projects(&self, projects: &[Project]) -> Result<Value> {
        match self.id.as_str() {
            "ps5" => adapt_for_ps5(projects),
            "wii" => adapt_for_wii(projects),
            "ps3" => adapt_for_ps3(projects),
            _ => Ok(serde_json::to_value(projects)?),
        }
    }

    // updates the template's layout file with user information
    pub fn update_layout(&self, layout_path: &Path, config: &PortfolioConfig) -> Result<()> {
        let content = std::fs::read_to_string(layout_path)?;
        let updated = match self.id.as_str() {
            "ps5" => update_ps5_layout(content, config),
            "wii" => update_wii_layout(content, config),
            "ps3" => update_ps3_layout(content, config),
            _ => content,
        };
        std::fs::write(layout_path, updated)?;
        Ok(())
    }
}

// adapts project data for ps5 template format
fn adapt_for_ps5(projects: &[Project]) -> Result<Value> {
    let adapted: Vec<Value> = projects
        .iter()
        .enumerate()
        .map(|(i, project)| {
            let mut adapted = serde_json::json!({
                "id": project.id,
                "title": project.title,
                "subtitle": project.category,
                "description": project.description,
                "fullDescription": project.full_description,
                "techStack": project.tech_stack,
                "achievements": 8 + (i % 5),  // mock achievement count
                "totalAchievements": 10 + (i % 3),
                "progress": 75 + (i % 25),
                "coverImage": project.thumbnail,
                "backgroundImage": project.thumbnail,
                "liveUrl": project.links.live,
                "githubUrl": project.links.github,
                "demoVideo": project.links.demo,
                "screenshots": project.screenshots,
                "priority": {
                    "recruiter": i + 1,
                    "engineer": i + 2,
                    "stranger": i + 3
                }
            });

            // merge any extra fields
            if let Ok(Value::Object(extra_map)) = serde_json::to_value(&project.extra) {
                if let Value::Object(ref mut adapted_map) = adapted {
                    adapted_map.extend(extra_map);
                }
            }

            adapted
        })
        .collect();

    Ok(Value::Array(adapted))
}

// adapts project data for wii template format
fn adapt_for_wii(projects: &[Project]) -> Result<Value> {
    let adapted: Vec<Value> = projects
        .iter()
        .map(|project| {
            serde_json::json!({
                "id": project.id,
                "title": project.title,
                "tagline": project.description,
                "description": project.full_description,
                "techStack": project.tech_stack,
                "liveUrl": project.links.live,
                "githubUrl": project.links.github,
                "category": [project.category.replace(" ", "-").to_lowercase()],
                "featured": project.featured
            })
        })
        .collect();

    Ok(Value::Array(adapted))
}

// adapts project data for ps3 template format
fn adapt_for_ps3(projects: &[Project]) -> Result<Value> {
    // ps3 template uses a simpler format
    Ok(serde_json::to_value(projects)?)
}

// updates ps5 layout.tsx with user info
fn update_ps5_layout(content: String, config: &PortfolioConfig) -> String {
    content
        .replace(
            "MilxOS | Developer Portfolio",
            &format!("{} | Developer Portfolio", config.user.name),
        )
        .replace(
            "a ps5-inspired developer portfolio showcasing projects and skills",
            &config.user.bio,
        )
}

// updates wii layout.tsx with user info
fn update_wii_layout(content: String, config: &PortfolioConfig) -> String {
    content
        .replace(
            "Wii Portfolio | Developer Channel Menu",
            &format!("{} | Portfolio Channel Menu", config.user.name),
        )
        .replace(
            "A creative developer portfolio styled like the Nintendo Wii Channel Menu",
            &config.user.bio,
        )
}

// updates ps3 layout.tsx with user info
fn update_ps3_layout(content: String, config: &PortfolioConfig) -> String {
    content
        .replace("Portfolio OS | Developer Portfolio", &format!("{} | Portfolio", config.user.name))
        .replace("A developer portfolio styled like the PlayStation 3 XrossMediaBar interface. Navigate projects, skills, and contact info with keyboard or mouse.", &config.user.bio)
}
