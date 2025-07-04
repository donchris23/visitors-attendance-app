const db = require('../db');

async function checkDatabase() {
  try {
    console.log('Checking database tables...');
    
    // Check if staff table exists
    const [tables] = await db.query('SHOW TABLES LIKE "staff"');
    
    if (tables.length === 0) {
      console.log('Staff table does not exist. Creating it...');
      
      // Create staff table
      await db.query(`
        CREATE TABLE IF NOT EXISTS staff (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_staff_name (name),
          INDEX idx_staff_email (email)
        )
      `);
      
      console.log('Staff table created successfully!');
    } else {
      console.log('Staff table already exists.');
    }
    
    // Check if visitors table exists
    const [visitorTables] = await db.query('SHOW TABLES LIKE "visitors"');
    
    if (visitorTables.length === 0) {
      console.log('Visitors table does not exist. Creating it...');
      
      // Create visitors table
      await db.query(`
        CREATE TABLE IF NOT EXISTS visitors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          photo_path VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_name (name)
        )
      `);
      
      console.log('Visitors table created successfully!');
    } else {
      console.log('Visitors table already exists.');
    }
    
    // Check if visits table exists
    const [visitTables] = await db.query('SHOW TABLES LIKE "visits"');
    
    if (visitTables.length === 0) {
      console.log('Visits table does not exist. Creating it...');
      
      // Create visits table
      await db.query(`
        CREATE TABLE IF NOT EXISTS visits (
          id INT AUTO_INCREMENT PRIMARY KEY,
          visitor_id INT NOT NULL,
          staff_email VARCHAR(100) NOT NULL,
          reason TEXT NOT NULL,
          status ENUM('pending', 'allowed', 'denied') DEFAULT 'pending',
          check_in_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          check_out_time DATETIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (visitor_id) REFERENCES visitors(id),
          INDEX idx_staff_email (staff_email),
          INDEX idx_status (status),
          INDEX idx_check_in_time (check_in_time)
        )
      `);
      
      console.log('Visits table created successfully!');
    } else {
      console.log('Visits table already exists.');
    }
    
    // Apply schema changes for visitor types
    console.log('Checking for visitor type schema changes...');

    const connection = db;

    // Check for company_name and company_address in visitors
    const [companyCols] = await connection.query("SHOW COLUMNS FROM visitors LIKE 'company_name'");
    if (companyCols.length === 0) {
        console.log('Adding company_name and company_address to visitors table...');
        await connection.query(
            `ALTER TABLE visitors
             ADD COLUMN company_name VARCHAR(255) NULL,
             ADD COLUMN company_address VARCHAR(255) NULL`
        );
        console.log('Columns added to visitors.');
    }

    // Check for visitor_type in visits
    const [visitorTypeCol] = await connection.query("SHOW COLUMNS FROM visits LIKE 'visitor_type'");
    if (visitorTypeCol.length === 0) {
        console.log('Adding visitor_type to visits table...');
        await connection.query(
            `ALTER TABLE visits
             ADD COLUMN visitor_type ENUM('visitor', 'contractor', 'supplier') NOT NULL DEFAULT 'visitor'`
        );
        console.log('Column added to visits.');
    }

    // Check for contractor_visit_details table
    const [contractorTable] = await connection.query("SHOW TABLES LIKE 'contractor_visit_details'");
    if (contractorTable.length === 0) {
        console.log('Creating contractor_visit_details table...');
        await connection.query(`
            CREATE TABLE contractor_visit_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                visit_id INT NOT NULL,
                work_site VARCHAR(255),
                project_detail TEXT,
                supervising_department VARCHAR(255),
                FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
            )
        `);
        console.log('contractor_visit_details table created.');
    }

    // Check for supplier_visit_details table
    const [supplierTable] = await connection.query("SHOW TABLES LIKE 'supplier_visit_details'");
    if (supplierTable.length === 0) {
        console.log('Creating supplier_visit_details table...');
        await connection.query(`
            CREATE TABLE supplier_visit_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                visit_id INT NOT NULL,
                material_supplied VARCHAR(255),
                receiving_department VARCHAR(255),
                FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE
            )
        `);
        console.log('supplier_visit_details table created.');
    }
    
    // Test query to staff table
    const [staff] = await db.query('SELECT COUNT(*) as count FROM staff');
    console.log(`Staff table has ${staff[0].count} records.`);
    
    console.log('Database check completed successfully!');
    
  } catch (error) {
    console.error('Database check failed:', error);
  } finally {
    db.end();
  }
}

checkDatabase(); 