const { Pool } = require('pg');
const dotenv = require('dotenv');
const localStore = require('./localStore');

dotenv.config();

let usePostgres = true;
let isPostgresConnected = false;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL.includes('localhost')
        ? { rejectUnauthorized: false }
        : false,
    }
  : {
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'que_solutions',
      password: process.env.PGPASSWORD || 'postgres',
      port: parseInt(process.env.PGPORT || '5432', 10),
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  if (isPostgresConnected) {
    console.error('[PostgreSQL Pool Error]', err.message);
  }
});

// Check connectivity on startup
async function initDb() {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    isPostgresConnected = true;
    usePostgres = true;
    console.log(`[Database] Connected to PostgreSQL: "${res.rows[0].db_name}" at ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    isPostgresConnected = false;
    usePostgres = false;
    console.warn(`[Database Notice] PostgreSQL not reachable (${err.message}).`);
    console.warn(`[Database Notice] Switched to persistent local storage engine.`);
    console.warn(`[Database Notice] When deployed to Railway, PostgreSQL will be used via DATABASE_URL.`);
    return false;
  }
}

// Emulated SQL executor for local store
function executeLocalQuery(text, params = []) {
  const sql = text.trim();
  const normalizedSql = sql.replace(/\s+/g, ' ');

  // 1. SELECT queries
  if (/^SELECT/i.test(sql)) {
    // Check table
    const fromMatch = sql.match(/FROM\s+([a-zA-Z_]+)/i);
    if (!fromMatch) {
      // e.g. SELECT NOW()
      return { rows: [{ now: new Date().toISOString() }], rowCount: 1 };
    }
    const tableName = fromMatch[1].toLowerCase();
    let rows = [...localStore.getTable(tableName)];

    // Basic WHERE filter
    if (/WHERE/i.test(sql)) {
      const wherePart = sql.substring(sql.search(/WHERE/i) + 5);

      // WHERE email = $1
      if (/email\s*=\s*\$1/i.test(wherePart)) {
        rows = rows.filter(r => r.email && r.email.toLowerCase() === String(params[0]).toLowerCase());
      }
      // WHERE id = $1
      else if (/id\s*=\s*\$1/i.test(wherePart)) {
        rows = rows.filter(r => r.id === parseInt(params[0], 10));
      }
      // WHERE lead_id = $1
      else if (/lead_id\s*=\s*\$1/i.test(wherePart)) {
        rows = rows.filter(r => r.lead_id === parseInt(params[0], 10));
      }
      // WHERE status = $1
      else if (/status\s*=\s*\$1/i.test(wherePart)) {
        rows = rows.filter(r => r.status === params[0]);
      }
      // WHERE is_active = TRUE
      if (/is_active\s*=\s*TRUE/i.test(wherePart)) {
        rows = rows.filter(r => r.is_active === true || r.is_active === 1);
      }
    }

    // ORDER BY
    if (/ORDER BY/i.test(sql)) {
      const orderPart = sql.substring(sql.search(/ORDER BY/i) + 8);
      if (/display_order\s+ASC/i.test(orderPart) || /display_order/i.test(orderPart)) {
        rows.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      } else if (/created_at\s+DESC/i.test(orderPart)) {
        rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (/timestamp\s+DESC/i.test(orderPart)) {
        rows.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    }

    // COUNT queries
    if (/SELECT\s+count\(\*\)/i.test(sql)) {
      return { rows: [{ count: rows.length }], rowCount: 1 };
    }

    // LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+|\$\d+)/i);
    if (limitMatch) {
      let limit = parseInt(limitMatch[1], 10);
      if (isNaN(limit) && limitMatch[1].startsWith('$')) {
        const paramIdx = parseInt(limitMatch[1].substring(1), 10) - 1;
        limit = parseInt(params[paramIdx], 10);
      }
      if (!isNaN(limit)) {
        rows = rows.slice(0, limit);
      }
    }

    return { rows, rowCount: rows.length };
  }

  // 2. INSERT queries
  if (/^INSERT INTO/i.test(sql)) {
    const match = sql.match(/INSERT INTO\s+([a-zA-Z_]+)\s*\(([^)]+)\)/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      const columns = match[2].split(',').map(c => c.trim().toLowerCase());
      const table = localStore.getTable(tableName);

      const newRecord = {
        id: localStore.getNextId(tableName),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      columns.forEach((col, idx) => {
        let val = params[idx];
        // parse JSON if needed
        if ((col === 'features') && typeof val === 'string') {
          try { val = JSON.parse(val); } catch (e) {}
        }
        newRecord[col] = val;
      });

      table.push(newRecord);
      localStore.save();
      return { rows: [newRecord], rowCount: 1 };
    }
  }

  // 3. UPDATE queries
  if (/^UPDATE/i.test(sql)) {
    const match = sql.match(/UPDATE\s+([a-zA-Z_]+)/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      const table = localStore.getTable(tableName);

      let targetRecord = null;
      // If updating site_settings or hero_content or about_content by id=1
      if (/WHERE\s+id\s*=\s*1/i.test(sql)) {
        targetRecord = table.find(r => r.id === 1);
      } else {
        // Last param is usually id
        const idParam = params[params.length - 1];
        targetRecord = table.find(r => r.id === parseInt(idParam, 10));
      }

      if (targetRecord) {
        // Extract SET column assignments
        const setMatch = sql.match(/SET\s+([\s\S]+?)(?:WHERE|$)/i);
        if (setMatch) {
          const assignments = setMatch[1].split(',').map(a => a.trim());
          assignments.forEach(assign => {
            const parts = assign.split('=').map(p => p.trim());
            const col = parts[0].toLowerCase();
            const paramMatch = parts[1].match(/\$(\d+)/);
            if (paramMatch) {
              const paramIdx = parseInt(paramMatch[1], 10) - 1;
              let val = params[paramIdx];
              if (col === 'features' && typeof val === 'string') {
                try { val = JSON.parse(val); } catch (e) {}
              }
              targetRecord[col] = val;
            } else if (parts[1].toUpperCase() === 'CURRENT_TIMESTAMP') {
              targetRecord[col] = new Date().toISOString();
            }
          });
          targetRecord.updated_at = new Date().toISOString();
          localStore.save();
          return { rows: [targetRecord], rowCount: 1 };
        }
      }
      return { rows: [], rowCount: 0 };
    }
  }

  // 4. DELETE queries
  if (/^DELETE FROM/i.test(sql)) {
    const match = sql.match(/DELETE FROM\s+([a-zA-Z_]+)\s+WHERE\s+id\s*=\s*\$1/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      const id = parseInt(params[0], 10);
      const table = localStore.getTable(tableName);
      const index = table.findIndex(r => r.id === id);
      if (index !== -1) {
        table.splice(index, 1);
        localStore.save();
        return { rows: [], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }
  }

  return { rows: [], rowCount: 0 };
}

// Unified query interface
async function query(text, params = []) {
  if (usePostgres && isPostgresConnected) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.error(`[PostgreSQL Query Error]: ${err.message}`);
      throw err;
    }
  }

  // Fallback to local store
  return executeLocalQuery(text, params);
}

async function testConnection() {
  if (isPostgresConnected) {
    return {
      connected: true,
      database: 'PostgreSQL',
      time: new Date().toISOString()
    };
  }
  return {
    connected: false,
    error: 'PostgreSQL not connected. Local storage active.'
  };
}

module.exports = {
  pool,
  query,
  initDb,
  testConnection,
  isPostgresConnected: () => isPostgresConnected,
};
