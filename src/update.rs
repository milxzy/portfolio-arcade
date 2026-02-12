// auto-update functionality for portfolio-arcade
// checks github releases and prompts user to update when newer version available

use anyhow::Result;
use colored::*;
use std::env;
use std::io::{self, Write};

// current version from cargo.toml
const CURRENT_VERSION: &str = env!("CARGO_PKG_VERSION");

// github repo info
const REPO_OWNER: &str = "milxzy"; // your github username
const REPO_NAME: &str = "portfolio-arcade";

// placeholder for update checking - will be implemented with reqwest later
pub async fn check_for_updates() -> Result<Option<String>> {
    // for now, just return None (no update available)
    // this will be implemented once we can add reqwest dependency
    Ok(None)
}

// prompt user to update if newer version available
pub async fn check_and_prompt_update() -> Result<()> {
    // check for updates (with timeout for quick startup)
    let update_check = tokio::time::timeout(
        std::time::Duration::from_secs(3),
        check_for_updates()
    ).await;

    match update_check {
        Ok(Ok(Some(new_version))) => {
            println!();
            println!("{}", "🚀 new version available!".bright_green().bold());
            println!("  current: {}", format!("v{}", CURRENT_VERSION).cyan());
            println!("  latest:  {}", new_version.green().bold());
            println!();
            
            // prompt for update
            print!("{} ", "would you like to update? (y/n):".bright_white());
            io::stdout().flush()?;
            
            let mut input = String::new();
            io::stdin().read_line(&mut input)?;
            
            if input.trim().to_lowercase().starts_with('y') {
                show_update_instructions(&new_version);
            } else {
                println!("{}", "skipping update...".yellow());
            }
            println!();
        }
        Ok(Ok(None)) => {
            // no update needed, continue silently
        }
        Ok(Err(e)) => {
            // failed to check for updates, but don't block the user
            eprintln!("{} {}", "warning: couldn't check for updates:".yellow(), e);
        }
        Err(_) => {
            // timeout, continue silently
        }
    }

    Ok(())
}

// show instructions for updating
fn show_update_instructions(new_version: &str) {
    println!("{}", "updating portfolio-arcade...".bright_cyan());
    println!();
    
    // detect if we're on a system that might have used the install script
    if let Ok(exe_path) = env::current_exe() {
        if exe_path.to_string_lossy().contains(".local/bin") 
            || exe_path.to_string_lossy().contains("/usr/local/bin") {
            println!("run this command to update:");
            println!();
            println!("  {}", "curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash".bright_magenta());
            println!();
            return;
        }
    }
    
    // fallback: show manual update instructions
    println!("to update, visit the releases page:");
    println!("  {}", format!("https://github.com/{}/{}/releases/tag/{}", 
                              REPO_OWNER, REPO_NAME, new_version).bright_blue());
    println!();
    println!("or use the install script:");
    println!("  {}", "curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash".bright_magenta());
    println!();
}

// force check for updates (for manual update command)
pub async fn force_update_check() -> Result<()> {
    println!("{}", "checking for updates...".cyan());
    
    // for now, show current version and update instructions
    println!("{}", "current version:".green());
    println!("  version: {}", format!("v{}", CURRENT_VERSION).cyan());
    println!();
    println!("{}", "to check for the latest version, visit:".yellow());
    println!("  {}", format!("https://github.com/{}/{}/releases", 
                              REPO_OWNER, REPO_NAME).bright_blue());
    println!();
    println!("or use the install script to get the latest version:");
    println!("  {}", "curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash".bright_magenta());
    
    Ok(())
}