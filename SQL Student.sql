Create Database StudentDev;

use StudentDev;

CREATE TABLE student (
    rollno INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    attendance INT NOT NULL,
    pass INT(4) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL
);

INSERT INTO student (rollno, name, class, department, attendance, pass, email, phone)
VALUES
(101, 'Aarav Sharma', 'SE', 'CSE', 85, 1234, 'aarav.sharma@example.com', '9876543210'),
(102, 'Isha Patel', 'SE', 'CSE', 90, 5678, 'isha.patel@example.com', '9123456789'),
(103, 'Rohit Mehta', 'SE', 'CSE', 78, 3456, 'rohit.mehta@example.com', '9988776655'),
(104, 'Nisha Singh', 'SE', 'CSE', 88, 6789, 'nisha.singh@example.com', '9865432109'),
(105, 'Kabir Khanna', 'SE', 'CSE', 92, 4321, 'kabir.khanna@example.com', '9876677888'),
(106, 'Ananya Iyer', 'SE', 'CSE', 80, 5672, 'ananya.iyer@example.com', '8999988877'),
(107, 'Rajesh Nair', 'SE', 'CSE', 76, 4324, 'rajesh.nair@example.com', '9123344556'),
(108, 'Mira Desai', 'SE', 'CSE', 94, 6781, 'mira.desai@example.com', '9556677889'),
(109, 'Vikram Rao', 'SE', 'CSE', 82, 1239, 'vikram.rao@example.com', '9765432101'),
(110, 'Sneha Kapoor', 'SE', 'CSE', 87, 9876, 'sneha.kapoor@example.com', '9678987654');

Insert into student values (111, 'Subodh jadhav', 'SE', 'CSE', 1, 9292, 'subodh@gmail.com', '9323939293');
Delete from student where rollno = 111;
SELECT avg(attendance) As attendance From student;

