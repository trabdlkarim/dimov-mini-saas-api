import config from "../config/index.js";

const projects = [

];

const main = async () => {
    console.log("Seeding projects...");
    for(const project of projects){
        //TODO
        console.log(`Created project: ${project.name}`);
    }
    console.log("Seeding completed!");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});