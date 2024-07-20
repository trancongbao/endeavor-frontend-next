import { kysely } from "../kysely";
import { teachers } from "./data";

kysely.insertInto("teacher").values(teachers).execute();
