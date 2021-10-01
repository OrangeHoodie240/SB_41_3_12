import React from 'react';
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";


class JokeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { jokes: [] };

        this.defaultLength = 10;
    }

    async componentDidMount(){
        if(this.state.jokes.length === 0){
            this.setState({jokes: await this.getJokes()}); 
        }
    }

    async componentDidUpdate(){
        if(this.state.jokes.length === 0){
            this.setState({jokes: await this.getJokes()}); 
        }
    }

    getJokes = async () => {
        let j = [...this.state.jokes];
        let seenJokes = new Set();
        try {
            while (j.length < (this.props.numJokesToGet || this.defaultLength )) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                    headers: { Accept: "application/json" }
                });
                let { status, ...jokeObj } = res.data;

                if (!seenJokes.has(jokeObj.id)) {
                    seenJokes.add(jokeObj.id);
                    j.push({ ...jokeObj, votes: 0 });
                } else {
                    console.error("duplicate found!");
                }
            }
            return j;
        } catch (e) {
            console.log(e);
        }
    }

    generateNewJokes = ()=>{
        this.setState({jokes:[]}); 
    }

    vote = (id, delta)=>{
        let jokes = this.state.jokes.map(j=>(j.id === id ? { ...j, votes: j.votes + delta } : j)); 
        this.setState({jokes});
    }

    render = ()=>{
        if (this.state.jokes.length) {
            let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

            return (
                <div className="JokeList">
                    <button className="JokeList-getmore" onClick={this.generateNewJokes}>
                        Get New Jokes
                    </button>
    
                    {sortedJokes.map(j => (
                        <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
                    ))}
                </div>
            );
        }
        return null;
    }

}






export default JokeList;
