const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'shopDev',
    waitForConnections: true,
});

const batchSize = 100000;
const totalSize = 1000000;

let currentId = 1;

const insertBatch = async () => {
    const values = [];
    for (let index = 0; index < batchSize && currentId <= totalSize; index++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (values.length === 0) {
        pool.end(err => {
            if (err) {
                console.log(`Error occurred while closing the connection pool:`, err);
            } else {
                console.log(`Connection pool closed successfully`);
            }
        });
        return;
    }

    const sql = `INSERT INTO tests (id, name, age, address) VALUES ?`;
    pool.query(sql, [values], async (err, result) => {
        if (err) {
            console.error(`Error occurred during batch insert:`, err);
            return;
        }
        
        console.log(`Inserted ${result.affectedRows} records`);
        await insertBatch(); // Continue with the next batch
    });
};

// Start the batch insertion process
insertBatch().catch(err => console.error(`Error in batch insertion process:`, err));
