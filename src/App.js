import React from 'react';
import { Input, Pagination, Alert } from 'antd';
import debounce from 'lodash.debounce';
import Movie from './components/Movie/Movie';
import MovieService from './Services/MovieService';
import Tabs from './components/Tabs/Tabs';
import Spinner from './components/Spinner/Spinner';
import { Provider } from './Context/Context';
import { SEARCH, RATED } from './tabTypes';
import './App.css';

export default class App extends React.PureComponent {
  state = {
    movies: [],
    loading: true,
    label: 'return',
    page: 1,
    guestSession: '',
    currentTab: SEARCH,
    genres: '',
    ratedMovies: {},
    error: false,
  };

  movieService = new MovieService();

  debouncedUpdates = debounce(() => this.updateMovies(), 1500);

  componentDidMount() {
    this.updateMovies();
    const session = this.movieService.createGuestSession();
    const genres = this.movieService.getGenres();
    session.then((resp) => this.setState(() => ({ guestSession: resp.guest_session_id })));
    genres.then((resp) => this.setState({ genres: resp }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTab, page } = this.state;
    if (currentTab !== prevState.currentTab) {
      this.updateMovies();
    }
    if (page !== prevState.page) {
      this.updateMovies();
    }
  }

  onLabelChange(text) {
    this.setState({
      label: text,
      loading: true,
    });
    this.debouncedUpdates();
  }

  onPageChange(event) {
    this.setState({ page: Number(event) });
  }

  onSetCurrent(key) {
    this.setState({ currentTab: key, page: 1, loading: true });
  }

  addRatedMovie = (id, stars) => {
    this.setState((prev) => ({ ratedMovies: { ...prev.ratedMovies, [id]: stars } }));
  };

  updateMovies() {
    const { currentTab, guestSession, label, page } = this.state;
    this.setState({
      loading: true,
    });
    if (currentTab === RATED) {
      const kek = this.movieService.getRatedMovies(guestSession, page);
      kek.then((data) => {
        this.setState({
          movies: data.results || [],
          pages: data.total_pages,
          loading: false,
          errors: data.errors,
          error: !data.results,
        });
      });
    } else {
      const kek = this.movieService.getMovies(label, page);
      kek
        .then((data) => {
          this.setState({
            movies: data.results || [],
            pages: data.total_pages,
            loading: false,
            errors: data.errors,
            error: !data.results,
          });
        })
        .catch((error) => {
          if (error.message === 'Failed to fetch') {
            setTimeout(() => this.updateMovies(), 5000);
          }
          this.setState({ error: true });
        });
    }
  }

  render() {
    const { error, movies, loading, guestSession, page, ratedMovies, genres, currentTab, label, pages, errors } =
      this.state;

    return (
      <div className="main">
        <Provider value={genres}>
          <Tabs current={currentTab} onSetCurrent={(key) => this.onSetCurrent(key)} />
          <Input value={label} onChange={(event) => this.onLabelChange(event.target.value)} />
          <div className="movie-list">
            {loading && !error ? <Spinner /> : null}
            {error || errors ? <Alert className="alert" message="error" type="error" /> : null}
            {!error && movies.length === 0 && !loading ? (
              <Alert className="alert" message="Not found" type="warning" />
            ) : null}
            {movies.length !== 0 && !loading
              ? movies.map((elem) => (
                  <Movie
                    addRatedMovie={this.addRatedMovie} // eslint-disable-line react/jsx-no-bind
                    genres={elem.genre_ids}
                    guestSession={guestSession}
                    id={elem.id}
                    loading={loading}
                    key={elem.id}
                    title={elem.title}
                    imgSrc={elem.poster_path}
                    overview={elem.overview}
                    date={elem.release_date}
                    rating={ratedMovies[elem.id] || elem.rating || elem.vote_average}
                    page={page}
                  />
                ))
              : null}
          </div>
          {movies.length !== 0 && !loading ? (
            <Pagination
              className="pagination"
              onChange={(event) => this.onPageChange(event)}
              current={page}
              total={pages * 10}
              showSizeChanger={false}
            />
          ) : null}
        </Provider>
      </div>
    );
  }
}
