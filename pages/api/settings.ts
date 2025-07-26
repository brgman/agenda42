import getVerifyTokenInfo from "../../helpers/token_info";
import db from "../../lib/sqlite";

export default async function handler(req, res) {
    await getVerifyTokenInfo(req, res);
    if (req.method === "POST") {
        const { user_id, view_default, theme_default, chat_id } = req.body;

        try {
            // Ensure that the "settings" table is created (fixing the extra comma)
            db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            view_default TEXT NOT NULL,
            theme_default TEXT NOT NULL,
            chat_id TEXT
        )
    `);

            // Check if the user already exists in the settings table
            const checkStmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
            const existingUser = checkStmt.get(user_id);

            // If user exists, return the existing settings
            if (existingUser) {
                res.status(200).json({
                    status: "EXISTS",
                    message: "User ID already exists in settings",
                    data: existingUser  // Returning the existing settings object
                });
            } else {
                // Insert the event into the settings table
                const insertStmt = db.prepare("INSERT INTO settings (user_id, view_default, theme_default, chat_id) VALUES (?, ?, ?, ?)");
                insertStmt.run(user_id, view_default, theme_default, chat_id);

                // Return success response
                res.status(201).json({ status: "CREATED", message: "Evaluation created" });
            }
        } catch (err) {
            // Handle any errors during database operations
            res.status(500).json({ status: "ERROR", message: "Error saving evaluation", error: err.message });
        }
    } else if (req.method === "GET") {
        const { user_id } = req.query;
        try {
            // Retrieve user settings by user_id
            const checkStmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
            const userSettings = checkStmt.get(parseInt(user_id, 10));

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
        const { user_id, view_default, theme_default, chat_id } = req.body;

        try {
            // Check if the user exists
            const checkStmt = db.prepare('SELECT * FROM settings WHERE user_id = ?');
            const existingUser = checkStmt.get(user_id);

            if (existingUser) {
                // Update the existing user's settings
                const updateStmt = db.prepare(`
                    UPDATE settings
                    SET view_default = ?, theme_default = ?, chat_id = ?
                    WHERE user_id = ?
                `);
                updateStmt.run(view_default, theme_default, chat_id, user_id);

                res.status(200).json({
                    status: "UPDATED",
                    message: "User settings updated",
                    data: {
                        user_id,
                        view_default,
                        theme_default,
                        chat_id
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
        const { id } = req.body;
        try {
            db.prepare("DELETE FROM evaluations WHERE id = ?").run(id);
            res.status(200).json({ message: "Evaluation deleted" });
        } catch (err) {
            res.status(500).json({ message: "Error deleting evaluation", error: err.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
