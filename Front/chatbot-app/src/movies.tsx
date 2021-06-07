//import gql from 'graphql-tag';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';

const MOVIES = gql`
    query getMovies {
        movies{
            id
            title
        }
    }
`;

const Mov = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #000000;
    height: 5vh;
`;

type Movie = {id:number,title:string};

function Movies(){
    const {loading, error, data} = useQuery(MOVIES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.movies.map(({id, title}:Movie) => (
        <Mov>
            <div key={id}>
                <p>{id}: {title}</p>    
            </div>
        </Mov>
    ));
}

export default Movies;