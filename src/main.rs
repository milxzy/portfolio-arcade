// portfolio arcade cli - gaming console portfolio generator
// creates beautiful portfolio websites themed after classic gaming consoles

use anyhow::Result;
use clap::Parser;
use colored::*;

mod cli;
mod generator;
mod models;
mod tui;
mod update;
mod utils;

use cli::{Cli, Commands};
use tui::App;

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // check for updates before showing welcome message
    update::check_and_prompt_update().await?;

    // show welcome message with some flair
    println!();
    println!("{}", "╔══════════════════════════════════════════════╗".cyan());
    println!("{}", "║         portfolio arcade generator           ║".cyan());
    println!("{}", "╚══════════════════════════════════════════════╝".cyan());
    println!();

    match cli.command {
        Commands::Init { project_name } => {
            // launch the interactive tui for project configuration
            let app = App::new(project_name);
            app.run().await?;
        }
        Commands::Update => {
            // check for updates manually
            update::force_update_check().await?;
        }
    }

    Ok(())
}