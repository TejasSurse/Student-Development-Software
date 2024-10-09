use studentdev;


CREATE TABLE faculty (
    faculty_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    password INT(4) NOT NULL CHECK (password BETWEEN 1000 AND 9999),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
);


INSERT INTO faculty (faculty_id, name, department, password, email, phone)
VALUES
(1, 'Dr. Ramesh Kumar', 'CSE', 1234, 'ramesh.kumar@example.com', '9876543210'),
(2, 'Prof. Sita Verma', 'CSE', 2345, 'sita.verma@example.com', '9123456789'),
(3, 'Mr. Anil Mehta', 'CSE', 3456, 'anil.mehta@example.com', '9988776655'),
(4, 'Ms. Neha Singh', 'CSE', 4567, 'neha.singh@example.com', '9865432109'),
(5, 'Dr. Priya Gupta', 'CSE', 5678, 'priya.gupta@example.com', '9876677888'),
(6, 'Mr. Amit Patel', 'CSE', 6789, 'amit.patel@example.com', '8999988877'),
(7, 'Ms. Kavita Nair', 'CSE', 7890, 'kavita.nair@example.com', '9123344556'),
(8, 'Prof. Rajesh Iyer', 'CSE', 8901, 'rajesh.iyer@example.com', '9556677889'),
(9, 'Mr. Sanjay Rao', 'CSE', 9012, 'sanjay.rao@example.com', '9765432101'),
(10, 'Ms. Pooja Kapoor', 'CSE', 1011, 'pooja.kapoor@example.com', '9678987654');

select * from faculty;
