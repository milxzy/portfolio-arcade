// template copying and configuration logic
// copies console themes and adapts them with user data

use crate::models::{PortfolioConfig, Theme};
use anyhow::{anyhow, Result};
use serde_json::Value;
use std::path::PathBuf;
use std::{env, fs};

pub struct TemplateGenerator {
    pub project_name: String,
    pub config: PortfolioConfig,
    pub source_dir: PathBuf,
    pub target_dir: PathBuf,
    pub theme: Theme,
}

impl TemplateGenerator {
    pub fn new(project_name: String, config: PortfolioConfig) -> Result<Self> {
        // get the current directory where templates should be located
        let current_dir = env::current_dir()?;
        
        // get the executable directory for relative path resolution
        let exe_dir = env::current_exe()
            .ok()
            .and_then(|p| p.parent().map(|p| p.to_path_buf()));
        
        // try multiple possible template locations with extensive fallbacks
        let mut possible_template_dirs = vec![
            // Current working directory
            current_dir.join("templates"),
            PathBuf::from("templates"),
            PathBuf::from("./templates"),
        ];
        
        // Add executable-relative paths if we can determine exe location
        if let Some(exe_path) = exe_dir {
            possible_template_dirs.extend(vec![
                exe_path.join("templates"),
                exe_path.join("../templates"),
                exe_path.join("../../templates"),
                // For development: if exe is in target/debug or target/release
                exe_path.join("../../../templates"),
            ]);
        }
        
        // Add common project structure fallbacks
        possible_template_dirs.extend(vec![
            PathBuf::from("portfolio-arcade/templates"),
            PathBuf::from("../portfolio-arcade/templates"),
            current_dir.join("portfolio-arcade/templates"),
            current_dir.parent().map(|p| p.join("portfolio-arcade/templates")).unwrap_or_else(|| PathBuf::from("")),
        ]);
        
        // Clone the paths for error message before moving
        let paths_for_error = possible_template_dirs.clone();
        
        let templates_dir = possible_template_dirs
            .into_iter()
            .find(|dir| dir.exists() && dir.is_dir())
            .ok_or_else(|| anyhow!(
                "templates directory not found. Tried:\n{}\nCurrent directory: {}\nExecutable location: {}",
                paths_for_error.iter()
                    .map(|p| format!("- {}", p.display()))
                    .collect::<Vec<_>>()
                    .join("\n"),
                current_dir.display(),
                env::current_exe().map(|p| p.display().to_string()).unwrap_or_else(|_| "unknown".to_string())
            ))?;

        // find the selected theme
        let theme = Theme::find_by_id(&config.theme)
            .ok_or_else(|| anyhow!("theme '{}' not found", config.theme))?;

        let source_dir = templates_dir.join(&theme.template_dir);
        let target_dir = current_dir.join(&project_name);

        // validate that source template exists
        if !source_dir.exists() {
            return Err(anyhow!(
                "template directory not found: {}",
                source_dir.display()
            ));
        }

        // check if target directory already exists
        if target_dir.exists() {
            return Err(anyhow!(
                "directory '{}' already exists",
                target_dir.display()
            ));
        }

        Ok(Self {
            project_name,
            config,
            source_dir,
            target_dir,
            theme,
        })
    }

    pub async fn generate(&self) -> Result<()> {
        // step 1: copy template directory
        self.copy_template()?;

        // step 2: update package.json
        self.update_package_json()?;

        // step 3: update layout.tsx with user info
        self.update_layout_file()?;

        // step 4: create portfolio data file
        self.create_portfolio_data()?;

        // step 5: update readme
        self.update_readme()?;

        // step 6: setup cms if selected
        self.setup_cms()?;

        Ok(())
    }

    fn copy_template(&self) -> Result<()> {
        use walkdir::WalkDir;
        
        // Create target directory
        fs::create_dir_all(&self.target_dir)?;
        
        // Directories and files to exclude
        let exclude_names = vec!["node_modules", ".next", "package-lock.json"];
        
        // Walk through source directory and copy files selectively
        for entry in WalkDir::new(&self.source_dir)
            .into_iter()
            .filter_entry(|e| {
                // Exclude specific directories and files
                let file_name = e.file_name().to_string_lossy();
                !exclude_names.contains(&file_name.as_ref())
            })
        {
            let entry = entry?;
            let path = entry.path();
            
            // Skip the root source directory itself
            if path == self.source_dir {
                continue;
            }
            
            // Calculate relative path from source
            let relative_path = path.strip_prefix(&self.source_dir)?;
            let target_path = self.target_dir.join(relative_path);
            
            if entry.file_type().is_dir() {
                fs::create_dir_all(&target_path)?;
            } else {
                // Ensure parent directory exists
                if let Some(parent) = target_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                fs::copy(path, &target_path)?;
            }
        }

        Ok(())
    }

    fn update_package_json(&self) -> Result<()> {
        let package_json_path = self.target_dir.join("package.json");
        let content = fs::read_to_string(&package_json_path)?;

        let mut package_json: Value = serde_json::from_str(&content)?;

        // update the name field
        if let Value::Object(ref mut obj) = package_json {
            obj.insert("name".to_string(), Value::String(self.project_name.clone()));
        }

        // write it back
        let updated_content = serde_json::to_string_pretty(&package_json)?;
        fs::write(package_json_path, updated_content)?;

        Ok(())
    }

    fn update_layout_file(&self) -> Result<()> {
        // find the layout file - it's in app/layout.tsx for next.js apps
        let layout_path = self.target_dir.join("app").join("layout.tsx");

        if layout_path.exists() {
            self.theme.update_layout(&layout_path, &self.config)?;
        }

        Ok(())
    }

    fn create_portfolio_data(&self) -> Result<()> {
        // create a data directory in public for client-side access
        let public_data_dir = self.target_dir.join("public").join("data");
        fs::create_dir_all(&public_data_dir)?;

        // create portfolio.json with adapted project data
        let portfolio_data = self.theme.adapt_projects(&self.config.projects)?;

        let portfolio_file = public_data_dir.join("portfolio.json");
        let full_config = serde_json::json!({
            "user": self.config.user,
            "projects": portfolio_data,
            "theme": self.config.theme,
            "cms": format!("{:?}", self.config.cms).to_lowercase(),
            "dev_port": self.config.dev_port
        });

        let content = serde_json::to_string_pretty(&full_config)?;
        fs::write(portfolio_file, content)?;

        // create a sample project directory structure
        self.create_sample_content()?;

        Ok(())
    }

    fn create_sample_content(&self) -> Result<()> {
        // create content/projects directory
        let content_dir = self.target_dir.join("content").join("projects");
        fs::create_dir_all(&content_dir)?;

        // create a sample project markdown file
        let sample_project = r#"---
title: "sample project"
description: "a great example project showcasing your skills"
tech: ["react", "typescript", "tailwind css"]
featured: true
github: "https://github.com/username/project"
live: "https://project.example.com"
date: "2024-01-15"
---

# sample project

this is a sample project to help you get started. edit this file to add your own projects!

## features

- modern tech stack
- responsive design  
- great user experience

## tech stack

- react with typescript
- tailwind css for styling
- next.js for the framework

## what you learned

describe what you learned building this project and what challenges you solved.

replace this content with your own projects by editing files in the `content/projects/` directory.
"#.to_string();

        let sample_file = content_dir.join("sample-project.md");
        fs::write(sample_file, sample_project)?;

        // create images directory
        let images_dir = self.target_dir.join("public").join("projects");
        fs::create_dir_all(images_dir)?;

        Ok(())
    }

    fn update_readme(&self) -> Result<()> {
        let readme_path = self.target_dir.join("README.md");

        let readme_content = format!(
            r#"# {} Portfolio

A {} themed portfolio website generated with Portfolio Arcade.

## getting started

1. install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. open [http://localhost:{}](http://localhost:{}) in your browser

## customizing your portfolio

### adding projects

Add your projects in the `content/projects/` directory as markdown files. Each file should have frontmatter with project details:

```markdown
---
title: "your project name"
description: "brief description"
tech: ["react", "node.js"]
featured: true
github: "https://github.com/username/repo"
live: "https://yourproject.com"
date: "2024-01-15"
---

# project details

write about your project here...
```

### updating your info

Edit the user information in `data/portfolio.json`:

```json
{{
  "user": {{
    "name": "{}",
    "title": "{}",
    "bio": "your bio here"
  }}
}}
```

### theme customization

This portfolio uses the **{}** theme. You can customize:

- colors in `tailwind.config.ts`
- fonts in `app/layout.tsx`  
- components in the `components/` directory

## cms integration

{}

## deployment

This is a standard next.js app and can be deployed to:

- vercel (recommended)
- netlify
- github pages
- any static hosting provider

## built with

- [next.js](https://nextjs.org/)
- [react](https://reactjs.org/)
- [typescript](https://www.typescriptlang.org/)
- [tailwind css](https://tailwindcss.com/)
- [portfolio arcade](https://github.com/username/portfolio-arcade)

---

made with portfolio arcade
"#,
            self.project_name,
            self.theme.display_name,
            self.config.dev_port,
            self.config.dev_port,
            self.config.user.name,
            self.config.user.title,
            self.theme.display_name,
            self.get_cms_instructions()
        );

        fs::write(readme_path, readme_content)?;
        Ok(())
    }

    fn get_cms_instructions(&self) -> String {
        match self.config.cms {
            crate::models::CmsType::Decap => {
                "This project is set up with Decap CMS for easy content management. Access the admin interface at `/admin` when running locally."
            }
            crate::models::CmsType::Payload => {
                "This project is configured for Payload CMS. You'll need to set up a Payload server separately."
            }
            crate::models::CmsType::None => {
                "No CMS configured. Edit content directly in the `content/` directory and `data/portfolio.json`."
            }
        }.to_string()
    }

    fn setup_cms(&self) -> Result<()> {
        match self.config.cms {
            crate::models::CmsType::Decap => self.setup_decap_cms(),
            crate::models::CmsType::Payload => self.setup_payload_cms(),
            crate::models::CmsType::None => Ok(()),
        }
    }

    fn setup_decap_cms(&self) -> Result<()> {
        // create public/admin directory
        let admin_dir = self.target_dir.join("public").join("admin");
        fs::create_dir_all(&admin_dir)?;

        // create admin index.html
        let admin_html = r#"<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Content Manager</title>
  <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>"#;

        fs::write(admin_dir.join("index.html"), admin_html)?;

        // create decap cms config
        let config_yml = r#"backend:
  name: git-gateway
  branch: main

media_folder: "public/images/projects"
public_folder: "/images/projects"

collections:
  - name: "projects"
    label: "Projects"
    folder: "content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Tech Stack", name: "tech", widget: "list"}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "GitHub URL", name: "github", widget: "string", required: false}
      - {label: "Live URL", name: "live", widget: "string", required: false}
      - {label: "Date", name: "date", widget: "date"}
      - {label: "Body", name: "body", widget: "markdown"}

  - name: "settings"
    label: "Settings"
    files:
      - label: "Portfolio Config"
        name: "portfolio"
        file: "data/portfolio.json"
        fields:
          - label: "User"
            name: "user"
            widget: "object"
            fields:
              - {label: "Name", name: "name", widget: "string"}
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Bio", name: "bio", widget: "text"}
              - label: "Social Links"
                name: "social"
                widget: "object"
                fields:
                  - {label: "GitHub", name: "github", widget: "string", required: false}
                  - {label: "LinkedIn", name: "linkedin", widget: "string", required: false}
                  - {label: "Email", name: "email", widget: "string", required: false}
"#.to_string();

        fs::write(admin_dir.join("config.yml"), config_yml)?;

        Ok(())
    }

    fn setup_payload_cms(&self) -> Result<()> {
        // create a payload config file template
        let payload_config = r#"// payload cms configuration
// you'll need to set up a payload server separately

export const payloadConfig = {
  collections: [
    {
      slug: 'projects',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'techStack', type: 'array', of: [{ type: 'text' }] },
        { name: 'featured', type: 'checkbox' },
        { name: 'github', type: 'text' },
        { name: 'live', type: 'text' },
        { name: 'content', type: 'richText' },
      ],
    },
  ],
};"#;

        fs::write(self.target_dir.join("payload.config.js"), payload_config)?;
        Ok(())
    }
}