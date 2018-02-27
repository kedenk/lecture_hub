CREATE TABLE student(
   studentID  SERIAL PRIMARY KEY,
   username TEXT NOT NULL
);

CREATE TABLE lecture(
   lectureID  SERIAL PRIMARY KEY,
   lectureName TEXT NOT NULL,
   lectureDescription TEXT
);

CREATE TABLE question(
   questionID  SERIAL PRIMARY KEY,
   lecture INT REFERENCES lecture (lectureID),
   author INT REFERENCES student (studentID),
   textContent TEXT NOT NULL
);

CREATE TABLE answer(
   answerID  SERIAL PRIMARY KEY,
   author INT REFERENCES student (studentID),
   answerTo INT REFERENCES question (questionID) DEFAULT NULL,
   textContent TEXT NOT NULL
);

CREATE TABLE mood_for_student_lecture(
	studentID INT REFERENCES student (studentID) NOT NULL,
	lectureID INT REFERENCES lecture (lectureID) NOT NULL,
	mood INT DEFAULT 0,
	PRIMARY KEY (studentID, lectureID)
);

CREATE TABLE vote_for_question(
   voteQuestionID  SERIAL PRIMARY KEY,
   voteFor INT REFERENCES question (questionID) NOT NULL,
   votedBy INT REFERENCES student (studentID) NOT NULL,
   direction INT DEFAULT 1
);

CREATE TABLE vote_for_answer(
   voteAnswerID  SERIAL PRIMARY KEY,
   voteFor INT REFERENCES answer (answerID) NOT NULL,
   votedBy INT REFERENCES student (studentID) NOT NULL,
   direction INT DEFAULT 1
);

INSERT INTO lecture (lectureName, lectureDescription) VALUES  
('Web Development Course', 'This course teaches the basics of web development (frontend and backend).'),
('Design and Evaluation of Ubiquitous Technology in Sports', 'In this seminar we will go beyond existing approaches and aim to design interactive sports experiences that rely on all sorts of wearable technologies such as smart watches and fitness trackers.'),
('Making Virtual and Augmented Reality great again!','In this seminar, small projects will be conducted within the field of Mixed Reality (VR/AR) applications.');