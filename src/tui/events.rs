// event handling utilities for the terminal interface
// provides clean abstractions for keyboard and mouse events

use crossterm::event::{self, Event, KeyCode, KeyEvent, KeyModifiers};
use std::time::Duration;

pub struct EventHandler {
    pub timeout: Duration,
}

impl EventHandler {
    pub fn new(timeout_ms: u64) -> Self {
        Self {
            timeout: Duration::from_millis(timeout_ms),
        }
    }

    // polls for the next event with timeout
    pub fn next(&self) -> Result<Option<InputEvent>, Box<dyn std::error::Error>> {
        if event::poll(self.timeout)? {
            match event::read()? {
                Event::Key(key_event) => Ok(Some(InputEvent::Key(key_event))),
                Event::Mouse(mouse_event) => Ok(Some(InputEvent::Mouse(mouse_event))),
                Event::Resize(width, height) => Ok(Some(InputEvent::Resize(width, height))),
                _ => Ok(None),
            }
        } else {
            Ok(None)
        }
    }
}

#[derive(Debug, Clone)]
pub enum InputEvent {
    Key(KeyEvent),
    Mouse(crossterm::event::MouseEvent),
    Resize(u16, u16),
}

// helper functions for common key combinations
pub fn is_quit_key(key_event: &KeyEvent) -> bool {
    matches!(
        key_event,
        KeyEvent {
            code: KeyCode::Char('q'),
            modifiers: KeyModifiers::NONE,
            ..
        } | KeyEvent {
            code: KeyCode::Char('c'),
            modifiers: KeyModifiers::CONTROL,
            ..
        } | KeyEvent {
            code: KeyCode::Esc,
            modifiers: KeyModifiers::NONE,
            ..
        }
    )
}

pub fn is_enter_key(key_event: &KeyEvent) -> bool {
    matches!(
        key_event,
        KeyEvent {
            code: KeyCode::Enter,
            modifiers: KeyModifiers::NONE,
            ..
        }
    )
}

pub fn is_tab_key(key_event: &KeyEvent) -> bool {
    matches!(
        key_event,
        KeyEvent {
            code: KeyCode::Tab,
            modifiers: KeyModifiers::NONE,
            ..
        }
    )
}

pub fn is_back_tab_key(key_event: &KeyEvent) -> bool {
    matches!(
        key_event,
        KeyEvent {
            code: KeyCode::BackTab,
            modifiers: KeyModifiers::SHIFT,
            ..
        }
    )
}
