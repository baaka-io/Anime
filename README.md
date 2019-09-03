# Anime Website

This is a website developed for personal use.

## IF ERROR BABEL VERSION NOT MATCH

try to install babel core seperately

## Initial ideas

### Supported functionality

- List all animes (by using the paging functionaltiy of jikan)
- Search all animes (by genre, title, ...)
- Get information about anime (still not sure how big or how little information)
  - I want to show all episodes, but I'm still not sure whether to show thumbnails. It would be really cool and aesthetically pleasing, but might be too hard to implement.
    - Using the way to show the thumbnail of the video from below, but without controls achieves this feature. Don't think it is worth it.
  - Important information: MAL always uses the third picture as anime cover.
- Watch episodes
  - Important side information to show the thumbnail of a video look at the following SO answer https://stackoverflow.com/a/43848097

### Frontend

I will be using reactjs (hooks) together with redux for the frontend.
I am still not sure with UI library to use for styles. (Bulma, Material, ...)

#### Navigations

- Discover
- Season
- Schedule (Maybe)
- Account (Future)

### Backend

The backend will be basically stateless besides a cache for Jikan (maybe a cache for episodes later on). It will act as a sort of middleman for kissanime (using opensourcescraper from openbyte) and myanimelist (using jikan).
For perfomance and rate limiting reasons I will use the cache capabilities of jikan to not exceed the rate limit or even get blocked.

[design inspiration](https://dribbble.com/shots/6745127-Anidub-Redesign)
