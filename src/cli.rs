// cli command definitions using clap derive macros
// keeps it simple and user-friendly

use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "portfolio-arcade")]
#[command(author = "milx")]
#[command(version = env!("CARGO_PKG_VERSION"))]
#[command(about = "generate gaming console-themed portfolio sites")]
#[command(
    long_about = "creates beautiful, interactive portfolio websites themed after classic gaming consoles like ps3, ps5, and nintendo wii. includes cms integration, responsive design, and modern web technologies."
)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// initialize a new portfolio project with interactive setup
    Init {
        /// name of the project (will prompt if not provided)
        project_name: Option<String>,
    },
    /// check for updates and show update instructions
    Update,
}
