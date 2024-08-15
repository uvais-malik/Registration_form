
const express = require("express"); // Express framework to simplify app development
const mongoose = require("mongoose"); // Mongoose library to interact with MongoDB easily
const bodyParser = require("body-parser"); // Body-parser to handle incoming data from clients
const dotenv = require("dotenv"); // Dotenv to manage environment variables securely

const app = express(); // Create an Express application
dotenv.config(); 

const port = process.env.PORT || 3000;
const password = process.env.MONGO_password; // Get MongoDB password and username from env
const username = process.env.MONGO_username;

// Connect to MongoDB database using Mongoose
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ikxe5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
});

// Define a schema for the registration data
const registrationSchema = new mongoose.Schema({
    name: String, // User's name
    email: String, // User's email address
    password: String // User's password
});

// Create a model from the schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve the registration form
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

// Route to handle form submission
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body; // Extract data from the request body

        // Check if a user with the same email already exists
        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            // If no user found, create a new registration
            const registrationData = new Registration({
                name,
                email,
                password,
            });
            await registrationData.save(); // Save the new user data to the database
            res.redirect("/success"); // Redirect to success page
        } else {
            // If user already exists, redirect to error page
            // Note: alert() is not supported in server-side code, so we'll just redirect to error page
            res.redirect("/error"); // Redirect to error page
        }
    } catch (error) {
        console.log(error); // Log any errors that occur
        res.redirect("/error"); // Redirect to error page
    }
});

// Route to serve the success page
app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

// Route to serve the error page
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // Log a message to the console
});
