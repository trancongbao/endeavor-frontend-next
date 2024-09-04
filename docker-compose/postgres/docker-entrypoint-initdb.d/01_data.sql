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
INSERT INTO COURSE (level, title, version, status, summary, description, thumbnail)
VALUES (1, 'School', '1.0.0',  'PUBLISHED', null, null, null),
       (1, 'In the Sky', '1.0.0', 'PUBLISHED', null, null, null),
       (1, 'Fruit', '1.0.0', 'PUBLISHED', null, null, null),
       (1, 'Trees', '1.0.0', 'PUBLISHED', null, null, null),
       (1, 'Young Animals', '1.0.0', 'PUBLISHED', null, null, null);

-- Seed data for TEACHER_COURSE table
INSERT INTO TEACHER_COURSE (teacher_username, course_id)
VALUES ('teacher1', 1),
       ('teacher1', 2),
       ('teacher1', 3),
       ('teacher1', 4),
       ('teacher1', 5),
       ('teacher2', 2),
       ('teacher3', 3),
       ('teacher4', 4),
       ('teacher5', 5);

-- Seed data for LESSON table
INSERT INTO LESSON (course_id, "order", title, audio, summary, description, thumbnail, content, updated_at)
VALUES (1, 0, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. 
        There are big schools and little schools, new schools and old schools.
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
INSERT INTO CARD (course_id, lesson_order, "order", text, audio_uri)
VALUES (1, 0, 0, 'There are schools all around the world.', null),
       (1, 0, 1, 'There are big schools and little schools, new schools and old schools.', null),
       (1, 0, 2, 'Is your school big or little?', null),
       (1, 0, 3, 'Is your school new or old?', null),
       (1, 1, 0, 'All around the world, students go to school.', null),
       (1, 1, 1, 'Some students walk to school, and some go by bus or by train.', null),
       (1, 1, 2, 'Some students go by bicycle, and some go by car.', null),
       (1, 1, 3, 'These students are in the USA. They go to school by bus.', null),
       (1, 1, 4, 'In the snow in Canada, some students go to school by sled.', null),
       (1, 1, 5, 'In India, some students go to school by rickshaw.', null),
       (1, 1, 6, 'How do you go to school?', null);

-- Sample data for WORD table
INSERT INTO WORD (text, definition, phonetic, part_of_speech, audio_uri, image_uri)
VALUES ('there are', 'có', null, null, null, null),
       ('all the around the word', 'khắp thế giới', null, null, null, '/words/globe.png'),
       ('big', 'to, lớn', null, null, null, null),
       ('little', 'nhỏ', null, null, null, null),
       ('new', 'mới', null, null, null, null),
       ('old', 'cũ', null, null, null, null),
       ('walk', 'đi', null, null, null, null),
       ('walk', 'a journey that you make by walking, often for enjoyment', null, null, null, null),
       ('bicycle', 'xe đạp', null, null, null, null),
       ('car', 'xe hơi', null, null, null, null),
       ('the USA', 'nước Mỹ', null, null, null, null),
       ('sled', 'xe kéo trượt tuyết', null, null, null, null),
       ('rickshaw', 'xe kéo', null, null, null, null),
       ('how', 'bằng cách nào', null, null, null, null);
       

-- Sample data for CARD_WORD table
INSERT INTO CARD_WORD (course_id, lesson_order, card_order, word_text, word_definition, start_index, end_index)
VALUES (1, 0, 0, 'there are', 'có', 0, 8),
       (1, 0, 0, 'all the around the word', 'khắp thế giới', 18, 38),
       (1, 0, 1, 'there are', 'có', 0, 8),
       (1, 0, 2, 'big', 'to, lớn', 15, 17),
       (1, 0, 2, 'little', 'nhỏ', 22, 28),
       (1, 0, 3, 'new', 'mới', 15, 17),
       (1, 0, 3, 'old', 'cũ', 22, 24),
       (1, 1, 0, 'all the around the word', 'khắp thế giới', 0, 19),
       (1, 1, 1, 'walk', 'đi', 14, 17),
       (1, 1, 2, 'bicycle', 'xe đạp', 20, 26),
       (1, 1, 2, 'car', 'xe hơi', 44, 46),
       (1, 1, 3, 'the USA', 'nước Mỹ', 22, 28),
       (1, 1, 4, 'sled', 'xe kéo trượt tuyết', 53, 56),
       (1, 1, 5, 'rickshaw', 'xe kéo', 40, 47),
       (1, 1, 6, 'how', 'bằng cách nào', 0, 2);
