use studentdev;

CREATE TABLE semester_1 (
    rollno INT,
    ds_marks INT CHECK (ds_marks >= 0 AND ds_marks <= 100),
    cao_marks INT CHECK (cao_marks >= 0 AND cao_marks <= 100),
    programming_marks INT CHECK (programming_marks >= 0 AND programming_marks <= 100),
    dms_marks INT CHECK (dms_marks >= 0 AND dms_marks <= 100),
    os_marks INT CHECK (os_marks >= 0 AND os_marks <= 100)
);


INSERT INTO semester_1 (rollno, ds_marks, cao_marks, programming_marks, dms_marks, os_marks)
VALUES
(101, 85, 78, 92, 88, 76),
(102, 90, 84, 87, 79, 95),
(103, 72, 68, 75, 80, 82),
(104, 88, 91, 90, 86, 84),
(105, 95, 89, 88, 91, 90),
(106, 80, 76, 85, 82, 78),
(107, 70, 75, 72, 74, 71),
(108, 92, 95, 94, 93, 90),
(109, 84, 82, 81, 78, 83),
(110, 87, 88, 85, 89, 91);

select * from semester_1;
SET SQL_SAFE_UPDATES = 0;

delete from semester_1 where rollno=212;

