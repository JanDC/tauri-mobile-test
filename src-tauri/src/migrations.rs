use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, body TEXT);",
            kind: MigrationKind::Up,
        }, Migration {
            version: 2,
            description: "Add timestamp to posts table",
            sql: "ALTER TABLE posts ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;",
            kind: MigrationKind::Up,
        }
    ]
}

