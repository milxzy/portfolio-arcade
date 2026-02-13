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
            // Calculate priority scores based on GitHub metrics and position
            let stars = project.extra.get("stars")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);
            let has_live = project.links.live.is_some();
            
            // Projects with more stars and live demos rank higher for recruiters
            let recruiter_priority = if has_live && stars > 10 { i + 1 } else { i + 5 };
            // Recent projects with good tech stacks rank higher for engineers
            let engineer_priority = if project.tech_stack.len() > 3 { i + 1 } else { i + 3 };
            // Featured projects rank higher for strangers
            let stranger_priority = if project.featured { i + 1 } else { i + 4 };
            
            // Calculate achievements based on project completeness
            let has_description = !project.full_description.is_empty();
            let has_links = project.links.github.is_some() || project.links.live.is_some();
            let has_tech = !project.tech_stack.is_empty();
            let achievements = 5 + 
                (if has_description { 2 } else { 0 }) +
                (if has_links { 2 } else { 0 }) +
                (if has_tech { 2 } else { 0 }) +
                (if stars > 5 { 1 } else { 0 }) +
                (if has_live { 2 } else { 0 });
            
            let total_achievements = 14;
            let progress = ((achievements as f32 / total_achievements as f32) * 100.0) as u32;
            
            // Use placeholder images if none provided
            let cover_image = if !project.thumbnail.is_empty() {
                project.thumbnail.clone()
            } else {
                format!("https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400&h=400&fit=crop&seed={}", i)
            };
            
            let background_image = if !project.thumbnail.is_empty() {
                project.thumbnail.clone()
            } else {
                format!("https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1920&h=1080&fit=crop&seed={}", i)
            };
            
            let mut adapted = serde_json::json!({
                "id": project.id,
                "title": project.title,
                "subtitle": project.category,
                "description": project.description,
                "fullDescription": project.full_description,
                "techStack": project.tech_stack,
                "achievements": achievements,
                "totalAchievements": total_achievements,
                "progress": progress,
                "coverImage": cover_image,
                "backgroundImage": background_image,
                "liveUrl": project.links.live,
                "githubUrl": project.links.github,
                "demoVideo": project.links.demo,
                "screenshots": project.screenshots,
                "priority": {
                    "recruiter": recruiter_priority,
                    "engineer": engineer_priority,
                    "stranger": stranger_priority
                }
            });

            // merge any extra fields (stars, forks, topics, etc.)
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
            // Auto-categorize based on tech stack and GitHub data
            let mut categories = vec![project.category.replace(" ", "-").to_lowercase()];

            // Add profile-based categories
            let stars = project
                .extra
                .get("stars")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);

            if project.links.live.is_some() && stars > 10 {
                categories.push("recruiter".to_string());
            }
            if project.tech_stack.len() > 3 {
                categories.push("engineer".to_string());
            }
            if project.featured {
                categories.push("creative".to_string());
            }

            // Auto-assign to Wii channels based on tech and type
            if project.links.live.is_some() {
                categories.push("web-apps".to_string());
            }
            if project.links.github.is_some() {
                categories.push("open-source".to_string());
            }

            serde_json::json!({
                "id": project.id,
                "title": project.title,
                "tagline": project.description,
                "description": project.full_description,
                "techStack": project.tech_stack,
                "liveUrl": project.links.live,
                "githubUrl": project.links.github,
                "category": categories,
                "featured": project.featured,
                "stars": project.extra.get("stars"),
                "forks": project.extra.get("forks"),
            })
        })
        .collect();

    Ok(Value::Array(adapted))
}

// adapts project data for ps3 template format
fn adapt_for_ps3(projects: &[Project]) -> Result<Value> {
    let adapted: Vec<Value> = projects
        .iter()
        .enumerate()
        .map(|(i, project)| {
            // Calculate profile priority based on GitHub metrics
            let stars = project
                .extra
                .get("stars")
                .and_then(|v| v.as_u64())
                .unwrap_or(0);
            let has_live = project.links.live.is_some();

            let mut profile_priority = vec![];

            // High stars + live site = great for recruiters
            if has_live && stars > 10 {
                profile_priority.push("recruiter");
            }
            // Complex tech stack = interesting for engineers
            if project.tech_stack.len() > 3 {
                profile_priority.push("engineer");
            }
            // Featured projects = fun for strangers
            if project.featured {
                profile_priority.push("stranger");
            }

            // If no specific priority, add to all
            if profile_priority.is_empty() {
                profile_priority = vec!["recruiter", "engineer", "stranger"];
            }

            // Build links array for PS3 format
            let mut links = vec![];
            if let Some(github) = &project.links.github {
                links.push(serde_json::json!({
                    "label": "GitHub",
                    "url": github
                }));
            }
            if let Some(live) = &project.links.live {
                links.push(serde_json::json!({
                    "label": "Live Demo",
                    "url": live
                }));
            }
            if let Some(demo) = &project.links.demo {
                links.push(serde_json::json!({
                    "label": "Demo Video",
                    "url": demo
                }));
            }

            let mut adapted = serde_json::json!({
                "id": project.id,
                "label": project.title,
                "subtitle": project.category,
                "description": project.full_description,
                "date": project.date,
                "tags": project.tech_stack,
                "links": links,
                "profilePriority": profile_priority,
            });

            // Add extra GitHub metadata
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
