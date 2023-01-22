// Important notes:
// Updated node-oauth to 0.10.0 due to intermittent InternalOAuthErrors
// Updated node to 19.4.0 due to intermittent InternalOAuthErrors
// Ensure that requests make to the backend via axios include credentials!

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import {
    Client,
    isFullPage,
} from "@notionhq/client";
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

const GoogleStrategy = require('passport-google-oauth20').Strategy;

// ============================= Types =============================

// Defines the shape of an entry in the database
interface IEntry {
    name: string;
    info: string;
}

// ============================= Setup =============================

// The host address of this server 
const HOST = 'localhost';
// The port associated with this server
const PORT = 4000;
// The accepted CORS origin (React application)
const CORS_ORIGIN = 'http://localhost:5173';

// Load environment variables from `.env` file into `process.env`
dotenv.config();
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_SECRET = process.env.NOTION_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Provide an error to users who forget to create the .env file
// with the appropriate Notion keys 
if (!NOTION_DATABASE_ID || !NOTION_SECRET || 
    !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw Error("Must define secret keys in .env");
}

// Initialize express app object
const app = express();

// Initialize the Notion client with the internal integration token
const notion = new Client({
    auth: NOTION_SECRET,
});

// ============================= Middleware =============================

// Only parse JSON
app.use(express.json())
// Setup CORS policy
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
}));

// Init express session 
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // if true, https must be enabled 
            maxAge: 900000 // (in milliseconds) 15 minutes
        }
    })
);
// Init passport 
app.use(passport.initialize());
app.use(passport.session());

// Every time a user gets put into the session, serialize the user 
// (i.e. serialize the session information)
// RIGHT NOW JUST SERIALIZING ENTIRE USER OBJECT (would typically use user.id, but
// we don't really care about retriving the authenticated user data from Notion DB)
passport.serializeUser((user: any, done) => {
    return done(null, user);
});

// When the client makes requests to backend, it can see our session ID, and 
// get our information, from the session and run the `deserializeUser` function
passport.deserializeUser((id, done) => {
    return done(null, id);
});

// Passport Google OAuth 2.0 strategy config
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},  // Called on successful authentication
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
        // Check if user exists in Notion DB before proceeding
        const userEmail = profile.emails[0].value;
        console.log(`Authenticated: ${userEmail}`);
        checkIfUserExists(userEmail).then(([exists, err]) => {
            if (err) { 
                // If `checkIfUserExists` catches an error
                console.log(`Authentication error: ${err}`)
                return done(err); // error
            } 
            if (!exists) {
                // If user does not exist in Notion DB, the verify function 
                // calls the callback with false to indicate an authentication failure
                console.log(`Not found: ${userEmail} ... Authentican failure.`)
                return done(null, false); // failure
            }
            // Otherwise, user was successfully authenticated with Google 
            // OAuth 2.0 and exists in the Notion DB 
            console.log(`Found: ${userEmail} ... Login successful!`)
            return done(null, profile) // success
        })
    }
));

// Request GET `/auth/google` --> run the passport authentication strategy
// (Note: scope indicates how much data to provide to the backend; 
// in this case, email info)
app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

// Request GET `/auth/google/callback` on successful authentication -->
// if failure, try again, otherwise redirect home
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    function (req, res) {
        // Successful authentication, redirect to members page.
        res.redirect('http://localhost:5173/members');
    }
);

// Default route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get members endpoint
app.get('/getmembers', async (req, res) => {
    ensureAuthenticated(req, res, () => {
        // Fetch members
        retrieveDatabase().then((members) => {
            res.send(JSON.stringify(members));
            console.log('Success!');
        })
    });
});

// Get user endpoint (req.user has all user information)
app.get('/getuser', (req, res) => {
    console.log(`GET session user: ${req.session ? req.session.id : undefined}`)
    res.send(req.user);
});

// Logout endpoint
app.get('/logout', (req, res, next) => {
    console.log(`Logging out session: ${req.session ? req.session.id : undefined}`)
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).send('done');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

// TODO update to work with TAMID Notion DB
async function checkIfUserExists(userEmail: string): Promise<[boolean, any]> {
    console.log(`Looking up user: ${userEmail}`);
    if (userEmail === '' || userEmail === null) {
        console.log('User email cannot be empty or null.');
        return Promise.resolve([false, null]);
    }

    // Init response and error
    let response: QueryDatabaseResponse = null;
    let error: any = null;

    // Query the database with a custom filter that checks if the `name` 
    // property equals the provided `userEmail`
    try {
        response = await notion.databases.query({
            database_id: NOTION_DATABASE_ID,
            filter: {
                property: 'name',
                rich_text: {
                    equals: userEmail,
                }
            }
        });
    } catch (err: any) {
        error = err;
    }
    return [response.results.length > 0, error];
}

async function ensureAuthenticated(req: any, res: any, next: any) {
    const email = req.user ? req.user.emails[0].value : null
    checkIfUserExists(email).then(([exists, err]) => {
        if (exists && req.isAuthenticated()) {
            console.log(`${email} is authenticated ... proceeding`)
            next();
        }
        else {
            console.log(`${email} is not authenticated ... STATUS: 401`)
            res.status(401).send('Unauthorized');
        }
    });
}

async function retrieveDatabase() {
    console.log('Retrieving database...')
    // Query the database and wait for the result
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID
    });

    // Build the response list based on the Notion response
    const list: IEntry[] = response.results.map((row) => {
        // If row is a `PartialPageObjectResponse`, return data 
        // in the expected shape but with a PARTIAL_PAGE label
        if (!isFullPage(row)) {
            return { name: "PARTIAL_PAGE", info: "" };
        }
        // Database entries
        const nameCell = row.properties.name
        const infoCell = row.properties.info
        // Entry type rules
        const isName = nameCell.type === "title"
        const isInfo = infoCell.type === "rich_text"
        // Return valid data in the expected shape
        if (isName && isInfo) {
            const name = nameCell.title.length ? nameCell.title?.[0].plain_text : '';
            const info = infoCell.rich_text.length ? infoCell.rich_text?.[0].plain_text : '';
            return { name, info };
        }
        // If a row is found that does not match the type rules, 
        // it will still return data in the expected shape but 
        // with a NOT_FOUND label
        return { name: "NOT_FOUND", info: "" };
    });

    // Log response data
    console.log(list)

    return list;
}