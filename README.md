# ReelMind: Your Next Movie Obsession

Build a simple movie recommendation system frontend using ONLY:

- ReactJS

- JSX

- HTML

- CSS

- JavaScript

IMPORTANT:

- Do NOT use TypeScript.

- Do NOT use TSX.

- Do NOT use Tailwind CSS.

- Do NOT create a complicated/high-end architecture.

- Keep the code beginner-friendly and easy to understand.

- Use normal CSS files.

- Keep the number of components small.

- Avoid unnecessary libraries.

- Do not over-engineer the project.

PROJECT:

I am building a Movie Recommendation System using a Machine Learning clustering method.

My dataset contains around 1.45 million movie records and these columns:

id

title

vote_average

vote_count

status

release_date

revenue

runtime

adult

backdrop_path

budget

homepage

imdb_id

original_language

original_title

overview

popularity

poster_path

tagline

genres

production_companies

production_countries

spoken_languages

keywords

The ML model/recommendation logic will be handled separately. The frontend should mainly provide a clean interface for searching movies and displaying recommendations.

==================================================

DESIGN

==================================================

Create a normal dark/grey cinema-inspired theme.

Use:

- Dark grey / charcoal background

- Slightly lighter grey cards

- White/light grey text

- One subtle cinema-related accent color

- Good spacing

- Rounded corners, but not excessive

- Clean buttons

- Simple shadows

- Good typography

The website should feel like:

"movie database + small cinema room"

It should be aesthetic and slightly funny/cinematic, but NOT look like a gaming website.

Do NOT make it overly futuristic.

Do NOT use excessive gradients.

Do NOT use glassmorphism everywhere.

Do NOT use huge animations.

Do NOT make everything glow.

Do NOT make the UI complicated.

==================================================

PAGE STRUCTURE

==================================================

Create only a few main components:

1. Navbar

2. Hero/Search section

3. Movie Search Results

4. Movie Card

5. Movie Details section/modal

6. Recommendation section

7. Footer

Do not create dozens of unnecessary components.

==================================================

NAVBAR

==================================================

Create a simple navbar.

Left:

A small cinema/movie logo icon and website name:

"ReelMind"

Subtitle or small text:

"Movies, but with a little machine learning."

Right:

- Home

- Discover

- About

Keep navigation simple.

==================================================

HERO SECTION

==================================================

Create a cinematic but simple hero section.

Heading:

"Find Your Next Movie Obsession."

Small text:

"Let the algorithm do the digging. You just bring the popcorn."

Add a large search bar.

Placeholder:

"Search for a movie..."

Button:

"Find Movies"

Add a very subtle cinematic visual in the background.

Use a movie/cinema related image if useful, but keep it dark and simple.

Do not make the hero extremely tall.

==================================================

MOVIE SEARCH

==================================================

When a user searches for a movie, display movie cards.

Each card should contain:

- Poster

- Movie title

- Release year

- Rating

- Genre

- Popularity

- Small "View Details" button

Use poster_path from the dataset.

IMPORTANT DATA PLACEHOLDER:

Create a clearly marked file/section where I can connect my dataset/API/backend.

Use comments like:

// ===============================

// CONNECT YOUR MOVIE DATA HERE

// Replace this sample data with your API / ML backend data

// ===============================

Do NOT try to load the 1.45 million row CSV directly into the browser.

Instead, create a small sample movieData array so I can understand how the frontend works.

Clearly mark where I need to replace the sample data with my backend/API.

==================================================

MOVIE CARD

==================================================

Movie cards should be simple and clean.

Example:

[POSTER]

Inception

2010

★ 8.8

Sci-Fi • Thriller

Popularity: 42.5

[View Details]

Use hover effects.

When hovering:

- Slightly lift the card

- Slightly zoom the poster

- Button becomes more noticeable

Keep animation short and subtle.

Use CSS pseudo-classes such as:

.card:hover

.button:hover

.movie-card img:hover

Do not use complicated animation libraries.

==================================================

MOVIE DETAILS

==================================================

When "View Details" is clicked, show a simple movie details area or modal.

Display:

Movie poster

Title

Original title

Release date

Rating

Vote count

Runtime

Genres

Overview

Original language

Popularity

Budget

Revenue

If some fields are missing, display:

"Not available"

Do not show ugly "undefined" or "null".

Clearly mark the data mapping area so I can change the field names later.

Example:

// ===============================

// MOVIE DATA FIELD MAPPING

// Change these fields if your backend uses different names

// ===============================

==================================================

RECOMMENDATION SECTION

==================================================

Create a section:

"Movies You Might Actually Like"

Small subtitle:

"Apparently, the algorithm has opinions."

Display 5-8 recommended movie cards.

Each recommendation should contain:

Poster

Title

Year

Rating

Genre

Similarity score

Example:

Similarity: 92%

IMPORTANT:

Clearly mark where the ML recommendation results will be connected.

Example:

// ==================================================

// CONNECT YOUR CLUSTERING MODEL HERE

// Replace this sample recommendation data

// with the movies returned by your ML backend.

// ==================================================

The frontend should expect something simple like:

[

  {

    id: 1,

    title: "Inception",

    poster_path: "...",

    release_date: "2010-07-16",

    vote_average: 8.8,

    genres: "Sci-Fi, Thriller",

    similarity: 92

  }

]

Do not implement the actual clustering algorithm in the frontend.

==================================================

ML BACKEND CONNECTION PLACEHOLDER

==================================================

Create a clearly marked section/file showing where I can connect my ML backend.

For example:

// ===============================

// API CONFIGURATION

// ===============================

// Replace this URL with your backend URL

const API_URL = "YOUR_BACKEND_API_URL";

Show simple example functions such as:

searchMovies()

getRecommendations()

But keep them beginner-friendly.

Do not create Redux.

Do not create complex state management.

Do not create advanced API layers.

==================================================

FILTERS

==================================================

Add a small filter area if it can be done simply.

Filters:

Genre

Language

Minimum Rating

Release Year

Keep filters simple.

Do not create a huge sidebar.

==================================================

EMPTY STATES

==================================================

If no movies are found:

"No movies found."

Small text:

"Even the algorithm is confused."

If there are no recommendations:

"No recommendations yet."

==================================================

LOADING STATE

==================================================

Use a simple loading message:

"Rolling the film..."

Do not create complicated skeleton loaders.

==================================================

CINEMA DETAILS

==================================================

Add very subtle movie/cinema elements throughout the design.

Examples:

- Film-strip inspired divider

- Small popcorn icon

- Clapperboard icon

- Tiny film-reel decorations

- Cinema-inspired section headings

But keep these subtle.

The website should still look like a proper ML project, not a movie fan website.

==================================================

CSS

==================================================

Use normal CSS.

Create:

App.css

index.css

Use CSS variables for the main colors.

Example structure:

:root {

  --background: ...;

  --card: ...;

  --text: ...;

  --muted: ...;

  --accent: ...;

}

Use:

:hover

:focus

:first-child

:last-child

::before

::after

where they actually make sense.

Do not overuse pseudo-elements.

Add responsive CSS for:

Desktop

Tablet

Mobile

Cards should not overlap or get stuck together.

Use CSS Grid/Flexbox properly.

==================================================

IMPORTANT CODE STYLE

==================================================

I am a student and need to understand this code.

Therefore:

- Keep JSX simple.

- Keep functions short.

- Use understandable variable names.

- Avoid advanced JavaScript.

- Avoid unnecessary abstractions.

- Avoid custom hooks unless genuinely necessary.

- Avoid complicated folder structures.

- Avoid TypeScript.

- Avoid Tailwind.

- Avoid Redux.

- Avoid excessive dependencies.

- Avoid huge files where possible.

- Do not hide important logic inside complicated utilities.

Every important integration point should have a clear comment saying:

"CHANGE THIS HERE"

or

"CONNECT YOUR BACKEND HERE"

==================================================

SUGGESTED STRUCTURE

==================================================

Use a simple structure such as:

src/

  components/

    Navbar.jsx

    Hero.jsx

    MovieCard.jsx

    MovieDetails.jsx

    Recommendations.jsx

  data/

    sampleMovies.js

  App.jsx

  App.css

  index.css

  main.jsx

Keep it around this level of complexity.

==================================================

SAMPLE DATA

==================================================

Provide around 8-10 sample movies so I can immediately see the UI working.

Use realistic movie information.

IMPORTANT:

Clearly label the sample data:

// ==================================================

// SAMPLE DATA ONLY

// Replace this with data from your backend/API.

// DO NOT PUT THE FULL 1.45 MILLION ROW DATASET HERE.

// ==================================================

==================================================

FINAL REQUIREMENT

==================================================

The final result should look:

Simple

Dark

Grey

Cinematic

Clean

Aesthetic

Slightly funny

Student-project friendly

Responsive

It should NOT look:

Over-engineered

Ultra futuristic

Gaming-style

Full of animations

Full of glowing effects

Full of complicated components

Most importantly:

I should be able to open the generated JSX and understand what is happening.

Whenever you create a place where I need to connect:

- dataset

- API

- clustering model

- recommendation results

- movie images

clearly mark that exact place with:

// ===============================

// CHANGE THIS HERE

// ===============================

Do not leave me guessing where to connect my ML model. and must use token according to need do not use too much that project never complete and token finished understood no make it

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/df33f601-3ffc-4b38-ad24-dc133d214d37).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
