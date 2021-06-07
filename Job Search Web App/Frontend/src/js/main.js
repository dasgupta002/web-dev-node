import { jobFinder } from "./query";

const jobpick = new jobFinder("#search-form", ".loader", ".job-query");

jobpick.configureFormListener();