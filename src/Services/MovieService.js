import React from "react"

export default class MovieService extends React.Component {

    _apiBase = 'https://api.themoviedb.org'

    async getSrc (url) {
        let key = 'fa832a734f20f8be63029b222e768ceb'
        const res = await fetch(`${this._apiBase}${url}api_key=${key}`)
        return res.json()
    }

    async getMovies(word, page) {
        const response = await this.getSrc(`/3/search/movie?query=${word}&page=${page}&`)
        return response.results
    }

    async createGuestSession() {
        const response = await this.getSrc('/3/authentication/guest_session/new?')
        return response
    }

    async getRatedMovies(guestSessionId) {
        const response = await this.getSrc(`/3/guest_session/${guestSessionId}/rated/movies?`)
        console.log(response)
        return response
    }
}