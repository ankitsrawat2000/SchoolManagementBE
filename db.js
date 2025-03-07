import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host : process.env.MYSQL_HOST,
  user : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
}).promise();

async function createTables() {
    try {
      const connection = await pool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS schools (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          address VARCHAR(255) NOT NULL UNIQUE,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          UNIQUE KEY unique_lat_lon (latitude, longitude)
        );
      `);
    } catch (error) {
      console.error(error.message);
    }
  }

await createTables();

export async function getSchools() {
  try{
    const [rows] = await pool.query("SELECT * FROM schools");
    return rows; 
  } catch (error){
    console.error(error.message);
    throw error;
  }
       
}

export async function getSchool(id){
  try{
    const [rows] = await pool.query(`
      SELECT *
      FROM schools
      WHERE id = ?`,[id])
      return rows[0];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function createSchool(name, address, latitude, longitude){
  try{ 
    const [existingAddress] = await pool.query(
      `SELECT id FROM schools WHERE address = ?`, [address]
    );
    if (existingAddress.length > 0) {
      throw new Error("A school already exists with this address.");
    }

    const [existingLocation] = await pool.query(
      `SELECT id FROM schools WHERE latitude = ? AND longitude = ?`, [latitude, longitude]
    );
    if (existingLocation.length > 0) {
      throw new Error("A school already exists at this location.");
    }

    const [result] = await pool.query(`
    INSERT INTO schools (name, address, latitude, longitude )
    values (?, ?, ?, ?)`,[name, address, latitude, longitude])
    const id = result.insertId;
    return getSchool(id);

  } catch(error){
    console.error(error.message);
    throw error;
  }
}
