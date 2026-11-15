const db = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/api/test", (req, res) => {
    res.json({
        message: "TrustFund Backend is Working!"
    });
});
app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT DATABASE() AS dbName");

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
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`TrustFund server running at http://localhost:${PORT}`);
    });
}

module.exports = app;