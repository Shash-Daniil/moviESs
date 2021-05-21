import React from 'react';
import { Input, Pagination } from 'antd';
import debounce from 'lodash.debounce';
import Movie from './components/Movie/Movie';
import MovieService from './Services/MovieService';
import Tabs from './components/Tabs/Tabs';
import '../node_modules/antd/dist/antd.css';
import Spinner from './components/Spinner/Spinner';
import { Provider } from './Context/Context';
import { SEARCH, RATED } from './const_strings';
import './App.css';

export default class App extends React.Component {
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

  componentDidMount() {
    this.updateMovies();
    const kek = this.movieService.createGuestSession();
    const genres = this.movieService.getGenres();
    kek.then((resp) => this.setState({ guestSession: resp.guest_session_id }));
    genres.then((resp) => this.setState({ genres: resp }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTab } = this.state;
    if (currentTab !== prevState.currentTab) {
      this.updateMovies();
    }
  }

  onLabelChange(text) {
    this.setState({
      label: text,
      loading: true,
    });
    this.debouncedUpdate();
  }

  onPageChange(event) {
    this.setState({ page: Number(event) });
    this.debouncedUpdate();
  }

  onSetCurrent(key) {
    this.setState({ currentTab: key, page: 1 });
  }

  debouncedUpdate() {
    const debouncedUpdates = debounce(() => this.updateMovies(), 1500);
    const { loading } = this.state;
    if (loading === false) {
      this.setState({
        loading: true,
      });
      debouncedUpdates();
    }
  }

  updateMovies() {
    const { currentTab, guestSession, label, page } = this.state;
    if (currentTab === RATED) {
      const kek = this.movieService.getRatedMovies(guestSession, page);
      kek.then((data) => {
        this.setState({
          movies: data,
          loading: false,
        });
      });
    } else {
      const kek = this.movieService.getMovies(label, page);
      kek
        .then((data) => {
          this.setState({
            movies: data,
            loading: false,
          });
        })
        .catch(() => this.setState({ error: true }));
    }
  }

  addRatedMovie(id, stars) {
    this.setState((prev) => ({ ratedMovies: { ...prev.ratedMovies, [id]: stars } }));
  }

  render() {
    const { error, movies, loading, guestSession, page, ratedMovies } = this.state;
    let show;
    if (error) {
      show = <div>error</div>;
    } else if (!movies || (movies.length === 0 && !loading)) {
      show = <div>not found ;)</div>;
    } else {
      show =
        movies.length !== 0 && !loading ? (
          movies.map((elem) => (
            <Movie
              addRatedMovie={this.addRatedMovie.bind(this)} // eslint-disable-line react/jsx-no-bind
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
        ) : (
          <Spinner />
        );
    }

    const { genres, currentTab, label } = this.state;

    return (
      <div className="main">
        <Provider value={genres}>
          <Tabs current={currentTab} onSetCurrent={(key) => this.onSetCurrent(key)} />
          <Input value={label} onChange={(event) => this.onLabelChange(event.target.value)} />
          <div className="movie-list">{show}</div>
          <Pagination
            onChange={(event) => this.onPageChange(event)}
            style={{ display: 'flex', justifyContent: 'center' }}
            current={page}
            total={500}
          />
        </Provider>
      </div>
    );
  }
}
