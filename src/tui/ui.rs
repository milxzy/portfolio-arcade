// ui rendering for the terminal interface
// creates beautiful, intuitive screens for each step

use crate::models::CmsType;
use crate::tui::app::{App, InputField, Screen};
use ratatui::{
    layout::{Alignment, Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Clear, List, ListItem, ListState, Paragraph, Wrap},
    Frame,
};

pub fn draw(f: &mut Frame, app: &App) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0)].as_ref())
        .split(f.size());

    match app.current_screen {
        Screen::ThemeSelection => draw_theme_selection(f, chunks[0], app),
        Screen::CmsSelection => draw_cms_selection(f, chunks[0], app),
        Screen::ProjectDetails => draw_project_details(f, chunks[0], app),
        Screen::Confirmation => draw_confirmation(f, chunks[0], app),
        Screen::Progress => draw_progress(f, chunks[0], app),
        Screen::Complete => draw_complete(f, chunks[0], app),
    }

    // show error message if there is one
    if let Some(ref error) = app.error_message {
        draw_error_popup(f, error);
    }
}

fn draw_theme_selection(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" select your console theme ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Cyan));

    // create list items for themes
    let items: Vec<ListItem> = app
        .themes
        .iter()
        .map(|theme| {
            ListItem::new(vec![
                Line::from(vec![Span::styled(
                    &theme.display_name,
                    Style::default().add_modifier(Modifier::BOLD),
                )]),
                Line::from(vec![Span::styled(
                    &theme.description,
                    Style::default().fg(Color::Gray),
                )]),
                Line::from(""),
            ])
        })
        .collect();

    let mut list_state = ListState::default();
    list_state.select(Some(app.selected_theme_idx));

    let list = List::new(items)
        .block(block)
        .highlight_style(
            Style::default()
                .bg(Color::DarkGray)
                .add_modifier(Modifier::BOLD),
        )
        .highlight_symbol("> ");

    f.render_stateful_widget(list, area, &mut list_state);

    // instructions at the bottom
    let instructions = Paragraph::new("↑↓ to navigate • Enter to select • Q to quit")
        .style(Style::default().fg(Color::Yellow))
        .alignment(Alignment::Center);

    let instruction_area = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0), Constraint::Length(1)].as_ref())
        .split(f.size())[1];

    f.render_widget(instructions, instruction_area);
}

fn draw_cms_selection(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" choose cms option ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Cyan));

    let cms_options = [CmsType::Decap, CmsType::Payload, CmsType::None];
    let descriptions = [
        "git-based content management - recommended for beginners",
        "self-hosted headless cms - requires server setup",
        "manual json editing - for developers who prefer full control",
    ];

    let items: Vec<ListItem> = cms_options
        .iter()
        .enumerate()
        .map(|(i, cms)| {
            let cms_string = cms.to_string();
            ListItem::new(vec![
                Line::from(vec![Span::styled(
                    cms_string,
                    Style::default().add_modifier(Modifier::BOLD),
                )]),
                Line::from(vec![Span::styled(
                    descriptions[i],
                    Style::default().fg(Color::Gray),
                )]),
                Line::from(""),
            ])
        })
        .collect();

    let mut list_state = ListState::default();
    list_state.select(Some(app.selected_cms_idx));

    let list = List::new(items)
        .block(block)
        .highlight_style(
            Style::default()
                .bg(Color::DarkGray)
                .add_modifier(Modifier::BOLD),
        )
        .highlight_symbol("> ");

    f.render_stateful_widget(list, area, &mut list_state);

    let instructions = Paragraph::new("↑↓ to navigate • Enter to select • Backspace to go back")
        .style(Style::default().fg(Color::Yellow))
        .alignment(Alignment::Center);

    let instruction_area = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0), Constraint::Length(1)].as_ref())
        .split(f.size())[1];

    f.render_widget(instructions, instruction_area);
}

fn draw_project_details(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" project details ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Cyan));

    let inner = block.inner(area);

    // create input fields
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),
            Constraint::Length(3),
            Constraint::Length(3),
            Constraint::Length(3),
            Constraint::Min(1),
        ])
        .split(inner);

    // project name field
    let project_name_style = if app.current_input == InputField::ProjectName {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let project_name = Paragraph::new(app.input_fields.project_name.as_str()).block(
        Block::default()
            .title("project name")
            .borders(Borders::ALL)
            .border_style(project_name_style),
    );

    f.render_widget(project_name, chunks[0]);

    // author name field
    let author_style = if app.current_input == InputField::AuthorName {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let author_name = Paragraph::new(app.input_fields.author_name.as_str()).block(
        Block::default()
            .title("your name")
            .borders(Borders::ALL)
            .border_style(author_style),
    );

    f.render_widget(author_name, chunks[1]);

    // title field
    let title_style = if app.current_input == InputField::Title {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let title = Paragraph::new(app.input_fields.title.as_str()).block(
        Block::default()
            .title("professional title")
            .borders(Borders::ALL)
            .border_style(title_style),
    );

    f.render_widget(title, chunks[2]);

    // port field
    let port_style = if app.current_input == InputField::Port {
        Style::default().fg(Color::Yellow)
    } else {
        Style::default()
    };

    let port = Paragraph::new(app.input_fields.port.as_str()).block(
        Block::default()
            .title("dev server port")
            .borders(Borders::ALL)
            .border_style(port_style),
    );

    f.render_widget(port, chunks[3]);

    // render the main block last to show borders
    f.render_widget(block, area);

    let instructions =
        Paragraph::new("Tab/Shift+Tab to navigate • Enter when ready • Backspace to go back")
            .style(Style::default().fg(Color::Yellow))
            .alignment(Alignment::Center);

    let instruction_area = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0), Constraint::Length(1)].as_ref())
        .split(f.size())[1];

    f.render_widget(instructions, instruction_area);
}

fn draw_confirmation(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" confirmation ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Green));

    let summary = format!(
        "theme: {}\ncms: {}\nproject: {}\nauthor: {}\nport: {}\n\nready to generate your portfolio?",
        app.selected_theme().display_name,
        app.selected_cms(),
        app.input_fields.project_name,
        app.input_fields.author_name,
        app.input_fields.port
    );

    let paragraph = Paragraph::new(summary)
        .block(block)
        .wrap(Wrap { trim: true })
        .alignment(Alignment::Center);

    f.render_widget(paragraph, area);

    let instructions = Paragraph::new("Enter to generate • Backspace to go back")
        .style(Style::default().fg(Color::Yellow))
        .alignment(Alignment::Center);

    let instruction_area = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(0), Constraint::Length(1)].as_ref())
        .split(f.size())[1];

    f.render_widget(instructions, instruction_area);
}

fn draw_progress(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" generating portfolio ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Magenta));

    let progress_text = format!("{}", app.progress_message);

    let paragraph = Paragraph::new(progress_text)
        .block(block)
        .alignment(Alignment::Center);

    f.render_widget(paragraph, area);
}

fn draw_complete(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let success_message = format!(
        "portfolio generated successfully!\n\nproject: {}\nlocation: ./{}/\ntheme: {}\n\nnext steps:\n• cd {}\n• npm install\n• npm run dev\n\npress any key to exit",
        app.input_fields.project_name,
        app.input_fields.project_name,
        app.selected_theme().display_name,
        app.input_fields.project_name
    );

    let block = Block::default()
        .title(" success! ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Green));

    let paragraph = Paragraph::new(success_message)
        .block(block)
        .alignment(Alignment::Center)
        .wrap(Wrap { trim: true });

    f.render_widget(paragraph, area);
}

fn draw_error_popup(f: &mut Frame, error_message: &str) {
    let popup_area = centered_rect(60, 20, f.size());

    f.render_widget(Clear, popup_area);

    let block = Block::default()
        .title(" error ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Red));

    let error_text = format!("error: {}", error_message);

    let paragraph = Paragraph::new(error_text)
        .block(block)
        .alignment(Alignment::Center)
        .wrap(Wrap { trim: true });

    f.render_widget(paragraph, popup_area);
}

// helper function to create a centered rectangle
fn centered_rect(
    percent_x: u16,
    percent_y: u16,
    r: ratatui::layout::Rect,
) -> ratatui::layout::Rect {
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(r);

    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(popup_layout[1])[1]
}
