use tauri_plugin_sql::{Migration, MigrationKind};

fn get_seed_list() -> Vec<Migration> {
    vec![Migration {
        version: 3,
        description: "Seed database with lots of posts",
        sql: "INSERT INTO posts (title, body) VALUES ('testtitle','testbody testbody testbody testbody testbody')",
        kind: MigrationKind::Up,
    }]
}

pub fn get_migrations() -> Vec<Migration> {
    let mut migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, body TEXT);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "Add timestamp to posts table",
            sql: "ALTER TABLE posts ADD COLUMN created_at DATETIME;
                 UPDATE posts SET created_at = datetime('now') WHERE created_at IS NULL;",
            kind: MigrationKind::Up,
        },
    ];
    migrations.extend(get_seed_list());
    migrations
}
