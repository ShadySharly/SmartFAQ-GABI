import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

const MOVIES = gql`
    query getMovies {
        movies{
            id
            title
        }
    }
`;

type Movie = {id:number,title:string};

function Movies(){
    const { loading, error, data} = useQuery(MOVIES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.movies.map(({id, title}:Movie) => (
        <div key={id}>
            <p>{id}: {title}</p>    
        </div>
    ));
}

export default Movies;