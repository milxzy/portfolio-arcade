// file system utilities
// helpers for safe file operations

use anyhow::{anyhow, Result};
use std::path::{Path, PathBuf};
use std::{env, fs};

// safely creates a directory and all parent directories
pub fn create_dir_safe(path: &Path) -> Result<()> {
    if !path.exists() {
        fs::create_dir_all(path)?;
    }
    Ok(())
}

// checks if a directory is empty
pub fn is_dir_empty(path: &Path) -> Result<bool> {
    if !path.exists() || !path.is_dir() {
        return Ok(true);
    }

    let entries = fs::read_dir(path)?;
    Ok(entries.count() == 0)
}

// gets the current working directory safely
pub fn get_current_dir() -> Result<PathBuf> {
    env::current_dir().map_err(|e| anyhow!("failed to get current directory: {}", e))
}

// checks if we have write permissions for a directory
pub fn check_write_permission(path: &Path) -> Result<()> {
    let parent = path.parent().unwrap_or(path);

    if !parent.exists() {
        return Err(anyhow!(
            "parent directory does not exist: {}",
            parent.display()
        ));
    }

    // try to create a temporary file
    let temp_file = parent.join(".portfolio_arcade_temp");
    match fs::write(&temp_file, "") {
        Ok(_) => {
            // clean up
            let _ = fs::remove_file(&temp_file);
            Ok(())
        }
        Err(e) => Err(anyhow!(
            "no write permission for {}: {}",
            parent.display(),
            e
        )),
    }
}

// safely reads a text file with error handling
pub fn read_text_file(path: &Path) -> Result<String> {
    if !path.exists() {
        return Err(anyhow!("file does not exist: {}", path.display()));
    }

    fs::read_to_string(path).map_err(|e| anyhow!("failed to read file {}: {}", path.display(), e))
}

// safely writes a text file with error handling
pub fn write_text_file(path: &Path, content: &str) -> Result<()> {
    // ensure parent directory exists
    if let Some(parent) = path.parent() {
        create_dir_safe(parent)?;
    }

    fs::write(path, content).map_err(|e| anyhow!("failed to write file {}: {}", path.display(), e))
}

// checks if a path is a valid directory name
pub fn is_valid_directory_name(name: &str) -> bool {
    if name.trim().is_empty() {
        return false;
    }

    // check for reserved names on windows
    let reserved = [
        "CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8",
        "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
    ];
    if reserved.contains(&name.to_uppercase().as_str()) {
        return false;
    }

    // check for invalid characters
    let invalid_chars = ['<', '>', ':', '"', '|', '?', '*', '\0'];
    if name.chars().any(|c| invalid_chars.contains(&c)) {
        return false;
    }

    true
}

// gets the size of a directory recursively
pub fn get_dir_size(path: &Path) -> Result<u64> {
    let mut size = 0;

    if path.is_dir() {
        for entry in fs::read_dir(path)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_dir() {
                size += get_dir_size(&path)?;
            } else {
                size += entry.metadata()?.len();
            }
        }
    }

    Ok(size)
}

// formats file size in human readable format
pub fn format_file_size(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    let mut size = bytes as f64;
    let mut unit_index = 0;

    while size >= 1024.0 && unit_index < UNITS.len() - 1 {
        size /= 1024.0;
        unit_index += 1;
    }

    if unit_index == 0 {
        format!("{} {}", bytes, UNITS[unit_index])
    } else {
        format!("{:.1} {}", size, UNITS[unit_index])
    }
}
