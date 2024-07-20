import { kysely, Lesson } from "../db/kysely";
import DeckTile from "./DeckTile";
import { Key } from "react";

export default async function Decks() {
  const myDecks = await getDecks();

  return (
    <div className="my-decks-grid-container">
      <div>Decks</div>
      <div>{myDecks[0].id}</div>
      {/* {myDecks.map((deck: { id: Key | null | undefined }) => {
        <DeckTile key={deck.id} deck={deck} />;
      })} */}
    </div>
  );
}

async function getDecks() {
  const username = 'teacher1'
  return await kysely
    .selectFrom("teacher_course")
    .innerJoin("course", "course.id", "teacher_course.course_id")
    .innerJoin("lesson", "lesson.course_id", "course.id")
    .select([
      "course.id as course_id",
      "course.level as course_level",
      "course.title as course_title",
      "lesson.id as lesson_id",
      "lesson.lesson_order",
      "lesson.title as lesson_title",
    ])
    .where("teacher_course.teacher_username", "=", username)
    .execute()
    .then((rows) => {
      const courses: {
        id: number;
        level: number;
        title: string;
        subDecks: { order: number; title: string }[];
      }[] = [];
      rows.forEach(
        ({
          course_id,
          course_level,
          course_title,
          lesson_order,
          lesson_title,
        }) => {
          const course = courses.find((course) => course.id === course_id);
          const lesson = {
            order: lesson_order,
            title: lesson_title,
          };
          if (course === undefined) {
            courses.push({
              id: course_id,
              level: course_level,
              title: course_title,
              subDecks: [lesson],
            });
          } else {
            course.subDecks.push(lesson);
          }
        }
      );

      return courses;

      //sendSuccessResponse(response, courses);
    })
    // .catch((error) => {
    //   console.log(error);
    //   // sendErrorResponse(
    //   //   response,
    //   //   Codes.RpcMethodInvocationError,
    //   //   error.message
    //   // );
    // });
}
