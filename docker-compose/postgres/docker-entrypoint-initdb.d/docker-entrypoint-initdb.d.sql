/***********************************************************************************************************************

   SSSSSSSSSSSSSSS                     hhhhhhh
 SS:::::::::::::::S                    h:::::h
S:::::SSSSSS::::::S                    h:::::h
S:::::S     SSSSSSS                    h:::::h
S:::::S                cccccccccccccccc h::::h hhhhh           eeeeeeeeeeee       mmmmmmm    mmmmmmm     aaaaaaaaaaaaa
S:::::S              cc:::::::::::::::c h::::hh:::::hhh      ee::::::::::::ee   mm:::::::m  m:::::::mm   a::::::::::::a
 S::::SSSS          c:::::::::::::::::c h::::::::::::::hh   e::::::eeeee:::::eem::::::::::mm::::::::::m  aaaaaaaaa:::::a
  SS::::::SSSSS    c:::::::cccccc:::::c h:::::::hhh::::::h e::::::e     e:::::em::::::::::::::::::::::m           a::::a
    SSS::::::::SS  c::::::c     ccccccc h::::::h   h::::::he:::::::eeeee::::::em:::::mmm::::::mmm:::::m    aaaaaaa:::::a
       SSSSSS::::S c:::::c              h:::::h     h:::::he:::::::::::::::::e m::::m   m::::m   m::::m  aa::::::::::::a
            S:::::Sc:::::c              h:::::h     h:::::he::::::eeeeeeeeeee  m::::m   m::::m   m::::m a::::aaaa::::::a
            S:::::Sc::::::c     ccccccc h:::::h     h:::::he:::::::e           m::::m   m::::m   m::::ma::::a    a:::::a
SSSSSSS     S:::::Sc:::::::cccccc:::::c h:::::h     h:::::he::::::::e          m::::m   m::::m   m::::ma::::a    a:::::a
S::::::SSSSSS:::::S c:::::::::::::::::c h:::::h     h:::::h e::::::::eeeeeeee  m::::m   m::::m   m::::ma:::::aaaa::::::a
S:::::::::::::::SS   cc:::::::::::::::c h:::::h     h:::::h  ee:::::::::::::e  m::::m   m::::m   m::::m a::::::::::aa:::a
 SSSSSSSSSSSSSSS       cccccccccccccccc hhhhhhh     hhhhhhh    eeeeeeeeeeeeee  mmmmmm   mmmmmm   mmmmmm  aaaaaaaaaa  aaaa

Source: https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Doh&t=Data
***********************************************************************************************************************/

-- Define table structure for teachers
CREATE TABLE TEACHER
(
    username      VARCHAR(255) PRIMARY KEY, -- Unique identifier for the teacher
    password      VARCHAR(255) NOT NULL,    -- Password for the teacher
    surname       VARCHAR(255) NOT NULL,    -- Surname of the teacher
    given_name    VARCHAR(255) NOT NULL,    -- Given name of the teacher
    email         VARCHAR(255) NOT NULL,    -- Email of the teacher
    phone         VARCHAR(255) NOT NULL,    -- Phone number of the teacher
    date_of_birth DATE         NOT NULL,    -- Date of birth of the teacher
    address       TEXT         NOT NULL,    -- Address of the teacher
    avatar        VARCHAR(255)              -- URL/path to the teacher's avatar
);

-- Define table structure for students
CREATE TABLE STUDENT
(
    username      VARCHAR(255) PRIMARY KEY, -- Unique identifier for the student
    password      VARCHAR(255) NOT NULL,    -- Password for the student
    surname       VARCHAR(255) NOT NULL,    -- Surname of the student
    given_name    VARCHAR(255) NOT NULL,    -- Given name of the student
    email         VARCHAR(255),             -- Email of the student
    phone         VARCHAR(255),             -- Phone number of the student
    date_of_birth DATE         NOT NULL,    -- Date of birth of the student
    address       TEXT         NOT NULL,    -- Address of the student
    avatar        VARCHAR(255),             -- URL/path to the student's avatar
    proficiency   INTEGER                   -- Proficiency level of the student
);

-- Define custom enumeration type for course status
CREATE TYPE COURSE_STATUS AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');
-- Define table structure for courses
CREATE TABLE COURSE
(
    id          SERIAL PRIMARY KEY,                  -- Unique identifier for the course
    level       INT          NOT NULL,               -- Level of the course
    title       VARCHAR(255) NOT NULL,               -- Title of the course
    status      COURSE_STATUS,                       -- Status of the course
    summary     VARCHAR(255),                        -- Summary of the course
    description TEXT,                                -- Detailed description of the course
    thumbnail   VARCHAR(255),                        -- URL/path to the course thumbnail
    updated_at  timestamp default current_timestamp, -- Timestamp of the last update
    CONSTRAINT unique_status_title_level UNIQUE (status, title, level)
);

CREATE TABLE TEACHER_COURSE
(
    course_id        INT          NOT NULL REFERENCES COURSE (id),        -- Reference to the id column of COURSE table
    teacher_username VARCHAR(255) NOT NULL REFERENCES TEACHER (username), -- Reference to the username column of TEACHER table
    CONSTRAINT unique_teacher_id_course_id UNIQUE (course_id, teacher_username)
);

CREATE TABLE LESSON
(
    id           SERIAL PRIMARY KEY,                 -- Unique identifier for the lesson, auto-incremented
    course_id    INTEGER REFERENCES COURSE (id),     -- Foreign key referencing the course that the lesson belongs to
    lesson_order INTEGER      NOT NULL,              -- Order of the lesson within the course, cannot be null
    title        VARCHAR(255) NOT NULL,              -- Title of the lesson, cannot be null
    audio        VARCHAR(255) NOT NULL,              -- Path to the audio file for the lesson, cannot be null
    summary      TEXT,                               -- Summary of the lesson
    description  TEXT,                               -- Description of the lesson
    thumbnail    VARCHAR(255),                       -- Path to the thumbnail image for the lesson
    content      TEXT,                               -- Content of the lesson
    updated_at   timestamp default current_timestamp,-- Timestamp of the last update
    CONSTRAINT unique_course_id_lesson_order UNIQUE (course_id, lesson_order)
);

-- Table definition for CARD
CREATE TABLE CARD
(
    id              SERIAL PRIMARY KEY,             -- Unique identifier for the card
    lesson_id       INTEGER REFERENCES LESSON (id), -- Foreign key referencing lesson
    card_order      INTEGER NOT NULL,               -- Relative order of the word in the card
    front_text      TEXT    NOT NULL,               -- Text on the front side of the card
    front_audio_uri TEXT,                           -- URI for audio associated with the front side
    CONSTRAINT unique_lesson_id_card_order UNIQUE (lesson_id, card_order)
);

-- Table definition for WORD
CREATE TABLE WORD
(
    id             SERIAL PRIMARY KEY,    -- Unique identifier for the word
    word           VARCHAR(255) NOT NULL, -- The word itself
    definition     TEXT         NOT NULL, -- Definition of the word
    phonetic       VARCHAR(255),          -- Phonetic pronunciation of the word
    part_of_speech VARCHAR(255),          -- Part of speech of the word
    audio_uri      TEXT,                  -- URI for audio associated with the word
    image_uri      TEXT                   -- URI for image associated with the word
);

-- Table definition for CARD_WORD
CREATE TABLE CARD_WORD
(
    card_id    INTEGER REFERENCES CARD (id), -- Foreign key referencing card
    word_id    INTEGER REFERENCES WORD (id), -- Foreign key referencing word
    word_order INTEGER NOT NULL,             -- Relative order of the word in the card
    PRIMARY KEY (card_id, word_id)           -- Composite primary key
);

/***********************************************************************************************************************

DDDDDDDDDDDDD                                   tttt
D::::::::::::DDD                             ttt:::t
D:::::::::::::::DD                           t:::::t
DDD:::::DDDDD:::::D                          t:::::t
  D:::::D    D:::::D   aaaaaaaaaaaaa   ttttttt:::::ttttttt      aaaaaaaaaaaaa
  D:::::D     D:::::D  a::::::::::::a  t:::::::::::::::::t      a::::::::::::a
  D:::::D     D:::::D  aaaaaaaaa:::::a t:::::::::::::::::t      aaaaaaaaa:::::a
  D:::::D     D:::::D           a::::a tttttt:::::::tttttt               a::::a
  D:::::D     D:::::D    aaaaaaa:::::a       t:::::t              aaaaaaa:::::a
  D:::::D     D:::::D  aa::::::::::::a       t:::::t            aa::::::::::::a
  D:::::D     D:::::D a::::aaaa::::::a       t:::::t           a::::aaaa::::::a
  D:::::D    D:::::D a::::a    a:::::a       t:::::t    tttttta::::a    a:::::a
DDD:::::DDDDD:::::D  a::::a    a:::::a       t::::::tttt:::::ta::::a    a:::::a
D:::::::::::::::DD   a:::::aaaa::::::a       tt::::::::::::::ta:::::aaaa::::::a
D::::::::::::DDD      a::::::::::aa:::a        tt:::::::::::tt a::::::::::aa:::a
DDDDDDDDDDDDD          aaaaaaaaaa  aaaa          ttttttttttt    aaaaaaaaaa  aaaa

Source: https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Doh&t=Schema
***********************************************************************************************************************/

-- Seed data for TEACHER table
INSERT INTO TEACHER (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
VALUES ('teacher1', 'password1', 'Garcia', 'Carlos', 'carlos.garcia@example.com', '+1112223333', '1980-07-10',
        '111 Walnut St, City, Country', 'https://example.com/avatar6.jpg'),
       ('teacher2', 'password2', 'Martinez', 'Luisa', 'luisa.martinez@example.com', '+4445556666', '1972-09-12',
        '222 Maple St, City, Country', 'https://example.com/avatar7.jpg'),
       ('teacher3', 'password3', 'Lopez', 'Maria', 'maria.lopez@example.com', '+7778889999', '1983-04-18',
        '333 Oak St, City, Country', 'https://example.com/avatar8.jpg'),
       ('teacher4', 'password4', 'Hernandez', 'Juan', 'juan.hernandez@example.com', '+1231234567', '1978-11-30',
        '444 Elm St, City, Country', 'https://example.com/avatar9.jpg'),
       ('teacher5', 'password5', 'Gonzalez', 'Ana', 'ana.gonzalez@example.com', '+9998887776', '1987-02-28',
        '555 Cedar St, City, Country', 'https://example.com/avatar10.jpg');

-- Seed data for STUDENT table
INSERT INTO STUDENT (username, password, surname, given_name, email, phone, date_of_birth, address, avatar, proficiency)
VALUES ('student1', 'password1', 'Nguyen', 'Hoa', 'hoa.nguyen@example.com', '+1122334455', '1998-03-20',
        '123 Pine St, City, Country', 'https://example.com/avatar11.jpg', 3),
       ('student2', 'password2', 'Kim', 'Sung', 'sung.kim@example.com', '+9988776655', '1997-08-15',
        '456 Oak St, City, Country', 'https://example.com/avatar12.jpg', 2),
       ('student3', 'password3', 'Chen', 'Wei', 'wei.chen@example.com', '+6655443322', '1999-05-10',
        '789 Elm St, City, Country', 'https://example.com/avatar13.jpg', 1),
       ('student4', 'password4', 'Ali', 'Fatima', 'fatima.ali@example.com', '+5544332211', '1996-12-05',
        '101 Maple St, City, Country', 'https://example.com/avatar14.jpg', 2),
       ('student5', 'password5', 'Smith', 'Jake', 'jake.smith@example.com', '+3322114455', '2000-01-30',
        '202 Walnut St, City, Country', 'https://example.com/avatar15.jpg', 3);

-- Seed data for COURSE table
INSERT INTO COURSE (status, title, level, summary, description, thumbnail)
VALUES ('PUBLISHED', 'School', 1, null, null, null),
       ('PUBLISHED', 'In the Sky', 1, null, null, null),
       ('PUBLISHED', 'Fruit', 1, null, null, null),
       ('PUBLISHED', 'Trees', 1, null, null, null),
       ('PUBLISHED', 'Young Animals', 1, null, null, null);

-- Seed data for TEACHER_COURSE table
INSERT INTO TEACHER_COURSE (course_id, teacher_username)
VALUES (1, 'teacher1'),
       (2, 'teacher1'),
       (3, 'teacher1'),
       (4, 'teacher1'),
       (5, 'teacher1'),
       (2, 'teacher2'),
       (3, 'teacher3'),
       (4, 'teacher4'),
       (5, 'teacher5');

-- Seed data for LESSON table
INSERT INTO LESSON (course_id, lesson_order, title, audio, summary, description, thumbnail, content, updated_at)
VALUES (1, 0, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp),
       (1, 1, 'Chapter 1: Let''s Go to School', 'audio/intro_sql.mp3', null, null, null,
        'All around the world, students go to school.
        Some students walk to school, and some go by bus or by train.
        Some students go by bicycle, and some go by car.
        These students are in the USA. They go to school by bus.
        In the snow in Canada, some students go to school by sled.
        In India, some students go to school by rickshaw.
        How do you go to school?',
        current_timestamp),
       (1, 2, 'Chapter 2: Buildings', 'audio/intro_sql.mp3', null, null, null,
        'Let''s look at school buildings around the world.
        This school is in Australia.
        It''s in the countryside.
        It''s a little school, but many schools in Australia are big.
        Here''s a big school in a city.
        Many students go to this school.
        It has a big school playground.
        This school is in South Korea.
        *** Discover
        For these students in Nepal, the countryside is their school!',
        current_timestamp),
       (1, 3, 'Chapter 3: At School', 'audio/intro_sql.mp3', null, null, null,
        'These students are at school.
        They meet their friends.
        They talk and they are happy.
        Listen! That''s the bell.
        Let''s go to the classroom.
        The students stand in the hallway by the door.
        The teacher says, ‘Hello, everyone’.
        These students have books and notebooks.
        Can you see them?
        No, you can''t.
        They are in their bags.
        *** Discover
        One school in China is in a cave.',
        current_timestamp),
       (1, 4, 'Chapter 4: In Class', 'audio/intro_sql.mp3', null, null, null,
        'In the classroom, the teacher says, ''Sit down, please’.
        Open your English books.
        It''s an English class.
        The teacher has a picture.
        She says, ''What''s this?''
        One student says, ''It''s a giraffe.''
        *** Discover
        Put up your hand when you want to speak in class.
        In some classes, students have computers.
        Do you have computers in your classroom?
        In physical education classes, students run, jump, and play.
        These girls play basketball in their physical education classes.',
        current_timestamp),
       (2, 0, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'Go outside and look up.
        What can you see?
        You can see the sky.
        The sky is above you.
        Look at the sky.
        Is it day or night?
        What can you see in the sky?
        ***Discover
        Now read and discover more about the sky!',
        current_timestamp),
       (2, 1, 'Chapter 01: The Sky', 'audio/intro_sql.mp3', null, null, null,
        'Look at the sky in the day.
        What color is it?
        Can you see clouds?
        When it''s sunny, the sky is blue.
        Clouds are white or gray.
        Sometimes you can see birds and planes.
        They fly in the sky.
        Sometimes when it''s sunny and rainy, you can see a rainbow in the sky.
        How many colors can you see?
        A spacecraft goes up into the sky.
        Then it goes into space.
        Space is dark and very big.',
        current_timestamp),
       (2, 2, 'Chapter 02: At Night', 'audio/intro_sql.mp3', null, null, null,
        'At night the sky is dark.
        You can see the moon.
        The moon is a big ball of rock.
        Sometimes you see a round moon.
        This is called a full moon.
        Sometimes you see different shapes.
        A thin moon is called a crescent moon.
        You can see stars at night, too.
        Stars are big, hot balls of fire.
        They look very little because they are far out in space.
        Sometimes you can see planets, too.',
        current_timestamp),
       (2, 3, 'Chapter 03: The Sun', 'audio/intro_sql.mp3', null, null, null,
        'Do you know the sun is a star?
        It''s our star.
        We live on a planet called Earth.
        Earth goes around the sun.
        The sun shines in the sky.
        It gives our planet light.
        Don''t look at the sun.
        It isn''t good for your eyes.
        The sun is very, very hot.
        It makes our planet warm so we can live here.
        ***Discover
        We get electricity from the sun!
        Light from the sun shines on solar panels.
        This makes electricity.',
        current_timestamp),
       (2, 4, 'Chapter 04: Day and Night', 'audio/intro_sql.mp3', null, null, null,
        'Sometimes it''s day and sometimes it''s night.
        That''s because Earth turns.
        When your place on Earth turns toward the sun, you see light from the sun.
        This is day.
        When your place turns away from the sun, you don''t see light from the sun.
        This is night.
        Then Earth turns and it''s day again.
        At night it''s dark.
        It''s dark in parks and gardens.
        It''s dark in homes, too.
        People make light with electricity or candles.
        Is it dark when you go to bed?',
        current_timestamp);

-- Sample data for CARD table
INSERT INTO CARD (lesson_id, card_order, front_text, front_audio_uri)
VALUES (1, 0, '#There are# schools #all around the world#.', null),
       (1, 1, '#There are# big schools and little schools, new schools and old schools.', null),
       (1, 2, 'Is your school #big# or #little#?', null),
       (1, 3, 'Is your school #new# or #old#?', null),
       (2, 0, '#All around the world#, students go to school.', null),
       (2, 1, 'Some students #walk# to school, and some go by bus or by train.', null),
       (2, 2, 'Some students go by #bicycle#, and some go by #car#.', null),
       (2, 3, 'These students are in #the USA#. They go to school by bus.', null),
       (2, 4, 'In the snow in Canada, some students go to school by #sled#.', null),
       (2, 5, 'In India, some students go to school by #rickshaw#.', null),
       (2, 6, '#How# do you go to school?', null);

-- Sample data for WORD table
INSERT INTO WORD (word, definition, phonetic, part_of_speech, audio_uri, image_uri)
VALUES ('there are', 'có', null, null, null, null),
       ('all the around the word', 'khắp thế giới', null, null, null, null),
       ('big', 'to, lớn', null, null, null, null),
       ('little', 'nhỏ', null, null, null, null),
       ('new', 'mới', null, null, null, null),
       ('walk', 'đi', null, null, null, null),
       ('bicycle', 'xe đạp', null, null, null, null),
       ('car', 'xe hơi', null, null, null, null),
       ('the USA', 'nước Mỹ', null, null, null, null),
       ('sled', 'xe kéo trượt tuyết', null, null, null, null),
       ('rickshaw', 'xe kéo', null, null, null, null),
       ('how', 'bằng cách nào', null, null, null, null);

-- Sample data for CARD_WORD table
INSERT INTO CARD_WORD (card_id, word_id, word_order)
VALUES (1, 1, 1),
       (1, 2, 2),
       (2, 1, 1),
       (3, 3, 1),
       (3, 4, 2),
       (4, 5, 1),
       (5, 2, 1),
       (6, 6, 1),
       (7, 7, 1),
       (7, 8, 1),
       (8, 9, 1),
       (9, 10, 1),
       (10, 11, 1),
       (11, 12, 1);
