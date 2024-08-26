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
/* 
    (level, title, version, status) can be used as a primary composite key.
    But, using as a foreign key (in other tables) would be highly cubersome.
    So here, we opt to use `id` as the primary key and add a unique constraint on the composite key.
*/
CREATE TABLE COURSE
(
    id          SERIAL PRIMARY KEY,                  -- Unique identifier for the course
    level       INT          NOT NULL,               -- Level of the course
    title       VARCHAR(255) NOT NULL,               -- Title of the course
    version     VARCHAR(255) NOT NULL,               -- Version of the course
    status      COURSE_STATUS,                       -- Status of the course
    summary     VARCHAR(255),                        -- Summary of the course
    description TEXT,                                -- Detailed description of the course
    thumbnail   VARCHAR(255),                        -- URL/path to the course thumbnail
    updated_at  timestamp default current_timestamp, -- Timestamp of the last update
    CONSTRAINT unique_level_title_version_status UNIQUE(level, title, version, status)
);

CREATE TABLE TEACHER_COURSE
(
    teacher_username VARCHAR(255) NOT NULL REFERENCES TEACHER (username), -- Reference to the username column of TEACHER table
    course_id        INT          NOT NULL REFERENCES COURSE (id),        -- Reference to the id column of COURSE table
    CONSTRAINT unique_teacher_username_course_id UNIQUE (teacher_username, course_id)
);

/* 
    (course_id, order) is used as the primary composite key.
    Even though using it as a foreign key (in other tables) is more cubersome than `id`, it is deemed tolerable.
    Another important benefit of this approach is that we can use course_id direcly for authorization when dealing with `lesson` or `card`.
*/
CREATE TABLE LESSON
(
    course_id    INTEGER REFERENCES COURSE (id),     -- Foreign key referencing the course that the lesson belongs to
    "order"      INTEGER      NOT NULL,              -- Order of the lesson within the course, cannot be null
    title        VARCHAR(255) NOT NULL,              -- Title of the lesson, cannot be null
    audio        VARCHAR(255) NOT NULL,              -- Path to the audio file for the lesson, cannot be null
    summary      TEXT,                               -- Summary of the lesson
    description  TEXT,                               -- Description of the lesson
    thumbnail    VARCHAR(255),                       -- Path to the thumbnail image for the lesson
    content      TEXT,                               -- Content of the lesson
    updated_at   timestamp default current_timestamp,-- Timestamp of the last update
    PRIMARY KEY (course_id, "order"),                -- Composite primary key
    CONSTRAINT unique_course_id_lesson_order_title UNIQUE (course_id, "order", title)
);

-- Table definition for CARD
CREATE TABLE CARD
(
    id                      SERIAL  PRIMARY KEY,    -- Unique identifier for the card
    course_id               INTEGER,                -- Foreign key referencing course_id in LESSON
    lesson_order            INTEGER,                -- Foreign key referencing "order" in LESSON
    "order"                 INTEGER NOT NULL,       -- Relative order of the card in the lesson
    text                    TEXT    NOT NULL,       -- Text (of the front side of the card)
    audio_uri               TEXT,                   -- URI for audio (associated with the front side)
    CONSTRAINT fk_lesson FOREIGN KEY (course_id, lesson_order) REFERENCES LESSON (course_id, "order"),
    CONSTRAINT unique_course_id_lesson_order_order UNIQUE (course_id, lesson_order, "order")
);

-- Table definition for WORD
/* 
    (text, definition) could be used as a primary composite key.
    But, using as a foreign key (in other tables) would be highly cubersome.
    So here, we opt to use `id` as the primary key and add a unique constraint on the composite key.
*/
CREATE TABLE WORD
(
    id             SERIAL PRIMARY KEY,    -- Unique identifier for the word
    text           VARCHAR(255) NOT NULL, -- Text of the word
    definition     TEXT         NOT NULL, -- Definition of the word
    phonetic       VARCHAR(255),          -- Phonetic pronunciation of the word
    part_of_speech VARCHAR(255),          -- Part of speech of the word
    audio_uri      TEXT,                  -- URI for audio associated with the word
    image_uri      TEXT,                  -- URI for image associated with the word
    CONSTRAINT unique_text_definition UNIQUE (text, definition)

);

-- Table definition for CARD_WORD
CREATE TABLE CARD_WORD
(
    card_id    INTEGER REFERENCES CARD (id), -- Foreign key referencing card
    word_id    INTEGER REFERENCES WORD (id), -- Foreign key referencing word
    -- TODO: Check if is necessary to use a linked-list-like structure (i.e. a nullable prev_word_id column) for (re-)ordering 
    word_order INTEGER NOT NULL,             -- Relative order of the word in the card
    PRIMARY KEY (card_id, word_id)           -- Composite primary key
);
