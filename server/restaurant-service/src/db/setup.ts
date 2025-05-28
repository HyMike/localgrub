import pool from './index';


export const setupDatabase = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        item VARCHAR(255),
        quantity INTEGER,
        incredients_available BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW() 
        );
    `);

    await pool.query(`
    INSERT INTO inventory (item, quantity, incredients_available)
    VALUES 
        ($1, $2, $3),
        ($4, $5, $6),
        ($7, $8, $9),
        ($10, $11, $12),
        ($13, $14, $15),
        ($16, $17, $18)
    `,
    [
    'Burger Au Poivre Kit - 4 Pack', 100, true,
    'Pork and Shrimp Wontons - 20 Pack',100, true,
    'Pasta Dinner for 2 - Choose Your Own',100, true,
    'Traditional Argentinian Asado Feast for 10-12',0, false,
    'Neapolitan Pizza - Choose Your Own 4 Pack',100, true,
    'Double Stack Burger Kit for 4',100, true
    ]
    );
}

export default setupDatabase;