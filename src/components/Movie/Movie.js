import React from 'react'
import toDate from 'date-fns/toDate'
import format from 'date-fns/format'
import { Rate } from 'antd';
import PropTypes from 'prop-types'
import { Consumer } from '../../Context/Context'
import Genre from '../Genre/Genre'
import './Movie.css'
import { RED, YELLOW, ORANGE, GREEN } from '../../const_strings'

export default class Movie extends React.Component {

    static propTypes = {
        id: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired,
        addRatedMovie: PropTypes.func.isRequired,
        guestSession: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        imgSrc: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        genres: PropTypes.array.isRequired,                 // eslint-disable-line react/forbid-prop-types
        overview: PropTypes.string.isRequired
    }

    state = {
        movieId: this.props.id,                             // eslint-disable-line react/destructuring-assignment
        stars: this.props.rating ? this.props.rating : 0    // eslint-disable-line react/destructuring-assignment
    }

    onRateMovie(event) {
        const { addRatedMovie, guestSession } = this.props
        const { movieId } = this.state
        addRatedMovie(movieId, event)
        this.setState({
            stars: event
        })
        this.onRate(movieId, event, guestSession)
    }

    onRate = async (movieId, rating, guestSessionId) => {
        await fetch(`https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=fa832a734f20f8be63029b222e768ceb&guest_session_id=${guestSessionId}`,
                                        {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json;charset=utf-8',
                                            },
                                            body: JSON.stringify( {value: rating} )
                                        }
                                    )
    }

    spliceOverview(str) {
        const arrStr = str.split('')
        const index = arrStr.indexOf(' ', 130)
        if(index === -1)
            {return arrStr.join('')}
        return `${arrStr.splice(0, index).join('')  } ...`
    }

    render() {
        const { stars } = this.state
        const {title, imgSrc, date, genres } = this.props
        let { overview } = this.props
        overview = this.spliceOverview(overview)
        let formatedDate
        try {
            formatedDate = String(format(toDate(new Date(date)), "MMMM dd, yyyy"))
        } catch(error) {
            formatedDate = String(format(toDate(new Date()), "MMMM dd, yyyy"))
        }

        return (
            <Consumer>
                {
                    genresArr => {
                        const currentGenres = []
                        if (genresArr) {
                            genresArr.forEach(elem => {
                                if (genres.indexOf(elem.id) !== -1)
                                    {currentGenres.push(elem.name)}
                            })
                        }

                        const ratingStyle = () => {
                            if (stars <= 3)
                                {return { borderColor: RED }}
                            if (stars > 3 && stars <= 5)
                                {return { borderColor: ORANGE }}
                            if (stars > 5 && stars <= 7)
                                {return { borderColor: YELLOW }}
                            if (stars > 7)
                                {return { borderColor: GREEN }}
                            return {}
                        }

                        /* eslint-disable react/no-array-index-key */
                        return (
                            <div className='movie-card'>
                                <img className='movie-card__picture' src={`https://image.tmdb.org/t/p/w200${imgSrc}`} alt="film" />
                                <div className='movie-card__description'>
                                    <h5 className='movie-card__title' style={{fontSize: title.length > 20 ? '16px' : null}}>{ title }</h5>
                                    <div className='current-movie-rating' style={ratingStyle()}>{stars}</div>
                                    <div className='movie-card__date'>{ formatedDate }</div>
                                    <div className='genres'>
                                        {currentGenres.map((elem, index) => <Genre key={index} genre={elem} />)}
                                    </div>
                                    <div className='movie-card__story'>
                                        {overview}
                                    </div>
                                    <div className="rate">
                                        <Rate onChange={event => this.onRateMovie(event)} 
                                            allowHalf 
                                            count={10} 
                                            style={{fontSize: "16px" }}
                                            value={stars}/>
                                    </div>
                                </div>
                                <div className='movie-card__story_mobile'>
                                        {overview}
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }
}
