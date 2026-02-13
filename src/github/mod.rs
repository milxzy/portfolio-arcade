// GitHub API integration for fetching repository data
// Fetches project information, languages, and README content

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

pub mod client;

pub use client::GitHubClient;

// GitHub API response structures
#[derive(Debug, Deserialize)]
pub struct GitHubRepo {
    pub id: u64,
    pub name: String,
    pub full_name: String,
    pub description: Option<String>,
    pub html_url: String,
    pub homepage: Option<String>,
    pub language: Option<String>,
    pub stargazers_count: u32,
    pub forks_count: u32,
    pub topics: Vec<String>,
    pub created_at: String,
    pub updated_at: String,
    pub pushed_at: String,
    pub default_branch: String,
}

#[derive(Debug, Deserialize)]
pub struct GitHubLanguages {
    #[serde(flatten)]
    pub languages: HashMap<String, u32>,
}

#[derive(Debug, Serialize)]
pub struct ProjectData {
    pub id: String,
    pub title: String,
    pub description: String,
    pub full_description: String,
    pub category: String,
    pub tech_stack: Vec<String>,
    pub featured: bool,
    pub links: ProjectLinks,
    pub thumbnail: String,
    pub screenshots: Vec<String>,
    pub date: String,
    pub stars: u32,
    pub forks: u32,
    pub extra: HashMap<String, String>,
}

#[derive(Debug, Serialize)]
pub struct ProjectLinks {
    pub github: Option<String>,
    pub live: Option<String>,
    pub demo: Option<String>,
}

// Parse GitHub URL to extract owner and repo name
pub fn parse_github_url(url: &str) -> Result<(String, String)> {
    let url = url.trim_end_matches('/').trim_end_matches(".git");
    
    if let Some(captures) = regex::Regex::new(r"github\.com/([^/]+)/([^/]+)")
        .unwrap()
        .captures(url) 
    {
        let owner = captures.get(1).unwrap().as_str().to_string();
        let repo = captures.get(2).unwrap().as_str().to_string();
        Ok((owner, repo))
    } else {
        Err(anyhow!("Invalid GitHub URL format: {}", url))
    }
}

// Convert language bytes to percentages and tech stack
pub fn process_languages(languages: &GitHubLanguages) -> Vec<String> {
    let total_bytes: u32 = languages.languages.values().sum();
    
    if total_bytes == 0 {
        return vec!["Unknown".to_string()];
    }
    
    let mut lang_percentages: Vec<(String, f32)> = languages
        .languages
        .iter()
        .map(|(lang, bytes)| {
            let percentage = (*bytes as f32 / total_bytes as f32) * 100.0;
            (lang.clone(), percentage)
        })
        .collect();
    
    // Sort by percentage, highest first
    lang_percentages.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    
    // Return languages with >5% usage, or top 3 if all are small
    let significant_langs: Vec<String> = lang_percentages
        .iter()
        .filter(|(_, percentage)| *percentage >= 5.0)
        .map(|(lang, _)| lang.clone())
        .collect();
    
    if significant_langs.is_empty() {
        // If no significant languages, return top 3
        lang_percentages
            .into_iter()
            .take(3)
            .map(|(lang, _)| lang)
            .collect()
    } else {
        significant_langs
    }
}