// dependency management and dev server utilities
// handles npm install and starting the development server

use anyhow::{anyhow, Result};
use std::path::Path;
use std::process::Stdio;
use tokio::process::Command;
use colored::*;

#[derive(Debug, Clone)]
pub enum PackageManager {
    Npm,
    Pnpm,
    Yarn,
}

impl PackageManager {
    // detects which package manager to use based on lockfiles
    pub fn detect(project_path: &Path) -> Self {
        if project_path.join("pnpm-lock.yaml").exists() {
            PackageManager::Pnpm
        } else if project_path.join("yarn.lock").exists() {
            PackageManager::Yarn
        } else {
            PackageManager::Npm
        }
    }

    // returns the command name for this package manager
    pub fn command(&self) -> &str {
        match self {
            PackageManager::Npm => "npm",
            PackageManager::Pnpm => "pnpm",
            PackageManager::Yarn => "yarn",
        }
    }

    // returns the install command args
    pub fn install_args(&self) -> Vec<&str> {
        match self {
            PackageManager::Npm => vec!["install"],
            PackageManager::Pnpm => vec!["install"],
            PackageManager::Yarn => vec!["install"],
        }
    }

    // returns the dev server command args
    pub fn dev_args(&self) -> Vec<&str> {
        match self {
            PackageManager::Npm => vec!["run", "dev"],
            PackageManager::Pnpm => vec!["dev"],
            PackageManager::Yarn => vec!["dev"],
        }
    }
}

pub struct DependencyManager {
    pub project_path: std::path::PathBuf,
    pub package_manager: PackageManager,
}

impl DependencyManager {
    pub fn new(project_path: std::path::PathBuf) -> Self {
        let package_manager = PackageManager::detect(&project_path);
        Self {
            project_path,
            package_manager,
        }
    }

    // installs dependencies for the project
    pub async fn install_dependencies(&self) -> Result<()> {
        // check if the package manager is available
        self.check_package_manager_available().await?;

        println!("{}", "installing dependencies...".cyan());

        let mut cmd = Command::new(self.package_manager.command());
        cmd.args(self.package_manager.install_args())
            .current_dir(&self.project_path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        let output = cmd.output().await?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            return Err(anyhow!("failed to install dependencies: {}", stderr));
        }

        println!("{}", "dependencies installed successfully".green());
        Ok(())
    }

    // starts the development server
    pub async fn start_dev_server(&self, port: u16) -> Result<()> {
        println!("{}", format!("starting dev server on port {}...", port).cyan());

        // set the port environment variable
        let mut cmd = Command::new(self.package_manager.command());
        cmd.args(self.package_manager.dev_args())
            .current_dir(&self.project_path)
            .env("PORT", port.to_string())
            .stdout(Stdio::null())  // suppress output since we're not monitoring it
            .stderr(Stdio::null());

        let _child = cmd.spawn()?;

        // wait a bit for the server to start
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

        println!("{}", "dev server started!".green());
        println!();
        println!("{}", "your portfolio is ready!".bold().green());
        println!();
        println!("  {}: {}", "local".bold(), format!("http://localhost:{}", port));
        
        // show cms url if it's decap
        println!("  {}: {}", "admin".bold(), format!("http://localhost:{}/admin", port));
        
        println!();
        println!("{}", "next steps:".bold());
        println!("  1. open the local url in your browser");
        println!("  2. edit projects in content/projects/ or use the cms");
        println!("  3. customize colors and styling to match your brand");
        println!();
        println!("{}", "happy building!".bold());

        Ok(())
    }

    // checks if the detected package manager is available on the system
    async fn check_package_manager_available(&self) -> Result<()> {
        let mut cmd = Command::new(self.package_manager.command());
        cmd.arg("--version").stdout(Stdio::null()).stderr(Stdio::null());

        let output = cmd.output().await?;

        if !output.status.success() {
            return Err(anyhow!(
                "{} is not installed. please install it first:\n\n  npm: https://nodejs.org/\n  pnpm: https://pnpm.io/\n  yarn: https://yarnpkg.com/",
                self.package_manager.command()
            ));
        }

        Ok(())
    }

    // checks if node.js is available
    pub async fn check_node_available() -> Result<()> {
        let mut cmd = Command::new("node");
        cmd.arg("--version").stdout(Stdio::null()).stderr(Stdio::null());

        let output = cmd.output().await?;

        if !output.status.success() {
            return Err(anyhow!(
                "node.js is not installed. please install it from https://nodejs.org/"
            ));
        }

        Ok(())
    }

    // checks if a port is available
    pub async fn check_port_available(port: u16) -> Result<()> {
        use std::net::{TcpListener, SocketAddr};

        let addr = SocketAddr::from(([127, 0, 0, 1], port));
        
        match TcpListener::bind(addr) {
            Ok(_) => Ok(()),
            Err(_) => Err(anyhow!(
                "port {} is already in use. try a different port or stop the process using that port",
                port
            )),
        }
    }
}