import getVerifyTokenInfo from "../../helpers/token_info";
import db from "../../lib/sqlite";

export default async function handler(req, res) {
    await getVerifyTokenInfo(req, res);

    if (req.method === "POST") {
        const { user_id, gender } = req.body;

        try {
            db.exec(`
                CREATE TABLE IF NOT EXISTS gender (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    gender TEXT NOT NULL
                )
            `);

            // Insert the event into the gender table
            const insertStmt = db.prepare("INSERT INTO gender (user_id, gender) VALUES (?, ?)");
            insertStmt.run(user_id, gender);

            // Return success response
            res.status(201).json({ status: "CREATED", message: "Wave created" });
        } catch (err) {
            // Handle any errors during database operations
            res.status(500).json({ status: "ERROR", message: "Error saving wave", error: err.message });
        }
    } else if (req.method === "GET") {
        const { user_id } = req.query;
        try {
            // Retrieve gender record by user_id
            const checkStmt = db.prepare('SELECT * FROM gender WHERE user_id = ?');
            const existingRecord = checkStmt.get(user_id);

            if (!existingRecord) {
                return res.status(404).json({
                    status: "NOT_FOUND",
                    message: "No gender record found for the specified user_id"
                });
            }

            return res.status(200).json({
                status: "SUCCESS",
                data: existingRecord
            });
        } catch (err) {
            res.status(200).json({
                status: "NOT_FOUND",
                message: "Wave records not found",
                data: null,
            });
        }
    } else if (req.method === "DELETE") {
        const { id, user_id } = req.body;

        try {
            // Check if the record exists
            const checkStmt = db.prepare('SELECT * FROM gender WHERE id = ? AND user_id = ?');
            const existingRecord = checkStmt.get(id, user_id);

            if (!existingRecord) {
                return res.status(404).json({
                    status: "NOT_FOUND",
                    message: "No wave record found for the specified id and user_id"
                });
            }

            // Delete the record
            const deleteStmt = db.prepare("DELETE FROM gender WHERE id = ? AND user_id = ?");
            deleteStmt.run(id, user_id);

            res.status(200).json({
                status: "SUCCESS",
                message: "Wave record deleted"
            });
        } catch (err) {
            res.status(500).json({
                status: "ERROR",
                message: "Error deleting wave record",
                error: err.message
            });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}