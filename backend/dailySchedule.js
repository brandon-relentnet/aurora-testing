// dailySchedule.js is used to check the daily schedule of games in the database
require('dotenv').config()
const { Client } = require('pg')

async function runDailySchedule() {
    const client = new Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    })

    try {
        await client.connect()
        console.log('Connected to Aurora in dailySchedule.js')

        // Example: find all games that are scheduled for "today"
        // and not in a "final/post" state
        const query = `
            SELECT *
            FROM games
            WHERE
                DATE(start_time) = CURRENT_DATE
                AND state NOT IN ('post', 'completed', 'final')
            ORDER BY start_time ASC
        `
        const result = await client.query(query)

        console.log(`\n--- Today's Games (Not Final) ---`)
        result.rows.forEach(row => {
            console.log(`${row.league} - game_id=${row.external_game_id} start=${row.start_time} state=${row.state}`)
        })

        // Might do more logic here:
        // e.g., schedule a dynamic cron job to poll more frequently near these start times

        console.log('\nDaily schedule check complete.')
    } catch (err) {
        console.error('Error in runDailySchedule:', err)
    } finally {
        await client.end()
    }
}

module.exports = { runDailySchedule }
