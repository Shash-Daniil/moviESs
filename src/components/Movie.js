import React from 'react'
import toDate from 'date-fns/toDate'
import format from 'date-fns/format'
import { Rate } from 'antd';
import { Consumer } from '../App'
import Genre from './genre/Genre'

export default class Movie extends React.Component {

    state = {
        movie_id: this.props.id,
        stars: 0
    }

    spliceOverview(str) {
        str = str.split('')
        let index = str.indexOf(' ', 100)
        if(index === -1)
            return str.join('')
        return str.splice(0, index).join('') + ' ...'
    }

    onRateMovie(event) {
        this.setState({
            stars: event
        })
        this.onRate(this.state.movie_id, event, this.props.guestSession)
    }

    onRate = async (movie_id, rating, guestSessionId) => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/rating?api_key=fa832a734f20f8be63029b222e768ceb&guest_session_id=${guestSessionId}`,
                                        {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json;charset=utf-8',
                                            },
                                            body: JSON.stringify( {value: rating} )
                                        }
                                    )
    }

    render() {
        let {title, imgSrc, overview} = this.props
        overview = this.spliceOverview(overview)
        let date
        try {
            date = String(format(toDate(new Date(this.props.date)), "MMMM dd, yyyy"))
        } catch(e) {
            date = String(format(toDate(new Date()), "MMMM dd, yyyy"))
            console.log(`Movie.js date format ERR!!!  ${e}`)
        }

        return (
            <Consumer>
                {
                    genres => {
                        let currentGenres = []
                        if (genres) {
                            genres.forEach(elem => {
                                if (this.props.genres.indexOf(elem.id) !== -1)
                                    currentGenres.push(elem.name)
                            })
                        }

                        const ratingStyle = () => {
                            let style
                            if (this.state.stars <= 3)
                                return { borderColor: "#E90000" }
                            else if (this.state.stars > 3 && this.state.stars <= 5)
                                return { borderColor: "#E97E00" }
                            else if (this.state.stars > 5 && this.state.stars <= 7)
                                return { borderColor: "#E9D100" }
                            else if (this.state.stars > 7)
                                return { borderColor: "#66E900" }
                        }

                        return (
                            <div className='movie-card'>
                                <img className='movie-card__picture' src={`https://image.tmdb.org/t/p/w200${imgSrc}`}></img>
                                <div className='movie-card__description'>
                                    <h5 className='movie-card__title'>{ title }</h5>
                                    <div className='current-movie-rating' style={ratingStyle()}>{this.state.stars}</div>
                                    <div className='movie-card__date'>{ date }</div>
                                    <div className='genres'>
                                        {currentGenres.map(elem => <Genre genre={elem} />)}
                                    </div>
                                    <div className='movie-card__story'>
                                        {overview}
                                    </div>
                                    <div className="rate">
                                        <Rate onChange={event => this.onRateMovie(event)} 
                                            allowHalf={true} 
                                            count={10} 
                                            style={{fontSize: "16px" }}
                                            value={this.state.stars}/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }
}
