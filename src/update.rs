// auto-update functionality for portfolio-arcade
// checks github releases and prompts user to update when newer version available

use anyhow::Result;
use colored::*;
use serde::Deserialize;
use std::env;
use std::io::{self, Write};

// current version from cargo.toml
const CURRENT_VERSION: &str = env!("CARGO_PKG_VERSION");

// github repo info
const REPO_OWNER: &str = "milxzy";
const REPO_NAME: &str = "portfolio-arcade";

#[derive(Deserialize)]
struct Release {
    tag_name: String,
}

// fetch the latest release tag from the github api and compare to current version
pub async fn check_for_updates() -> Result<Option<String>> {
    let url = format!(
        "https://api.github.com/repos/{}/{}/releases/latest",
        REPO_OWNER, REPO_NAME
    );

    let client = reqwest::Client::builder()
        .user_agent(format!("portfolio-arcade/{}", CURRENT_VERSION))
        .build()?;

    let release: Release = client.get(&url).send().await?.json().await?;

    // strip leading 'v' for comparison
    let latest = release.tag_name.trim_start_matches('v');
    let current = CURRENT_VERSION;

    if latest != current {
        Ok(Some(release.tag_name))
    } else {
        Ok(None)
    }
}

// prompt user to update if newer version available
pub async fn check_and_prompt_update() -> Result<()> {
    // check for updates with a short timeout so startup stays fast
    let update_check =
        tokio::time::timeout(std::time::Duration::from_secs(3), check_for_updates()).await;

    match update_check {
        Ok(Ok(Some(new_version))) => {
            println!();
            println!("{}", "🚀 new version available!".bright_green().bold());
            println!("  current: {}", format!("v{}", CURRENT_VERSION).cyan());
            println!("  latest:  {}", new_version.green().bold());
            println!();

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

    // detect if installed via the install script
    if let Ok(exe_path) = env::current_exe() {
        let path_str = exe_path.to_string_lossy();
        if path_str.contains(".local/bin") || path_str.contains("/usr/local/bin") {
            println!("run this command to update:");
            println!();
            println!(
                "  {}",
                "curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash"
                    .bright_magenta()
            );
            println!();
            return;
        }
    }

    // fallback: link to the specific release
    println!("to update, visit the releases page:");
    println!(
        "  {}",
        format!(
            "https://github.com/{}/{}/releases/tag/{}",
            REPO_OWNER, REPO_NAME, new_version
        )
        .bright_blue()
    );
    println!();
    println!("or use the install script:");
    println!(
        "  {}",
        "curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash".bright_magenta()
    );
    println!();
}

// manual update check (portfolio-arcade update command)
pub async fn force_update_check() -> Result<()> {
    println!("{}", "checking for updates...".cyan());

    match check_for_updates().await {
        Ok(Some(new_version)) => {
            println!();
            println!("{}", "new version available!".bright_green().bold());
            println!("  current: {}", format!("v{}", CURRENT_VERSION).cyan());
            println!("  latest:  {}", new_version.green().bold());
            println!();
            show_update_instructions(&new_version);
        }
        Ok(None) => {
            println!("{}", "you're up to date!".green());
            println!("  version: {}", format!("v{}", CURRENT_VERSION).cyan());
        }
        Err(e) => {
            eprintln!("{} {}", "couldn't check for updates:".yellow(), e);
            println!();
            println!("check manually at:");
            println!(
                "  {}",
                format!("https://github.com/{}/{}/releases", REPO_OWNER, REPO_NAME).bright_blue()
            );
        }
    }

    Ok(())
}
