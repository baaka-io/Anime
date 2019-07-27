# Anime Website

This is a website developed for personal use.

## Initial ideas

### Supported functionality

* List all animes (by using the paging functionaltiy of jikan)
* Search all animes (by genre, title, ...)
* Get information about anime (still not sure how big or how little information)
  * I want to show all episodes, but I'm still not sure whether to show thumbnails. It would be really cool and aesthetically pleasing, but might be too hard to implement.
  * Important information: MAL always uses the third picture as anime cover.
* Watch episodes
  * Important side information to show the thumbnail of a video look at the following SO answer https://stackoverflow.com/a/43848097

### Frontend

I will be using vuejs and vuetify for the frontend. Vuex won't be needed because I don't really have any state to save.
The frontend will have a nice looking ui that aligns with the material design specification.

### Backend

The backend will be basically stateless besides a cache for Jikan (maybe a cache for episodes later on). It will act as a sort of middleman for kissanime (using opensourcescraper from openbyte) and myanimelist (using jikan).
For perfomance and rate limiting reasons I will use the cache capabilities of jikan to not exceed the rate limit or even get blocked.
