// TODO --- replace `TestData` with prod database (TAMID member cards)
// TODO --- update CORS policy
// TODO --- add OAuth middleware functionality 
import dotenv from "dotenv";
import http from "http";
import { 
    Client, 
    isFullPage, 
} from "@notionhq/client";

// The host address of this server
const HOST = "localhost";
// The port associated with this server
const PORT = 8000;

// Defines the shape of an entry in the database
interface TestData {
    name: string;
    info: string;
}

// Load environment variables from `.env` file into `process.env`
dotenv.config();
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const notionApiKey = process.env.NOTION_API_KEY;

// Provide an error to users who forget to create the .env file
// with the appropriate Notion keys 
if (!notionDatabaseId || !notionApiKey) {
    throw Error("Must define NOTION_SECRET and NOTION_DATABASE_ID in env");
}

// Initialize the Notion client with the internal integration token
const notion = new Client({
    auth: notionApiKey,
});

// Launch an instance of the server
try {
    // Initialize the server with an async function to handle incoming 
    // HTTP messages, outgoing HTTP server responses, and DB query await
    const server = http.createServer(async (req, res) => {
        // Avoid CORS issues (!! TODO FIX FOR PROD !!)
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log(res.getHeaders())
        switch (req.url) {
            // Request URL is root domain 
            case "/":
                console.log('Retrieving database...')
                // Query the database and wait for the result
                const response = await notion.databases.query({
                    database_id: notionDatabaseId
                });
                
                // Build the response list based on the Notion response
                const list: TestData[] = response.results.map((row) => {
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

                // Content return type (JSON)
                res.setHeader("Content-Type", "application/json");
                // Status 200 OK
                res.writeHead(200);
                res.end(JSON.stringify(list));
                break;
            
            // Request URL is NOT root domain 
            default:
                // Content return type (JSON) 
                res.setHeader("Content-Type", "application/json");
                // Status 404 NOT FOUND
                res.writeHead(404);
                res.end(JSON.stringify({ error: "Resource not found" }));
        }
    });

    // Start the server instance on `host`:`port` and listen for connections
    server.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    });

} catch (error: unknown) {
    // Catch any server-side errors
    console.error(error)
}
