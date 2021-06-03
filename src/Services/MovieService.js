import React from 'react';

export default class MovieService extends React.Component {
  apiBase = 'https://api.themoviedb.org';

  key = 'fa832a734f20f8be63029b222e768ceb';

  async getSrc(url) {
    const res = await fetch(`${this.apiBase}${url}api_key=${this.key}`);
    return res.json();
  }

  async getMovies(word, page) {
    const response = await this.getSrc(`/3/search/movie?query=${word}&page=${page}&`);
    return response;
  }

  async getRatedMovies(guestSessionId, page) {
    const response = await this.getSrc(`/3/guest_session/${guestSessionId}/rated/movies?page=${page}&`);
    return response;
  }

  async getGenres() {
    const response = await this.getSrc(`/3/genre/movie/list?`);
    return response.genres;
  }

  async createGuestSession() {
    const response = await this.getSrc('/3/authentication/guest_session/new?');
    return response;
  }

  async rateMovie(movieId, rating, guestSessionId) {
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=fa832a734f20f8be63029b222e768ceb&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );
  }
}
