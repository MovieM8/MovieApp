# Movie Web Application

## Project Overview
This project is a web application designed for movie enthusiasts. The application provides an interactive platform where users can search for movies, browse cinema showtimes, create groups, and share movie reviews and favorite lists. The application leverages open data sources to provide real-time information about movies and theater schedules.  

The frontend is built using **React**, the backend uses **Node.js**, and **PostgreSQL** serves as the database.

---

## Open Data APIs

The application integrates the following open data sources:

1. **The Movie Database (TMDb)**  
   - Provides a large collection of movie-related data.  
   - Requires registration to obtain an API key/token.

2. **Finnkino API**  
   - Offers open access to theater schedules in XML format.  
   - No registration required.

---

## Features

| ID | Feature | Description |
|----|---------|-------------|
| 1  | Responsiveness | The user interface scales appropriately to different screen sizes. |
| 2  | Registration | Users can register with an email and password (minimum 8 characters, at least one uppercase letter and one number). |
| 3  | Login/Logout | Users can log in and log out using their registered credentials. |
| 4  | Account Deletion | Users can delete their account, which also removes all user-generated data (reviews, favorites, group contributions). |
| 5  | Movie Search | Users can search for movies using at least three different search criteria. Login is not required. |
| 6  | Cinema Showtimes | Users can browse showtimes for different Finnkino theaters. Login is not required. |
| 7  | Group Page | Users can create groups with custom names. Groups are listed publicly, but detailed content is only visible to members. The group creator (owner) can delete the group. |
| 8  | Add Members | Users can send join requests to groups. The owner can approve or reject requests. |
| 9  | Remove Members | Group owners can remove members, or members can leave the group themselves. |
| 10 | Group Page Customization | Group members can add movies and showtimes to the group page. |
| 11 | Movie Reviews | Logged-in users can submit movie reviews with text, star rating (1–5), email, and timestamp. |
| 12 | Browsing Reviews | Movie reviews are visible to all users. Users can click a review to view movie details. |
| 13 | Favorite Lists | Logged-in users can create personal favorite movie lists, displayed on their profile page. |
| 14 | Share Favorite Lists | Users can share their favorite lists via a URI, visible to all users. |
| 15 | Optional Feature | A custom feature implemented for the project: **Group Chat**. |

---

## Technology Stack

- **Frontend:** React  
- **Backend:** Node.js  
- **Database:** PostgreSQL  
- **APIs:** TMDb, Finnkino  

---

## Installation & Setup

1. Clone the repository:  
   ```bash
   git clone <repository-url>


2. Navigate to the project folder and install dependencies for frontend and backend:
    ```bash
    cd frontend && npm install
    cd ../backend && npm install

3. Set up PostgreSQL database and configure environment variables for API keys and database connection.

4. Run the application:
    ```bash
    npm start

## Usage

- Register a new account or log in with existing credentials
- Search for movies using multiple filters
- Browse theater showtimes from Finnkino
- Create groups, add members, and share movie recommendations
- Write and browse movie reviews
- Create and share personal favorite lists
- Use the optional group chat feature to discuss movies with other members

---

## Notes

- Ensure API keys for TMDb are valid and set in the environment variables
- The Finnkino API returns data in XML format; the application parses this data for display
- All group-related content is private to members unless explicitly shared

## API Documentation

For detailed information on the REST API endpoints used in this project, see the [Postman API Documentation](https://documenter.getpostman.com/view/41099669/2sB3QJNAbA).