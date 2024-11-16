import Database from "@tauri-apps/plugin-sql";


export interface Post {
    id: number,
    title: string,
    body: string
    created_at: string
}

let db: Database;

const connect = async () => {
    if (!db) {
        db = await Database.load('sqlite:mydatabase.db');
    }
    return db;
}

export const post = async (title: string, body: string) => {
    await connect()
    await db.execute('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body]);

}

export const remove = async (id: number) => {
    await connect()
    await db.execute('DELETE FROM posts WHERE id = ?', [id]);
}

export const list = async (sortMode: string | null) => {
    await connect()
    return await db.select<Post[]>(`SELECT id, title, body, created_at
                                    FROM posts ${sortMode ? `ORDER BY created_at ${sortMode}` : ''}`);
}