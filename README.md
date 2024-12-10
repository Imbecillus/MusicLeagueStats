# MusicLeagueStats

A little tool to visualize Music League stats.

Not performant, not pretty, but it's something.

## Setup

Follow these steps to build and run the app:

1. Download your Music League data and convert them into JSON format.
2. Create a subfolder for each league you want visualized in `public/`.
3. Create a file `public/leagues.json`. With the following structure:

   ```js
   {
    "leagues": [
      {
        "path": "round-1/", // The name of the folder that contains the league's data.
        "title": "League 1" // The name of the league.
      },
      {
        "path": "round-2/",
        "title": "League 2"
      },
      // ...
    ]
   }
   ```

4. Build and run the page with `npm run start`.

<sub>You also might want to translate the texts to English because I didn't get around
to that yet lol</sub>

## Acknowledgements

The christmas ornament graphics are from [Freepik.com](https://www.freepik.com/).
