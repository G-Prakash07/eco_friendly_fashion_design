// Import express.js
const express = require("express");
const { User } = require("./models/user");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');


const cookieParser = require("cookie-parser");
const session = require('express-session');
app.use(cookieParser());
// app.get('/', async (req, res) => {
//     try {
//         const items = await db.getAllItems();
//         res.json(items);
//         res.render('dashboard',{"items":items})
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const oneDay = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
});
app.use(sessionMiddleware);

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.loggedIn   = !!req.session.loggedIn;
    next();
  });



app.get('/login', function (req, res) {
    res.render('authentication');
});


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

app.get("/about", function(req, res) {
    res.render("about");
});
app.get("/contact", function(req, res) {
    res.render("contact");
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        var user = new User(email);
        const uId = await user.getIdFromEmail();
        if (!uId) {
            return res.status(401).send('Invalid email');
        }

        const match = await user.authenticate(password);
        if (!match) {
            return res.status(401).send('Invalid password');
        }

        req.session.uid = uId;
        req.session.loggedIn = true;
        console.log(req.session.id);
        res.redirect('/shop');
    } catch (err) {
        console.error(`Error while authenticating user:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get("/login", function (req, res) {
    try {
        if (req.session.uid) {
            res.redirect('/');
        } else {
            res.render('login');
        }
        res.end();
    } catch (err) {
        console.error("Error accessing root route:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Registration handler
app.post('/register', async (req, res) => {
    const { email, password, username, name, address, contact } = req.body;
    if (!email || !password || !username || !name || !address || !contact) {
      return res.status(400).send('All fields are required.');
    }
  
    const user = new User(email, username, name, address, contact);
    try {
      if (await user.getIdFromEmail()) {
        return res.status(409).send('Email already registered.');
      }
      await user.addUser(password);
      req.session.uid = user.id;
      req.session.loggedIn = true;
      res.redirect('/');
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).send('Internal Server Error');
    }
  });
  


app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-student page
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.send('Password set successfully');
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            res.send('Perhaps a page where a new user sets a programme would be good here');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Show the donate form
app.get('/donate', async (req, res) => {
    try {
      // pull available items to populate the dropdown
      const items = await db.query("SELECT item_id, title, `condition` FROM fashion_items");
      res.render('donate', { items });
    } catch (err) {
      console.error("Error loading donate page:", err);
      res.status(500).send("Error loading donation form.");
    }
  });
  
  // Handle donation submissions
  app.post('/donate', async (req, res) => {
    try {
      const { name, email, item_id, quantity } = req.body;
      // if you track users by session:
      const user_id = req.session.uid || null;
  
      // Basic validation
      if ((!user_id && (!name || !email)) || !item_id || !quantity) {
        return res.status(400).send("All fields are required.");
      }
  
      // If you want to record name/email for anonymous donors,
      // you could have expanded the donations table or log them elsewhere.
      // Here we'll just tie to the user if logged in.
      const sql = `
        INSERT INTO donations (user_id, item_id, quantity)
        VALUES (?, ?, ?)
      `;
      await db.query(sql, [user_id, item_id, quantity]);
  
      res.send("Thanks for donating! We'll be in touch about pickup.");
    } catch (err) {
      console.error("Error processing donation:", err);
      res.status(500).send("Could not process your donation.");
    }
  });
  

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
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