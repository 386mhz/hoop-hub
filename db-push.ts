import { db } from './server/db';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './shared/schema';

async function main() {
  try {
    console.log('Pushing schema to database...');
    // Create tables if they don't exist
    await db.execute(/* sql */`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'player',
        jersey_number INTEGER,
        position TEXT,
        team_id INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        abbreviation TEXT NOT NULL,
        color TEXT NOT NULL,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        points_per_game INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        home_team_id INTEGER NOT NULL,
        away_team_id INTEGER NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        home_score INTEGER,
        away_score INTEGER,
        is_playoff BOOLEAN DEFAULT FALSE,
        scorekeeper_ids TEXT[]
      );
      
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        status TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        game_id INTEGER NOT NULL,
        points INTEGER DEFAULT 0,
        rebounds INTEGER DEFAULT 0,
        assists INTEGER DEFAULT 0,
        games_played INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        is_pinned BOOLEAN DEFAULT FALSE
      );
      
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        chat_type TEXT NOT NULL,
        team_id INTEGER,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    
    console.log('Schema push completed successfully!');
  } catch (error) {
    console.error('Error pushing schema:', error);
    process.exit(1);
  }
}

main();