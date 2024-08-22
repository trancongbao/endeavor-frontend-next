import { kysely, Lesson } from "../db/kysely";
import DeckTile from "./DeckTile";

export default async function Decks() {
  const decks = await getDecks();
  console.log("decks: ", decks);

  return (
    <div className="grid gap-4">
      {decks.map((deck) => {
        return <DeckTile key={deck.id} deck={deck} />;
      })}
    </div>
  );
}

async function getDecks() {
  /*
   * TODO: authentication and authorization
   */
  const username = "teacher1";

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
        subdecks: { order: number; title: string }[];
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
              subdecks: [lesson],
            });
          } else {
            course.subdecks.push(lesson);
          }
        }
      );

      return courses;
    });
}
