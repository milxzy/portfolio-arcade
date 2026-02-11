// portfolio arcade cli - gaming console portfolio generator
// creates beautiful portfolio websites themed after classic gaming consoles

use anyhow::Result;
use clap::Parser;
use colored::*;

mod cli;
mod generator;
mod models;
mod tui;
mod utils;

use cli::{Cli, Commands};
use tui::App;

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

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
    }

    Ok(())
}