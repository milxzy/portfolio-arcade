// ui rendering for the terminal interface
// creates beautiful, intuitive screens for each step

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
        Screen::ProjectDetails => draw_project_details(f, chunks[0], app),
        Screen::GitHubProjects => draw_github_projects(f, chunks[0], app),
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

fn draw_github_projects(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let block = Block::default()
        .title(" github projects ")
        .borders(Borders::ALL)
        .border_style(Style::default().fg(Color::Green));

    let inner = block.inner(area);

    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(3),
            Constraint::Min(5),
            Constraint::Length(3),
        ])
        .split(inner);

    // current URL input field
    let url_input = Paragraph::new(app.input_fields.current_github_url.as_str()).block(
        Block::default()
            .title("Enter GitHub project URL")
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Yellow)),
    );

    f.render_widget(url_input, chunks[0]);

    // list of added projects
    let project_items: Vec<ListItem> = app
        .input_fields
        .github_projects
        .iter()
        .enumerate()
        .map(|(i, url)| {
            ListItem::new(vec![Line::from(vec![Span::styled(
                format!("{}. {}", i + 1, url),
                Style::default(),
            )])])
        })
        .collect();

    let projects_list = List::new(project_items).block(
        Block::default()
            .title(format!(
                "Added Projects ({})",
                app.input_fields.github_projects.len()
            ))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(Color::Gray)),
    );

    f.render_widget(projects_list, chunks[1]);

    // status message
    let status_msg = if app.input_fields.github_projects.is_empty() {
        "Add at least one GitHub project URL to continue"
    } else if !app.input_fields.current_github_url.trim().is_empty() {
        "Press Enter to add this URL, or Enter on empty field to continue"
    } else {
        "Press Enter to continue with your projects"
    };

    let status = Paragraph::new(status_msg)
        .block(
            Block::default()
                .borders(Borders::ALL)
                .border_style(Style::default().fg(Color::Blue)),
        )
        .style(Style::default().fg(Color::White))
        .alignment(Alignment::Center);

    f.render_widget(status, chunks[2]);

    // render the main block
    f.render_widget(block, area);

    let instructions = Paragraph::new("Type GitHub URLs • Enter to add/continue • Esc to go back")
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

    // render the main block last to show borders
    f.render_widget(block, area);

    let instructions =
        Paragraph::new("Tab/Shift+Tab to navigate • Enter to add GitHub projects • Esc to go back")
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

    let projects_list = app
        .input_fields
        .github_projects
        .iter()
        .enumerate()
        .map(|(i, url)| format!("  {}. {}", i + 1, url))
        .collect::<Vec<_>>()
        .join("\n");

    let summary = format!(
        "theme: {}\nproject: {}\nauthor: {}\ntitle: {}\n\ngithub projects ({}):\n{}\n\nready to generate your portfolio?",
        app.selected_theme().display_name,
        app.input_fields.project_name,
        app.input_fields.author_name,
        app.input_fields.title,
        app.input_fields.github_projects.len(),
        if projects_list.is_empty() { "  (none added)" } else { &projects_list }
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

    let progress_text = app.progress_message.to_string();

    let paragraph = Paragraph::new(progress_text)
        .block(block)
        .alignment(Alignment::Center);

    f.render_widget(paragraph, area);
}

fn draw_complete(f: &mut Frame, area: ratatui::layout::Rect, app: &App) {
    let success_message = format!(
        "portfolio generated successfully!\n\nproject: {}\nlocation: ./{}/\ntheme: {}\nprojects: {} GitHub repos\n\nnext steps:\n• cd {}\n• npm install\n• npm run dev\n• open http://localhost:3000 in your browser\n\npress any key to exit",
        app.input_fields.project_name,
        app.input_fields.project_name,
        app.selected_theme().display_name,
        app.input_fields.github_projects.len(),
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
