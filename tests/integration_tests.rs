// integration tests for portfolio arcade
// validates core functionality

use portfolio_arcade::models::{PortfolioConfig, Theme};
use portfolio_arcade::utils::validation::{validate_port, validate_project_name};

#[test]
fn test_theme_availability() {
    let themes = Theme::available_themes();
    assert!(
        !themes.is_empty(),
        "should have at least one theme available"
    );

    // check for expected themes
    let theme_ids: Vec<String> = themes.iter().map(|t| t.id.clone()).collect();
    assert!(theme_ids.contains(&"ps3".to_string()));
    assert!(theme_ids.contains(&"ps5".to_string()));
    assert!(theme_ids.contains(&"wii".to_string()));
}

#[test]
fn test_theme_lookup() {
    let ps5_theme = Theme::find_by_id("ps5");
    assert!(ps5_theme.is_some(), "ps5 theme should be found");

    let nonexistent_theme = Theme::find_by_id("nonexistent");
    assert!(
        nonexistent_theme.is_none(),
        "nonexistent theme should not be found"
    );
}

#[test]
fn test_portfolio_config_defaults() {
    let config = PortfolioConfig::default();
    assert_eq!(config.theme, "ps5");
    assert_eq!(config.dev_port, 3000);
    assert!(!config.user.name.is_empty());
    assert!(!config.projects.is_empty());
}

#[test]
fn test_project_name_validation() {
    // valid names
    assert!(validate_project_name("my-portfolio").is_ok());
    assert!(validate_project_name("portfolio_2024").is_ok());
    assert!(validate_project_name("MyPortfolio123").is_ok());

    // invalid names
    assert!(validate_project_name("").is_err());
    assert!(validate_project_name("-invalid").is_err());
    assert!(validate_project_name("invalid!").is_err());
    assert!(validate_project_name("a".repeat(51).as_str()).is_err());
}

#[test]
fn test_port_validation() {
    // valid ports
    assert!(validate_port("3000").is_ok());
    assert!(validate_port("8080").is_ok());
    assert_eq!(validate_port("3000").unwrap(), 3000);

    // invalid ports
    assert!(validate_port("80").is_err()); // too low
    assert!(validate_port("invalid").is_err()); // not a number
    assert!(validate_port("").is_err()); // empty
}

#[test]
fn test_project_data_adaptation() {
    let config = PortfolioConfig::default();
    let theme = Theme::find_by_id("ps5").unwrap();

    let adapted = theme.adapt_projects(&config.projects);
    assert!(adapted.is_ok(), "project adaptation should succeed");

    let json = adapted.unwrap();
    assert!(json.is_array(), "adapted data should be an array");
}
