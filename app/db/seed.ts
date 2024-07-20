import { kysely } from "./kysely";

console.log("Seeding Teacher.");
const teachers = [
  {
    username: "teacher1",
    password: "password1",
    surname: "Garcia",
    given_name: "Carlos",
    email: "carlos.garcia@example.com",
    phone: "+1112223333",
    date_of_birth: new Date("1980-07-10"),
    address: "111 Walnut St, City, Country",
    avatar: "https://example.com/avatar6.jpg",
  },
  {
    username: "teacher2",
    password: "password2",
    surname: "Martinez",
    given_name: "Luisa",
    email: "luisa.martinez@example.com",
    phone: "+4445556666",
    date_of_birth: new Date("1972-09-12"),
    address: "222 Maple St, City, Country",
    avatar: "https://example.com/avatar7.jpg",
  },
  {
    username: "teacher3",
    password: "password3",
    surname: "Lopez",
    given_name: "Maria",
    email: "maria.lopez@example.com",
    phone: "+7778889999",
    date_of_birth: new Date("1983-04-18"),
    address: "333 Oak St, City, Country",
  },
];
kysely.insertInto("teacher").values(teachers).execute();
