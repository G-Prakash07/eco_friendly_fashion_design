// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');
// Create a route for root - /
app.get("/", function(req, res) {
    res.render("home");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// API endpoint to fetch fashion items with filters
app.get("/shop", function(req, res) {
    // Extract query parameters for filtering
    const minPrice = req.query.minPrice || 0;  // Default to 0 if not provided
    const maxPrice = req.query.maxPrice || 99999;  // Default to a high value if not provided
    const category = req.query.category || null;  // Category filter (if any)
    const condition = req.query.condition || null;  // Condition filter (if any)

    // Base SQL query
    let sql = "SELECT * FROM fashion_items WHERE price BETWEEN ? AND ?";
    let params = [minPrice, maxPrice];

    // Add category filter if provided
    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    // Add condition filter if provided
    if (condition) {
        sql += " AND `condition` = ?";  // Escape 'condition' with backticks
        params.push(condition);
    }

    // Execute the query with the parameters
    db.query(sql, params)
        .then(results => {
            // Render the results to the 'shop' template
            res.render("shop", { results });
        })
        .catch(error => {
            console.error("Database error:", error);
            res.status(500).send("Error fetching fashion items.");
        });
});

app.get("/shop/:id", function(req, res) {
    const itemId = req.params.id;
    const sql = "SELECT * FROM fashion_items WHERE item_id = ?";
    
    db.query(sql, [itemId]).then(results => {
        if (results.length > 0) {
            res.render("shop_details", { item: results[0] });
        } else {
            res.status(404).send("Item not found.");
        }
    }).catch(error => {
        console.error("Database error:", error);
        res.status(500).send("Error fetching item details.");
    });
});


// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});