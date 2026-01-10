const { getPool } = require('../config/database');

const User = {
    // Find user by ID
    findById: async function (id) {
        try {
            const pool = getPool();
            const [rows] = await pool.execute(
                'SELECT id, email, password, name, avatar, role, created_at, updated_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('findById error:', error);
            return null;
        }
    },

    // Find user by email
    findByEmail: async function (email) {
        try {
            const pool = getPool();
            const [rows] = await pool.execute(
                'SELECT id, email, password, name, avatar, role, created_at, updated_at FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('findByEmail error:', error);
            return null;
        }
    },

    // Create new user
    create: async function ({ email, password, name }) {
        try {
            const pool = getPool();
            const [result] = await pool.execute(
                'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                [email, password, name]
            );

            // Return the created user
            return await this.findById(result.insertId);
        } catch (error) {
            console.error('create error:', error);
            throw error;
        }
    },

    // Update user profile
    update: async function (id, { name, avatar }) {
        try {
            const pool = getPool();
            const updates = [];
            const values = [];

            if (name) {
                updates.push('name = ?');
                values.push(name);
            }
            if (avatar) {
                updates.push('avatar = ?');
                values.push(avatar);
            }

            if (updates.length === 0) {
                return await this.findById(id);
            }

            values.push(id);
            await pool.execute(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            return await this.findById(id);
        } catch (error) {
            console.error('update error:', error);
            throw error;
        }
    },

    // Update password
    updatePassword: async function (id, password) {
        try {
            const pool = getPool();
            const [result] = await pool.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [password, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('updatePassword error:', error);
            return false;
        }
    },

    // Delete user
    delete: async function (id) {
        try {
            const pool = getPool();
            const [result] = await pool.execute(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('delete error:', error);
            return false;
        }
    },

    // Find all users
    findAll: async function () {
        try {
            const pool = getPool();
            const [rows] = await pool.execute(
                'SELECT id, email, name, avatar, role, created_at, updated_at FROM users ORDER BY created_at DESC'
            );
            return rows;
        } catch (error) {
            console.error('findAll error:', error);
            return [];
        }
    }
};

module.exports = User;
