import axios from "axios";
import db from "../../lib/sqlite";
import getVerifyTokenInfo from "../../helpers/token_info";

export default async function handler(req, res) {
    await getVerifyTokenInfo(req, res);

    if (req.method === "POST") {
        const { user_id, friend_id, friend_login, friend_name, friend_image, pool_year, pool_month } = req.body;

        try {
            db.exec(`
                CREATE TABLE IF NOT EXISTS friends (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    friend_id TEXT NOT NULL,
                    friend_login TEXT NOT NULL,
                    friend_name TEXT NOT NULL,
                    friend_image TEXT NOT NULL,
                    pool_month TEXT NOT NULL,
                    pool_year TEXT NOT NULL
                )
            `);

            // Check if the user already exists in the friends table
            const checkStmt = db.prepare('SELECT * FROM friends WHERE user_id = ?');
            // const existingUser = checkStmt.get(user_id);

            // Insert the event into the friends table
            const insertStmt = db.prepare("INSERT INTO friends (user_id, friend_id, friend_login, friend_name, friend_image, pool_month, pool_year) VALUES (?, ?, ?, ?, ?, ?, ?)");
            insertStmt.run(user_id, friend_id, friend_login, friend_name, friend_image, pool_month, pool_year);

            // Return success response
            res.status(201).json({ status: "CREATED", message: "Evaluation created" });
        } catch (err) {
            // Handle any errors during database operations
            res.status(500).json({ status: "ERROR", message: "Error saving evaluation", error: err.message });
        }
    } else if (req.method === "GET") {
        const { user_id } = req.query;
        try {
            // Retrieve user settings by user_id
            const checkStmt = db.prepare('SELECT * FROM friends WHERE user_id = ?');
            const userSettings = checkStmt.all(parseInt(user_id, 10));

            if (userSettings) {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "User settings found",
                    data: userSettings
                });
            } else {
                res.status(200).json({
                    status: "NOT_FOUND",
                    message: "User settings not found",
                    data: null,
                });
            }
        } catch (err) {
            res.status(200).json({
                status: "NOT_FOUND",
                message: "User settings not found",
                data: null,
            });
        }
    } else if (req.method === "PUT" || req.method === "PATCH") {
        const { user_id, friend_id, friend_login, friend_name, friend_image, pool_month, pool_year } = req.body;

        try {
            // Check if the user exists
            const checkStmt = db.prepare('SELECT * FROM friends WHERE user_id = ?');
            const existingUser = checkStmt.get(user_id);

            if (existingUser) {
                // Update the existing user's settings
                const updateStmt = db.prepare(`
                    UPDATE friends
                    SET friend_id = ?, friend_login = ?, friend_name = ?, friend_image = ?, pool_month = ?, pool_year = ?
                    WHERE user_id = ?
                `);
                updateStmt.run(friend_id, friend_login, friend_name, friend_image, pool_month, pool_year, user_id);

                res.status(200).json({
                    status: "UPDATED",
                    message: "User settings updated",
                    data: {
                        user_id,
                        friend_id,
                        friend_login,
                        friend_name,
                        friend_image,
                        pool_month,
                        pool_year
                    }
                });
            } else {
                // If user doesn't exist, return an error
                res.status(404).json({
                    status: "NOT_FOUND",
                    message: "User ID not found"
                });
            }
        } catch (err) {
            // Handle any errors during the update process
            res.status(500).json({ status: "ERROR", message: "Error updating user settings", error: err.message });
        }
    } else if (req.method === "DELETE") {
        const { user_id, friend_id } = req.body;
        
        try {
            // Check if the record exists
            const checkStmt = db.prepare('SELECT * FROM friends WHERE user_id = ? AND friend_id = ?');
            const existingRecord = checkStmt.get(user_id, friend_id);

            if (!existingRecord) {
                return res.status(404).json({
                    status: "NOT_FOUND",
                    message: "No record found for the specified user_id and friend_id"
                });
            }

            // Delete the record
            const deleteStmt = db.prepare("DELETE FROM friends WHERE user_id = ? AND friend_id = ?");
            deleteStmt.run(user_id, friend_id);

            res.status(200).json({
                status: "SUCCESS",
                message: "Friend relationship deleted"
            });
        } catch (err) {
            res.status(500).json({
                status: "ERROR",
                message: "Error deleting friend relationship",
                error: err.message
            });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}