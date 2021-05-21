import React from "react"

export default class MovieService extends React.Component {

    apiBase = 'https://api.themoviedb.org'

    async getSrc (url) {
        const key = 'fa832a734f20f8be63029b222e768ceb'
        const res = await fetch(`${this.apiBase}${url}api_key=${key}`)
        return res.json()
    }

    async getMovies(word, page) {
        const response = await this.getSrc(`/3/search/movie?query=${word}&page=${page}&`)
        return response.results
    }

    async getRatedMovies(guestSessionId) {
        const response = await this.getSrc(`/3/guest_session/${guestSessionId}/rated/movies?`)
        return response.results
    }

    async getGenres() {
        const response = await this.getSrc(`/3/genre/movie/list?`)
        return response.genres
    }

    async createGuestSession() {
        const response = await this.getSrc('/3/authentication/guest_session/new?')
        return response
    }
}