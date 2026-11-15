
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "TrustFund Backend is Working!"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS dbName"
        );

        res.json({
            message: "MySQL Connected Successfully!",
            database: rows[0].dbName
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Database Connection Failed"
        });
    }
});

app.post("/api/donate", async (req, res) => {
    try {
        const { name, email, campaign, amount } = req.body;

        const [users] = await db.query(
            "SELECT user_id FROM Users WHERE email = ?",
            [email]
        );

        let userId;

        if (users.length > 0) {
            userId = users[0].user_id;
        } else {
            const [newUser] = await db.query(
                "INSERT INTO Users (full_name, email, role) VALUES (?, ?, 'Donor')",
                [name, email]
            );

            userId = newUser.insertId;
        }

        const [campaigns] = await db.query(
            "SELECT campaign_id FROM Campaigns WHERE campaign_name = ?",
            [campaign]
        );

        if (campaigns.length === 0) {
            return res.status(400).json({
                message: "Campaign not found"
            });
        }

        await db.query(
            "INSERT INTO Donations (user_id, campaign_id, amount, donation_status) VALUES (?, ?, ?, 'Pending')",
            [userId, campaigns[0].campaign_id, amount]
        );

        res.json({
            message: "Donation saved successfully!"
        });

    } catch (error) {
        console.log("DONATION ERROR:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`TrustFund server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
