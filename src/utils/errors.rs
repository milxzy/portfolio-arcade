// comprehensive error handling with helpful suggestions
// provides user-friendly error messages and recovery guidance

use std::path::PathBuf;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum PortfolioError {
    #[error("template '{theme}' not found")]
    TemplateNotFound { theme: String },

    #[error("node.js is not installed or not found in PATH")]
    NodeNotInstalled,

    #[error("port {port} is already in use")]
    PortInUse { port: u16 },

    #[error("invalid project name '{name}': {reason}")]
    InvalidProjectName { name: String, reason: String },

    #[error("no write permission for directory '{path}'")]
    FilePermissions { path: PathBuf },

    #[error("directory '{path}' already exists")]
    DirectoryExists { path: PathBuf },

    #[error("package manager '{manager}' not found")]
    PackageManagerNotFound { manager: String },

    #[error("failed to copy template files: {reason}")]
    TemplateCopyFailed { reason: String },

    #[error("failed to install dependencies: {reason}")]
    DependencyInstallFailed { reason: String },

    #[error("dev server failed to start: {reason}")]
    DevServerFailed { reason: String },

    #[error("invalid configuration: {reason}")]
    ConfigurationError { reason: String },
}

impl PortfolioError {
    // provides helpful suggestions for resolving the error
    pub fn suggestion(&self) -> String {
        match self {
            PortfolioError::TemplateNotFound { theme } => {
                format!(
                    "available themes are: ps3, ps5, wii\ntry using one of these instead of '{}'",
                    theme
                )
            }
            
            PortfolioError::NodeNotInstalled => {
                "please install node.js from https://nodejs.org/\nthen restart your terminal and try again".to_string()
            }
            
            PortfolioError::PortInUse { port } => {
                format!(
                    "try using a different port:\n  portfolio-arcade init --port {}\n\nor stop the process using port {}:\n  lsof -ti:{} | xargs kill",
                    port + 1, port, port
                )
            }
            
            PortfolioError::InvalidProjectName { name: _, reason } => {
                format!("project names should be:\n  - alphanumeric characters, hyphens, and underscores only\n  - not start with a hyphen\n  - 50 characters or less\n\nspecific issue: {}", reason)
            }
            
            PortfolioError::FilePermissions { path } => {
                format!(
                    "try running from a different directory or fixing permissions:\n  chmod 755 {}",
                    path.display()
                )
            }
            
            PortfolioError::DirectoryExists { path } => {
                format!(
                    "either:\n  - choose a different project name\n  - remove the existing directory: rm -rf {}\n  - use the existing directory if it's from a previous run",
                    path.display()
                )
            }
            
            PortfolioError::PackageManagerNotFound { manager } => {
                match manager.as_str() {
                    "npm" => "install node.js from https://nodejs.org/ (includes npm)".to_string(),
                    "pnpm" => "install pnpm: npm install -g pnpm".to_string(),
                    "yarn" => "install yarn: npm install -g yarn".to_string(),
                    _ => format!("install {} package manager", manager),
                }
            }
            
            PortfolioError::TemplateCopyFailed { reason: _ } => {
                "check that:\n  - you have write permissions\n  - enough disk space is available\n  - template directory exists".to_string()
            }
            
            PortfolioError::DependencyInstallFailed { reason: _ } => {
                "try:\n  - checking your internet connection\n  - clearing npm cache: npm cache clean --force\n  - using a different registry: npm config set registry https://registry.npmjs.org/".to_string()
            }
            
            PortfolioError::DevServerFailed { reason: _ } => {
                "try:\n  - using a different port\n  - checking if another process is using the port\n  - running npm install manually in the project directory".to_string()
            }
            
            PortfolioError::ConfigurationError { reason: _ } => {
                "check your input values and try again".to_string()
            }
        }
    }

    // returns a user-friendly error code for support
    pub fn error_code(&self) -> &'static str {
        match self {
            PortfolioError::TemplateNotFound { .. } => "E001",
            PortfolioError::NodeNotInstalled => "E002",
            PortfolioError::PortInUse { .. } => "E003",
            PortfolioError::InvalidProjectName { .. } => "E004",
            PortfolioError::FilePermissions { .. } => "E005",
            PortfolioError::DirectoryExists { .. } => "E006",
            PortfolioError::PackageManagerNotFound { .. } => "E007",
            PortfolioError::TemplateCopyFailed { .. } => "E008",
            PortfolioError::DependencyInstallFailed { .. } => "E009",
            PortfolioError::DevServerFailed { .. } => "E010",
            PortfolioError::ConfigurationError { .. } => "E011",
        }
    }

    // displays a formatted error message with suggestion
    pub fn display_with_suggestion(&self) -> String {
        format!(
            "error {}: {}\n\n💡 suggestion:\n{}\n",
            self.error_code(),
            self,
            self.suggestion()
        )
    }
}
