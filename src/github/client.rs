// GitHub API client for fetching repository data
// Handles authentication, rate limiting, and data fetching
#![allow(dead_code)]

use anyhow::{anyhow, Result};
use reqwest::header::{HeaderMap, HeaderValue, ACCEPT, AUTHORIZATION, USER_AGENT};
use serde::de::DeserializeOwned;
use std::env;

use super::{GitHubLanguages, GitHubRepo};

pub struct GitHubClient {
    client: reqwest::Client,
    base_url: String,
    token: Option<String>,
}

impl GitHubClient {
    pub fn new() -> Result<Self> {
        let token = env::var("GITHUB_TOKEN").ok();

        let mut headers = HeaderMap::new();
        headers.insert(USER_AGENT, HeaderValue::from_static("portfolio-arcade"));
        headers.insert(
            ACCEPT,
            HeaderValue::from_static("application/vnd.github.v3+json"),
        );

        if let Some(ref token) = token {
            headers.insert(
                AUTHORIZATION,
                HeaderValue::from_str(&format!("Bearer {}", token))?,
            );
        }

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .build()?;

        Ok(Self {
            client,
            base_url: "https://api.github.com".to_string(),
            token,
        })
    }

    /// Fetch repository information
    pub async fn get_repo(&self, owner: &str, repo: &str) -> Result<GitHubRepo> {
        let url = format!("{}/repos/{}/{}", self.base_url, owner, repo);
        self.fetch(&url).await
    }

    /// Fetch repository languages with byte counts
    pub async fn get_languages(&self, owner: &str, repo: &str) -> Result<GitHubLanguages> {
        let url = format!("{}/repos/{}/{}/languages", self.base_url, owner, repo);
        let languages_map: std::collections::HashMap<String, u32> = self.fetch(&url).await?;

        Ok(GitHubLanguages {
            languages: languages_map,
        })
    }

    /// Fetch README content
    pub async fn get_readme(&self, owner: &str, repo: &str) -> Result<String> {
        let url = format!("{}/repos/{}/{}/readme", self.base_url, owner, repo);

        let mut headers = HeaderMap::new();
        headers.insert(
            ACCEPT,
            HeaderValue::from_static("application/vnd.github.v3.raw"),
        );

        let response = self.client.get(&url).headers(headers).send().await?;

        if !response.status().is_success() {
            return Err(anyhow!("Failed to fetch README: {}", response.status()));
        }

        Ok(response.text().await?)
    }

    /// Generic fetch method for JSON responses
    async fn fetch<T: DeserializeOwned>(&self, url: &str) -> Result<T> {
        let response = self.client.get(url).send().await?;

        if !response.status().is_success() {
            return Err(anyhow!(
                "GitHub API request failed: {} - {}",
                response.status(),
                response.text().await?
            ));
        }

        Ok(response.json().await?)
    }

    /// Check if authentication token is set
    pub fn is_authenticated(&self) -> bool {
        self.token.is_some()
    }
}

impl Default for GitHubClient {
    fn default() -> Self {
        Self::new().expect("Failed to create GitHub client")
    }
}
