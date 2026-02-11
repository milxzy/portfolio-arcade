// main tui application state and logic
// orchestrates the user flow from theme selection to project generation

use crate::generator::TemplateGenerator;
use crate::models::{CmsType, PortfolioConfig, Theme};
use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    Terminal,
};
use std::io;

#[derive(Debug, Clone, PartialEq)]
pub enum Screen {
    ThemeSelection,
    CmsSelection,
    ProjectDetails,
    Confirmation,
    Progress,
    Complete,
}

pub struct App {
    pub current_screen: Screen,
    pub config: PortfolioConfig,
    pub themes: Vec<Theme>,
    pub selected_theme_idx: usize,
    pub selected_cms_idx: usize,
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
    pub port: String,
}

#[derive(Debug, Clone, PartialEq)]
pub enum InputField {
    ProjectName,
    AuthorName,
    Title,
    Port,
}

impl App {
    pub fn new(project_name: Option<String>) -> Self {
        let themes = Theme::available_themes();
        let config = PortfolioConfig::default();

        let input_fields = InputFields {
            project_name: project_name.unwrap_or_else(|| "my-portfolio".to_string()),
            author_name: config.user.name.clone(),
            title: config.user.title.clone(),
            port: config.dev_port.to_string(),
        };

        Self {
            current_screen: Screen::ThemeSelection,
            config,
            themes,
            selected_theme_idx: 1, // default to ps5
            selected_cms_idx: 0,   // default to decap cms
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

    async fn run_app(&mut self, terminal: &mut Terminal<CrosstermBackend<std::io::Stdout>>) -> Result<()> {
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
            Screen::CmsSelection => self.handle_cms_selection(key),
            Screen::ProjectDetails => self.handle_project_details(key),
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
                self.current_screen = Screen::CmsSelection;
            }
            _ => {}
        }
    }

    fn handle_cms_selection(&mut self, key: KeyCode) {
        let cms_options = [CmsType::Decap, CmsType::Payload, CmsType::None];

        match key {
            KeyCode::Up => {
                if self.selected_cms_idx > 0 {
                    self.selected_cms_idx -= 1;
                }
            }
            KeyCode::Down => {
                if self.selected_cms_idx < cms_options.len() - 1 {
                    self.selected_cms_idx += 1;
                }
            }
            KeyCode::Enter => {
                self.config.cms = cms_options[self.selected_cms_idx].clone();
                self.current_screen = Screen::ProjectDetails;
            }
            KeyCode::Backspace => {
                self.current_screen = Screen::ThemeSelection;
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
                    InputField::Title => InputField::Port,
                    InputField::Port => InputField::ProjectName,
                };
            }
            KeyCode::BackTab => {
                self.current_input = match self.current_input {
                    InputField::ProjectName => InputField::Port,
                    InputField::AuthorName => InputField::ProjectName,
                    InputField::Title => InputField::AuthorName,
                    InputField::Port => InputField::Title,
                };
            }
            KeyCode::Enter => {
                if self.validate_inputs() {
                    self.update_config_from_inputs();
                    self.current_screen = Screen::Confirmation;
                }
            }
            KeyCode::Backspace => {
                self.current_screen = Screen::CmsSelection;
            }
            KeyCode::Char(c) => {
                self.add_char_to_current_input(c);
            }
            KeyCode::Delete => {
                self.delete_char_from_current_input();
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
                self.current_screen = Screen::ProjectDetails;
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
            InputField::Port => {
                if c.is_ascii_digit() {
                    self.input_fields.port.push(c);
                }
            }
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
            InputField::Port => {
                self.input_fields.port.pop();
            }
        }
    }

    fn validate_inputs(&self) -> bool {
        !self.input_fields.project_name.trim().is_empty()
            && !self.input_fields.author_name.trim().is_empty()
            && !self.input_fields.title.trim().is_empty()
            && self.input_fields.port.parse::<u16>().is_ok()
    }

    fn update_config_from_inputs(&mut self) {
        self.config.user.name = self.input_fields.author_name.clone();
        self.config.user.title = self.input_fields.title.clone();
        self.config.dev_port = self.input_fields.port.parse().unwrap_or(3000);
    }

    async fn generate_project(&mut self) -> Result<()> {
        use crate::generator::dependencies::DependencyManager;
        use std::path::PathBuf;

        self.progress_message = "copying template files...".to_string();

        let generator = TemplateGenerator::new(
            self.input_fields.project_name.clone(),
            self.config.clone(),
        )?;

        generator.generate().await?;

        self.progress_message = "installing dependencies...".to_string();

        // install dependencies and start dev server
        let project_path = PathBuf::from(&self.input_fields.project_name);
        let dep_manager = DependencyManager::new(project_path);

        // check if node is available first
        if let Err(e) = DependencyManager::check_node_available().await {
            self.error_message = Some(format!("{}", e));
            return Ok(());
        }

        // check if port is available
        if let Err(e) = DependencyManager::check_port_available(self.config.dev_port).await {
            self.error_message = Some(format!("{}", e));
            return Ok(());
        }

        // install dependencies
        if let Err(e) = dep_manager.install_dependencies().await {
            self.error_message = Some(format!("failed to install dependencies: {}", e));
            return Ok(());
        }

        self.progress_message = "starting dev server...".to_string();

        // start dev server
        if let Err(e) = dep_manager.start_dev_server(self.config.dev_port).await {
            self.error_message = Some(format!("failed to start dev server: {}", e));
            return Ok(());
        }

        self.progress_message = "project generated successfully!".to_string();
        Ok(())
    }

    pub fn selected_theme(&self) -> &Theme {
        &self.themes[self.selected_theme_idx]
    }

    pub fn selected_cms(&self) -> CmsType {
        let cms_options = [CmsType::Decap, CmsType::Payload, CmsType::None];
        cms_options[self.selected_cms_idx].clone()
    }
}