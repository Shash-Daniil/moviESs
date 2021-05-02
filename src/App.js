import React from 'react';
import Movie from './components/Movie'
import MovieService from './Services/MovieService'
import Tabs from './components/Tabs/Tabs'
import { Input } from 'antd';
import { Pagination } from 'antd';
import '../node_modules/antd/dist/antd.css';
import Spinner from './components/spinner/Spinner'
import debounce from 'lodash.debounce'

export const { Provider, Consumer } = React.createContext()

export default class App extends React.Component {
    
    state = {
        movies: [],
        loading: true,
        label: 'return',
        page: 1,
        guestSession: '',
        currentTab: 'search',
        genres: ''
    }

    movieService = new MovieService()

    updateMovies() {
        if (this.state.currentTab === 'rated') {
            const kek = this.movieService.getRatedMovies(this.state.guestSession)
            kek.then(data => {
                this.setState({
                    movies: data,
                    loading: false
                })
            })
        } else {
            const kek = this.movieService.getMovies(this.state.label, this.state.page)
            kek.then(data => {
                this.setState({
                    movies: data,
                    loading: false
                })
            })
        }
    }

    componentDidMount() {
        this.updateMovies()
        const kek = this.movieService.createGuestSession()
        const genres = this.movieService.getGenres()
        kek.then(resp => this.setState({guestSession: resp.guest_session_id}))
        genres.then(resp => this.setState({genres: resp}))
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.currentTab !== prevState.currentTab) {
            this.updateMovies()
        }
    }

    debouncedUpdate() {
        const debouncedUpdates = debounce(() => this.updateMovies(), 1500)
        if (this.state.loading === false) {
            this.setState({
                loading: true
            })
            debouncedUpdates()
        }
    }

    onLabelChange(text) {
        this.setState({
            label: text,
            loading: true
        })
        this.debouncedUpdate()
    }

    onPageChange(event) {
        this.setState({page: Number(event)})
        this.debouncedUpdate()
    }

    onSetCurrent(key) {
        this.setState({currentTab: key})
    }

    render() {
        let show

        if (!this.state.movies || this.state.movies.length === 0 && !this.state.loading) {
            show = <div>not found ;)</div>
        } else {
            show = (this.state.movies.length !== 0 && !this.state.loading) ? this.state.movies.map(elem => <Movie
                genres={elem.genre_ids}
                guestSession={this.state.guestSession}
                id={elem.id}
                loading={this.state.loading}
                key={elem.id}
                title={elem.title}
                imgSrc={elem.poster_path}
                overview={elem.overview}
                date={elem.release_date}
                page={this.state.page}/>) : <Spinner />
        }

        return (
            <div className="main">
                <Provider value={this.state.genres}>
                    <Tabs current={this.state.currentTab} onSetCurrent={(key) => this.onSetCurrent(key)}/>
                    <Input value={this.state.label}
                        onChange={(e) => this.onLabelChange(e.target.value)}/>
                    <div className="movie-list">
                        {show}
                    </div>
                    <Pagination onChange={ (event) => this.onPageChange(event) } style={{width:275, display:"block", margin:"0 auto"}} defaultCurrent={1} total={50} />
                </Provider>
            </div>
        )
    }
}