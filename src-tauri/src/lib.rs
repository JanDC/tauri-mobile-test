pub mod models;
pub mod schema;

use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use crate::models::{NewPost, Post};
pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}
#[tauri::command]
fn get_posts() -> Vec<Post> {
    println!("get_posts");
    use self::schema::posts::dsl::*;

    let connection = &mut establish_connection();
    let results = posts
        .filter(published.eq(true))
        .limit(5)
        .select(Post::as_select())
        .load(connection)
        .expect("Error loading posts");
    results.into()
}

#[tauri::command]
fn create_post(title: &str, body: &str) -> Post {
    println!("create_post");
    use crate::schema::posts;

    let connection = &mut establish_connection();
    let new_post = NewPost { title, body };

    let inserted_post = diesel::insert_into(posts::table)
        .values(&new_post)
        .returning(Post::as_returning())
        .get_result(connection)
        .expect("Error saving new post");

    inserted_post.into()
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_posts,create_post])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}