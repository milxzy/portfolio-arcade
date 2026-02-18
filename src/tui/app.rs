// main tui application state and logic
// orchestrates the user flow from theme selection to project generation

use crate::generator::TemplateGenerator;
use crate::models::{PortfolioConfig, Theme};
use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{backend::CrosstermBackend, Terminal};
use std::io;

#[derive(Debug, Clone, PartialEq)]
pub enum Screen {
    ThemeSelection,
    ProjectDetails,
    GitHubProjects,
    Confirmation,
    Progress,
    Complete,
}

pub struct App {
    pub current_screen: Screen,
    pub config: PortfolioConfig,
    pub themes: Vec<Theme>,
    pub selected_theme_idx: usize,
    pub input_fields: InputFields,
    pub current_input: InputField,
    pub should_quit: bool,
    pub error_message: Option<String>,
    pub progress_message: String,
}

#[derive(Debug, Clone)]
pub struct InputFields {
    pub project_name: String,
    pub author_name: String,
    pub title: String,
    pub github_projects: Vec<String>,
    pub current_github_url: String,
}

#[derive(Debug, Clone, PartialEq)]
#[allow(dead_code)]
pub enum InputField {
    ProjectName,
    AuthorName,
    Title,
    GitHubUrl,
}

impl App {
    pub fn new(project_name: Option<String>) -> Self {
        let themes = Theme::available_themes();
        let config = PortfolioConfig::default();

        let input_fields = InputFields {
            project_name: project_name.unwrap_or_else(|| "my-portfolio".to_string()),
            author_name: config.user.name.clone(),
            title: config.user.title.clone(),
            github_projects: Vec::new(),
            current_github_url: String::new(),
        };

        Self {
            current_screen: Screen::ThemeSelection,
            config,
            themes,
            selected_theme_idx: 1, // default to ps5
            input_fields,
            current_input: InputField::ProjectName,
            should_quit: false,
            error_message: None,
            progress_message: String::new(),
        }
    }

    pub async fn run(mut self) -> Result<()> {
        // setup terminal
        enable_raw_mode()?;
        let mut stdout = io::stdout();
        execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
        let backend = CrosstermBackend::new(stdout);
        let mut terminal = Terminal::new(backend)?;

        let result = self.run_app(&mut terminal).await;

        // restore terminal
        disable_raw_mode()?;
        execute!(
            terminal.backend_mut(),
            LeaveAlternateScreen,
            DisableMouseCapture
        )?;
        terminal.show_cursor()?;

        if let Err(e) = result {
            eprintln!("error: {}", e);
        }

        Ok(())
    }

    async fn run_app(
        &mut self,
        terminal: &mut Terminal<CrosstermBackend<std::io::Stdout>>,
    ) -> Result<()> {
        loop {
            // draw the ui
            terminal.draw(|f| crate::tui::ui::draw(f, self))?;

            // handle input events
            if event::poll(std::time::Duration::from_millis(100))? {
                if let Event::Key(key) = event::read()? {
                    if self.handle_input(key.code).await? {
                        break;
                    }
                }
            }

            // check if we should quit
            if self.should_quit {
                break;
            }
        }

        Ok(())
    }

    async fn handle_input(&mut self, key: KeyCode) -> Result<bool> {
        match key {
            KeyCode::Char('q') | KeyCode::Esc => {
                self.should_quit = true;
                return Ok(true);
            }
            _ => {}
        }

        match self.current_screen {
            Screen::ThemeSelection => self.handle_theme_selection(key),
            Screen::ProjectDetails => self.handle_project_details(key),
            Screen::GitHubProjects => self.handle_github_projects(key).await,
            Screen::Confirmation => self.handle_confirmation(key).await?,
            Screen::Progress => {
                // progress screen doesn't accept input
            }
            Screen::Complete => {
                // any key exits
                self.should_quit = true;
                return Ok(true);
            }
        }

        Ok(false)
    }

    fn handle_theme_selection(&mut self, key: KeyCode) {
        match key {
            KeyCode::Up => {
                if self.selected_theme_idx > 0 {
                    self.selected_theme_idx -= 1;
                }
            }
            KeyCode::Down => {
                if self.selected_theme_idx < self.themes.len() - 1 {
                    self.selected_theme_idx += 1;
                }
            }
            KeyCode::Enter => {
                self.config.theme = self.themes[self.selected_theme_idx].id.clone();
                self.current_screen = Screen::ProjectDetails;
            }
            _ => {}
        }
    }

    fn handle_project_details(&mut self, key: KeyCode) {
        match key {
            KeyCode::Tab => {
                self.current_input = match self.current_input {
                    InputField::ProjectName => InputField::AuthorName,
                    InputField::AuthorName => InputField::Title,
                    InputField::Title => InputField::ProjectName,
                    InputField::GitHubUrl => InputField::ProjectName,
                };
            }
            KeyCode::Up => {
                self.current_input = match self.current_input {
                    InputField::ProjectName => InputField::Title,
                    InputField::AuthorName => InputField::ProjectName,
                    InputField::Title => InputField::AuthorName,
                    InputField::GitHubUrl => InputField::Title,
                };
            }
            KeyCode::Down => {
                self.current_input = match self.current_input {
                    InputField::ProjectName => InputField::AuthorName,
                    InputField::AuthorName => InputField::Title,
                    InputField::Title => InputField::ProjectName,
                    InputField::GitHubUrl => InputField::ProjectName,
                };
            }
            KeyCode::BackTab => {
                self.current_input = match self.current_input {
                    InputField::ProjectName => InputField::Title,
                    InputField::AuthorName => InputField::ProjectName,
                    InputField::Title => InputField::AuthorName,
                    InputField::GitHubUrl => InputField::Title,
                };
            }
            KeyCode::Enter => {
                if self.validate_basic_inputs() {
                    self.current_screen = Screen::GitHubProjects;
                }
            }
            KeyCode::Char(c) => {
                self.add_char_to_current_input(c);
            }
            KeyCode::Backspace | KeyCode::Delete => {
                self.delete_char_from_current_input();
            }
            KeyCode::Esc => {
                self.current_screen = Screen::ThemeSelection;
            }
            _ => {}
        }
    }

    async fn handle_github_projects(&mut self, key: KeyCode) {
        match key {
            KeyCode::Enter => {
                if !self.input_fields.current_github_url.trim().is_empty() {
                    // Add the current URL to the list
                    self.input_fields
                        .github_projects
                        .push(self.input_fields.current_github_url.clone());
                    self.input_fields.current_github_url.clear();
                } else if !self.input_fields.github_projects.is_empty() {
                    // If no URL entered but we have projects, proceed
                    self.update_config_from_inputs().await;
                    self.current_screen = Screen::Confirmation;
                }
            }
            KeyCode::Char(c) => {
                self.input_fields.current_github_url.push(c);
            }
            KeyCode::Backspace | KeyCode::Delete => {
                self.input_fields.current_github_url.pop();
            }
            KeyCode::Esc => {
                self.current_screen = Screen::ProjectDetails;
            }
            _ => {}
        }
    }

    async fn handle_confirmation(&mut self, key: KeyCode) -> Result<()> {
        match key {
            KeyCode::Enter => {
                self.current_screen = Screen::Progress;
                self.generate_project().await?;
                self.current_screen = Screen::Complete;
            }
            KeyCode::Backspace => {
                self.current_screen = Screen::GitHubProjects;
            }
            _ => {}
        }
        Ok(())
    }

    fn add_char_to_current_input(&mut self, c: char) {
        match self.current_input {
            InputField::ProjectName => self.input_fields.project_name.push(c),
            InputField::AuthorName => self.input_fields.author_name.push(c),
            InputField::Title => self.input_fields.title.push(c),
            InputField::GitHubUrl => self.input_fields.current_github_url.push(c),
        }
    }

    fn delete_char_from_current_input(&mut self) {
        match self.current_input {
            InputField::ProjectName => {
                self.input_fields.project_name.pop();
            }
            InputField::AuthorName => {
                self.input_fields.author_name.pop();
            }
            InputField::Title => {
                self.input_fields.title.pop();
            }
            InputField::GitHubUrl => {
                self.input_fields.current_github_url.pop();
            }
        }
    }

    fn validate_basic_inputs(&self) -> bool {
        !self.input_fields.project_name.trim().is_empty()
            && !self.input_fields.author_name.trim().is_empty()
            && !self.input_fields.title.trim().is_empty()
    }

    #[allow(dead_code)]
    fn validate_inputs(&self) -> bool {
        self.validate_basic_inputs() && !self.input_fields.github_projects.is_empty()
    }

    async fn update_config_from_inputs(&mut self) {
        self.config.user.name = self.input_fields.author_name.clone();
        self.config.user.title = self.input_fields.title.clone();
        self.config.cms = crate::models::CmsType::None; // Default to no CMS for GitHub-based workflow
                                                        // Convert GitHub URLs to project data
        self.config.projects = self.github_urls_to_projects().await;
    }

    async fn github_urls_to_projects(&self) -> Vec<crate::models::portfolio::Project> {
        let client = match crate::github::GitHubClient::new() {
            Ok(client) => client,
            Err(e) => {
                eprintln!("Warning: Failed to create GitHub client: {}", e);
                eprintln!("Projects will be created with placeholder data.");
                return self.create_placeholder_projects();
            }
        };

        let mut projects = Vec::new();

        for (i, url) in self.input_fields.github_projects.iter().enumerate() {
            match self.fetch_github_project(&client, url, i).await {
                Ok(project) => projects.push(project),
                Err(e) => {
                    eprintln!("Warning: Failed to fetch data for {}: {}", url, e);
                    eprintln!("Creating placeholder project for this repository.");
                    projects.push(self.create_placeholder_project(url, i));
                }
            }
        }

        projects
    }

    async fn fetch_github_project(
        &self,
        client: &crate::github::GitHubClient,
        url: &str,
        index: usize,
    ) -> Result<crate::models::portfolio::Project> {
        // Parse GitHub URL
        let (owner, repo) = crate::github::parse_github_url(url)?;

        // Fetch repository data
        let repo_data = client.get_repo(&owner, &repo).await?;
        let languages = client.get_languages(&owner, &repo).await?;

        // Process languages into tech stack
        let tech_stack = crate::github::process_languages(&languages);

        // Try to fetch README for full description
        let full_description = client
            .get_readme(&owner, &repo)
            .await
            .unwrap_or_else(|_| repo_data.description.clone().unwrap_or_default());

        // Extract date from created_at
        let date = repo_data
            .created_at
            .split('T')
            .next()
            .unwrap_or("2024-01-01");

        Ok(crate::models::portfolio::Project {
            id: format!("project-{}", index + 1),
            title: repo_data.name.replace(['-', '_'], " "),
            description: repo_data.description.unwrap_or_else(|| {
                format!(
                    "A {} project",
                    repo_data.language.unwrap_or_else(|| "software".to_string())
                )
            }),
            full_description,
            category: "Development".to_string(),
            tech_stack,
            featured: index == 0 || repo_data.stargazers_count > 10,
            links: crate::models::portfolio::ProjectLinks {
                github: Some(url.to_string()),
                live: repo_data.homepage,
                demo: None,
            },
            thumbnail: "".to_string(),
            screenshots: vec![],
            date: date.to_string(),
            extra: {
                let mut extra = std::collections::HashMap::new();
                extra.insert(
                    "stars".to_string(),
                    serde_json::json!(repo_data.stargazers_count),
                );
                extra.insert(
                    "forks".to_string(),
                    serde_json::json!(repo_data.forks_count),
                );
                if !repo_data.topics.is_empty() {
                    extra.insert(
                        "topics".to_string(),
                        serde_json::json!(repo_data.topics.join(", ")),
                    );
                }
                extra
            },
        })
    }

    fn create_placeholder_projects(&self) -> Vec<crate::models::portfolio::Project> {
        self.input_fields
            .github_projects
            .iter()
            .enumerate()
            .map(|(i, url)| self.create_placeholder_project(url, i))
            .collect()
    }

    fn create_placeholder_project(
        &self,
        url: &str,
        index: usize,
    ) -> crate::models::portfolio::Project {
        let repo_name = url
            .split('/')
            .next_back()
            .unwrap_or("project")
            .replace(".git", "");

        crate::models::portfolio::Project {
            id: format!("project-{}", index + 1),
            title: repo_name.replace('-', " "),
            description: format!("Project hosted at {}", url),
            full_description: "This project will be populated with GitHub data.".to_string(),
            category: "Development".to_string(),
            tech_stack: vec!["GitHub".to_string()],
            featured: index == 0,
            links: crate::models::portfolio::ProjectLinks {
                github: Some(url.to_string()),
                live: None,
                demo: None,
            },
            thumbnail: "".to_string(),
            screenshots: vec![],
            date: "2024-01-01".to_string(),
            extra: std::collections::HashMap::new(),
        }
    }

    async fn generate_project(&mut self) -> Result<()> {
        self.progress_message = "copying template files...".to_string();

        let generator =
            TemplateGenerator::new(self.input_fields.project_name.clone(), self.config.clone())?;

        generator.generate().await?;

        self.progress_message = "project generated successfully!".to_string();
        Ok(())
    }

    pub fn selected_theme(&self) -> &Theme {
        &self.themes[self.selected_theme_idx]
    }
}
