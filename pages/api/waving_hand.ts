import getVerifyTokenInfo from "../../helpers/token_info";
import db from "../../lib/sqlite";

export default async function handler(req, res) {
    await getVerifyTokenInfo(req, res);
    if (req.method === "POST") {
        const { author_id, destinator_id, event_title, status, author_image_url, author_name, author_login } = req.body;

        try {
            db.exec(`
                CREATE TABLE IF NOT EXISTS waving_hand (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    author_id TEXT NOT NULL,
                    destinator_id TEXT NOT NULL,
                    event_title TEXT NOT NULL,
                    status TEXT NOT NULL,
                    author_image_url TEXT NOT NULL,
                    author_name TEXT NOT NULL,
                    author_login TEXT NOT NULL
                )
            `);

            // Insert the event into the waving_hand table
            const insertStmt = db.prepare("INSERT INTO waving_hand (author_id, destinator_id, event_title, status, author_image_url, author_name, author_login) VALUES (?, ?, ?, ?, ?, ?, ?)");
            insertStmt.run(author_id, destinator_id, event_title, status, author_image_url, author_name, author_login);

            // Return success response
            res.status(201).json({ status: "CREATED", message: "Wave created" });
        } catch (err) {
            // Handle any errors during database operations
            res.status(500).json({ status: "ERROR", message: "Error saving wave", error: err.message });
        }
    } else if (req.method === "GET") {
        const { destinator_id } = req.query;
        try {
            // Retrieve wave records by author_id
            const checkStmt = db.prepare('SELECT * FROM waving_hand WHERE destinator_id = ?');
            const waveRecords = checkStmt.all(parseInt(destinator_id, 10));

            if (waveRecords.length > 0) {
                res.status(200).json({
                    status: "SUCCESS",
                    message: "Wave records found",
                    data: waveRecords
                });
            } else {
                res.status(200).json({
                    status: "NOT_FOUND",
                    message: "Wave records not found",
                    data: null,
                });
            }
        } catch (err) {
            res.status(200).json({
                status: "NOT_FOUND",
                message: "Wave records not found",
                data: null,
            });
        }
    } else if (req.method === "PUT" || req.method === "PATCH") {
        const { id, author_id, destinator_id, event_title, status, author_image_url, author_name, author_login } = req.body;

        try {
            // Check if the record exists
            const checkStmt = db.prepare('SELECT * FROM waving_hand WHERE id = ?');
            const existingRecord = checkStmt.get(id);

            if (existingRecord) {
                // Update the existing record
                const updateStmt = db.prepare(`
                    UPDATE waving_hand
                    SET status = ?
                    WHERE id = ?
                `);
                updateStmt.run(status, id);

                res.status(200).json({
                    status: "UPDATED",
                    message: "Wave record status updated",
                    data: { id, status },
                });
            } else {
                // If record doesn't exist, return an error
                res.status(404).json({
                    status: "NOT_FOUND",
                    message: "Wave record not found " + status
                });
            }
        } catch (err) {
            // Handle any errors during the update process
            res.status(500).json({ status: "ERROR", message: "Error updating wave record", error: err.message });
        }
    } else if (req.method === "DELETE") {
        const { id, author_id } = req.body;

        try {
            // Check if the record exists
            const checkStmt = db.prepare('SELECT * FROM waving_hand WHERE id = ? AND author_id = ?');
            const existingRecord = checkStmt.get(id, author_id);

            if (!existingRecord) {
                return res.status(404).json({
                    status: "NOT_FOUND",
                    message: "No wave record found for the specified id and author_id"
                });
            }

            // Delete the record
            const deleteStmt = db.prepare("DELETE FROM waving_hand WHERE id = ? AND author_id = ?");
            deleteStmt.run(id, author_id);

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