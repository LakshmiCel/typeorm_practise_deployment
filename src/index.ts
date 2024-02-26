import { AppDataSource } from "./data-source";
import { User } from "./entity/Users";

AppDataSource.initialize().then(async () => {
  try {
    const users = await AppDataSource.manager.getRepository(User).find();
    console.log("Database connection established,", users);
  } catch (error) {
    console.error("Error initializing database:", error.message);
  }
});

// import { AppDataSource } from "./data-source";
// import { Gender, User } from "./entity/Users";

// async function main() {
//   try {
//     await AppDataSource.initialize(); // Initialize the database connection
//     const userRepository = AppDataSource.manager.getRepository(User);

//     const newUser = new User();
//     newUser.name = "John Doe";
//     newUser.username = "johndoe";
//     newUser.bio = "Lorem ipsum dolor sit amet.";
//     newUser.gender = Gender.MALE;
//     newUser.email = "john@example.com";
//     newUser.image_url = "https://example.com/johndoe.jpg";
//     newUser.avatar_url = "https://example.com/avatar.jpg";
//     newUser.dob = new Date("1990-01-01");
//     // Add any other properties as needed

//     const savedUser = await userRepository.save(newUser);

//     console.log("New user created:", savedUser);
//   } catch (error) {
//     console.error("Error creating new user:", error.message);
//   } finally {
//     await AppDataSource.close(); // Close the database connection
//   }
// }

// main();
