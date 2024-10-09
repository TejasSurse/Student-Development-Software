const { __express } = require("ejs");
const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const { createConnection } = require("net");


// EJS Setup
app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "/Views"));

// by default only get and post request are handeled by using this express  method can handle  all the request

app.get("/", (req, res)=>{
    res.render("login.ejs");
})
app.use(methodOverride("_method"));
// Handeling body data 
app.use(express.urlencoded({extended: true}));

// Set the template engine to EJS and use ejsMate as the engine
// ejsMate is a template engine that allows us to use EJS templates with Express.js
app.engine('ejs', ejsMate);

// Serve static files from the 'public' directory
// This allows us to serve files such as images, CSS, and JavaScript files directly
// without having to create a route for each file
app.use(express.static(path.join(__dirname, "/public")));


app.listen(8080, ()=>{
    console.log("Server listening in http://localhost:8080/login");
});


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'studentdev'
});

app.get("/login", (req, res)=>{
    res.render("login.ejs");
});

app.post("/login", (req, res) => {
    const { username, password, role } = req.body;

    // Log the incoming request data to verify
    console.log(`Login attempt: username=${username}, role=${role}`);

    // Determine table and column based on the role
    let table = role === 'student' ? 'student' : 'faculty';
    let idColumn = role === 'student' ? 'rollno' : 'faculty_id';
    let passwordColumn = role === 'student' ? 'pass' : 'password'; // Determine password column

    // Ensure the required fields are provided
    if (!username || !password || !role) {
        return res.status(400).send('Please provide username, password, and role');
    }

    const query = `SELECT * FROM ${table} WHERE ${idColumn} = ?`;

    // Execute the query to find the user
    conn.query(query, [username], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            return res.status(500).render("errorstudent.ejs", {errmessage : "Internal server error"});
        }

        // If no user is found
        if (results.length === 0) {
            console.log('User not found');
            return res.status(401).render("errorstudent.ejs", {errmessage : "Invalid UserName and Password"});
        }

        const user = results[0];
        console.log(user);
        console.log(password);

        // Check if the password matches based on the role
        if (password == user[passwordColumn]) { // Use dynamic password column
            console.log('Login successful');

            // Render the appropriate page based on the role
            if (role === 'student') {
                return res.render('studenthome', { user });  // Pass user data to the studenthome view
            } else {
                return res.redirect('/home');  // Pass user data to the home view (faculty)
            }
        } else {
            console.log('Invalid password');
            return res.status(401).render("errorstudent.ejs", {errmessage : "Invalid UserName and Password"});
        }
    });
});

app.get("/logout", (req, res)=>{
    res.render("login.ejs");
})

app.get("/home", (req, res) => {
    let studentCount, resultCount, attendance;

    conn.query("SELECT count(*) As scount FROM student", (err, data) => {
        if (err) {
            res.render("error.ejs", {errmessage : "Something went wrong"});
        } else {
            studentCount = data[0].scount;
        }
    });

    conn.query("SELECT count(*) As rcount FROM semester_1", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            resultCount = data[0].rcount;    
        }
    });

    conn.query("SELECT avg(attendance) As attendance From student", (err, data)=>{
        if(err){
            console.log("error");
        }else{
            attendance = data[0].attendance;
          
           res.render("home.ejs", {scount : studentCount, rcount : resultCount, att : attendance});
        }
    });
});

app.get("/students", (req, res)=>{
    conn.query("SELECT * FROM student", (err, data)=>{
        if(err) {
            res.render("error.ejs", {errmessage : "Something went wrong"});
        }else{
            console.log(data);
            res.render("students.ejs",{data : data});
        }
    });
});

app.get("/results", (req, res)=>{
    conn.query("SELECT * FROM semester_1", (err, data)=>{
        if(err){
            console.log(err);
        }else{

           res.render("results.ejs", {result : data});
        }
    });
});
// this is for student and faculty 

// get student profile by roll
app.get("/students/:rollno", (req, res)=>{
    let {rollno} = req.params;
    conn.query(`SELECT * FROM student where rollno = ${rollno}`, (err, data)=>{
        if(err){
            console.log(err);
        }else{
            res.render("show.ejs", {data : data[0]});
        }
    });
});
// get result by roll 
app.get("/result/:rollno", (req, res) => {
    let { rollno } = req.params;
    conn.query(`SELECT * FROM semester_1 WHERE rollno = ${rollno}`, (err, resultData) => {
        if (err) {
            console.log(err);
            return res.send(err.message);
        }
     
        conn.query(`SELECT name, class, department FROM student WHERE rollno = ${rollno}`, (err, studentData) => {
            if (err) {
                console.log(err);
                return res.send(err.message);
            }

            // Combine the results into one object
            const combinedResult = {
                result: resultData[0],     
                student: studentData[0]   
            };

            // Log the combined result object
           

            res.render("showresult.ejs", { data: combinedResult });
        });
    });
});
app.get("/myresult/:rollno", (req, res) => {
    let { rollno } = req.params;
    conn.query(`SELECT * FROM semester_1 WHERE rollno = ${rollno}`, (err, resultData) => {
        if (err) {
            console.log(err);
            return res.render("errorstudent.ejs", {errmessage : err.message});
        }
     
        conn.query(`SELECT name, class, department FROM student WHERE rollno = ${rollno}`, (err, studentData) => {
            if (err) {
                console.log(err);
                return res.send(err.message);
            }
            if(!resultData[0]){
                res.render("errorstudent.ejs", {errmessage : "Your result is not availabel"});
            }
            // Combine the results into one object
            const combinedResult = {
                result: resultData[0],     
                student: studentData[0]   
            };

            // Log the combined result object
           

            res.render("showmyresult.ejs", { data: combinedResult });
        });
    });
});
// student's feedback 
app.get("/feedbacks/:rollno", (req, res) => {
    let { rollno } = req.params;

    conn.query(`SELECT * FROM feedback WHERE rollno = ${rollno}`, (err, result) => {
        if (err) {
            console.error("Error fetching feedbacks:", err);
            return res.status(500).send("Internal server error");
        }

        // Check if there are no feedbacks for the given roll number
        if (result.length === 0) {
            console.log(`No feedbacks found for roll number ${rollno}`);
            return res.status(404).send("No feedbacks available for this student.");
        }

        // If feedbacks exist, render the feedbacks page
        res.render('viewfeedback.ejs', { feedbacks: result });
    });
});
app.get("/feedback/:rollno", (req, res) => {
    const { rollno } = req.params;
    res.render("feedbackform", { rollno });  // Pass roll number to the view
});
app.post("/submit-feedback", (req, res) => {
    console.log("this route executed ");
    const { rollno, subject, message } = req.body;

    // Basic validation
    if (!rollno || !subject || !message) {
        return res.status(400).send("All fields are required.");
    }

    // SQL query to insert the feedback
    const query = "INSERT INTO feedback (rollno, subject, message) VALUES (?, ?, ?)";

    // Execute the query
    conn.query(query, [rollno, subject, message], (err, result) => {
        if (err) {
            console.error("Error inserting feedback:", err);
            return res.status(500).send("Internal server error");
        }

        // Redirect or send success response
        res.redirect("/home");
        // Alternatively, you can redirect to another page
        // res.redirect('/feedbacks/' + rollno);
    });
});
// new Page 
app.get("/new", (req, res)=>{
    res.render("new.ejs");
}); 
// new Student -- Create route 
app.post("/home", (req, res) => {
    // Destructure the data from the request body
    let { rollno, name, email, pass, class: className, department, attendance, phone } = req.body;
    
    // SQL query to insert the data into the student table
    const sql = `INSERT INTO student (rollno, name, email, pass, class, department, attendance, phone) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Values to be inserted from req.body
    const values = [rollno, name, email, pass, className, department, attendance, phone];

    // Execute the query
    conn.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error inserting student data");
        }
        res.redirect("/home");
    });
});

app.get("/newresult", (req, res)=>{
    res.render("newresult.ejs");
});

app.post("/results", (req, res) => {
    const { rollno, ds_marks, cao_marks, programming_marks, dms_marks, os_marks } = req.body;

    // Check if the student exists
    const checkStudentQuery = `SELECT * FROM student WHERE rollno = ?`;

    conn.query(checkStudentQuery, [rollno], (err, studentData) => {
        if (err) {
            console.error("Error fetching student data: ", err);
            return res.status(500).send("Server error");
        }

        // If no student is found with the provided roll number
        if (studentData.length === 0) {
            return res.status(400).render("error.ejs", {errmessage : `Error: No student found with roll number ${rollno}.`});
        }

        // If student exists, proceed with inserting the result
        const insertQuery = `
            INSERT INTO semester_1 (rollno, ds_marks, cao_marks, programming_marks, dms_marks, os_marks) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        conn.query(insertQuery, [rollno, ds_marks, cao_marks, programming_marks, dms_marks, os_marks], (err, result) => {
            if (err) {
                console.error("Error inserting result data: ", err);
                return res.status(500).send("Server error");
            }

            // Redirect to the results page after successful insertion
            res.redirect("/results");
        });
    });
});

// Edit Student 

app.get("/editstudent/:rollno", (req, res) => {
    const rollno = req.params.rollno;
    conn.query("SELECT * FROM student WHERE rollno = ?", [rollno], (err, studentData) => {
        if (err) {
            return res.status(404).send("Student Not Found");
        }
        res.render("editstudent.ejs", { student: studentData[0] }); // Pass student data to EJS
    });
});
// Edit Student 
app.patch("/students/:rollno", (req, res) => {
    const rollno = req.params.rollno;
    const { name, class: studentClass, department, attendance, pass, email, phone } = req.body;

    const updateQuery = `
        UPDATE student 
        SET name = ?, class = ?, department = ?, attendance = ?, pass = ?, email = ?, phone = ? 
        WHERE rollno = ?
    `;

    conn.query(updateQuery, [name, studentClass, department, attendance, pass, email, phone, rollno], (err, result) => {
        if (err) {
            console.error("Error updating student data:", err);
            return res.status(500).send("Server Error");
        }

        res.redirect(`/students/${rollno}`);
    });
});

// app - delete route of student 
app.get("/student/delete/:rollno", (req, res) => {
    const rollno = req.params.rollno;

    // Define queries to delete student and associated results
    const deleteStudentQuery = "DELETE FROM student WHERE rollno = ?";
    const deleteResultQuery = "DELETE FROM semester_1 WHERE rollno = ?";

    // Execute both queries in sequence
    conn.query(deleteResultQuery, [rollno], (err, result) => {
        if (err) {
            console.error("Error deleting student's result:", err);
            return res.status(500).send("Server error");
        }

        // If the results were deleted successfully, now delete the student
        conn.query(deleteStudentQuery, [rollno], (err, result) => {
            if (err) {
                console.error("Error deleting student:", err);
                return res.status(500).send("Server error");
            }

            // Redirect after both deletions
            res.redirect("/students");
        });
    });
});

// EDIT Result 
app.get("/editresult/:rollno", (req, res) => {
    const rollno = req.params.rollno;

    // SQL query to get the result for the student
    const resultQuery = "SELECT * FROM semester_1 WHERE rollno = ?";

    // Fetch result information for the student
    conn.query(resultQuery, [rollno], (err, resultData) => {
        if (err) {
            console.error("Error fetching result data:", err);
            return res.status(500).send("Server error");
        }

        if (resultData.length > 0) {
            // Render the editresult.ejs view and pass the result data
            res.render("editresult.ejs", {
                result: resultData[0] // Pass the first element (result details)
            });
        } else {
            res.status(404).send("Result not found");
        }
    });
});

//edit result patch
app.patch("/results/:rollno", (req, res) => {
    const rollno = req.params.rollno;
    const { ds_marks, cao_marks, programming_marks, dms_marks, os_marks } = req.body;

    // SQL query to update the result for the student
    const updateQuery = `
        UPDATE semester_1 
        SET 
            ds_marks = ?, 
            cao_marks = ?, 
            programming_marks = ?, 
            dms_marks = ?, 
            os_marks = ? 
        WHERE rollno = ?`;

    // Execute the update query
    conn.query(updateQuery, [ds_marks, cao_marks, programming_marks, dms_marks, os_marks, rollno], (err, result) => {
        if (err) {
            console.error("Error updating result:", err);
            return res.status(500).send("Server error");
        }

        // Check if any row was updated
        if (result.affectedRows === 0) {
            return res.status(404).send("Result not found");
        }

        // Redirect to the results page or a specific result page
        res.redirect(`/result/${rollno}`);
    });
});


// delete result 
app.get("/delete/result/:rollno", (req, res)=>{
    const rollno = req.params.rollno;
    // SQL query to delete the result for the student
    conn.query("Delete from  semester_1 where rollno = ?", rollno, (err, result) => {
        if (err) {
            res.render("error.ejs", {errmessage : "Not Deleted Try Again "});
        }
        else{
            res.redirect("/results");
        }
})
});

app.get("/addresources", (req, res)=>{
    res.render("addmaterial.ejs");
});

app.post("/submit-resource", (req, res) => {

    const { subject, description, link, category } = req.body;

    if (!subject || !description || !link || !category) {
        return res.status(400).send("All fields are required.");
    }

    let tableName;
    if (category === "lecture") {
        tableName = "Lectures";
    } else if (category === "notes") {
        tableName = "Notes";
    } else if (category === "books") {
        tableName = "Books";
    } else {
        return res.status(400).send("Invalid category.");
    }

    const query = `INSERT INTO ${tableName} (subject, description, link) VALUES (?, ?, ?)`;
    conn.query(query, [subject, description, link], (err, result) => {
        if (err) {
            console.error("Error inserting resource:", err);
            return res.status(500).send("Internal server error");
        }
        res.redirect("/home");
    });
});


// Route to get notes
app.get("/notes", (req, res) => {
    conn.query("SELECT * FROM Notes", (err, notes) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving notes data");
        }
        if (notes.length === 0) {
            return res.render("errorstudent.ejs", { errmessage: "No notes available." }); // Render error.ejs if no notes
        }
        res.render("notes.ejs", { notes }); // Render notes.ejs with notes data
    });
});

// Route to get books
app.get("/books", (req, res) => {
    conn.query("SELECT * FROM Books", (err, books) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving books data");
        }
        if (books.length === 0) {
            return res.render("errorstudent.ejs", { errmessage: "No books available." }); // Render error.ejs if no books
        }
        res.render("books.ejs", { books }); // Render books.ejs with books data
    });
});

// Route to get lectures
app.get("/lectures", (req, res) => {
    conn.query("SELECT * FROM Lectures", (err, lectures) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error retrieving lectures data");
        }
        if (lectures.length === 0) {
            return res.render("errorstudent.ejs", { errmessage: "No lectures available." }); // Render error.ejs if no lectures
        }
        res.render("lectures.ejs", { lectures }); // Render lectures.ejs with lectures data
    });
});
