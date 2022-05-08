import React, { useState } from 'react'
import { useQuery,gql,useLazyQuery,useMutation} from '@apollo/client'

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
       users {
          id
          name
          age
          username
       }
    }
`

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
       movies {
          name
       }
    }
`

const GET_MOVIE_BY_NAME =  gql`
   query Movie($name:String!){
      movie(name:$name){
        name
        yearOfPublication
      }
   }
`
const CREATE_USER_MUTATION = gql`
      mutation createUser($input:createUserInput!) {
            createUser(input:$input){
              name

            }
      }
`
const DisplayData = () => {


  //create user state
  
  const [name,setName] = useState("");
  const [userName,setUserName] = useState("");
  const [age,setAge] = useState(0);
  const [nationality,setNationality] = useState("");




  const [movieSearched,setMovieSearched] = useState("");
  const {data,loading,refetch} = useQuery(QUERY_ALL_USERS);
  const {data:movieData} = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie,{data:movieSearchedData,error:movieError}] = useLazyQuery(GET_MOVIE_BY_NAME);
  const [createUser,{error:mError}] = useMutation(CREATE_USER_MUTATION);
  if(loading)
  {
    return <h1>data is loading...</h1>
  }
  if(data)console.log(data);

  return (
    <div>
      <div>
        <input type = "text" placeholder = "Name..." onChange = {(e)=>setName(e.target.value)}/>
        <input type = "text" placeholder = "Username..." onChange = {(e) => setUserName(e.target.value)}/>
        <input type = "number" placeholder = "age" onChange = {(e) => setAge(e.target.value)}/>
        <input type = "text" placeholder = "Nationality" onChange = {(e)=>setNationality(e.target.value.toUpperCase())} />
        <button
         onClick = {() => {createUser({variables:{input:{name,username:String(userName),age:Number(age),nationality}}
        });
        }}>create user</button>
      </div>
      {data && data.users.map(el => (
        <div>
          <h1>{el.name}</h1>
          <h2>{el.username}</h2>
          <h2>{el.age}</h2>
        </div>
      ))}


      {movieData && movieData.movies.map(el => (
        <h1>{el.name}</h1>
      ))}

      <div>
        <input type = "text" placeholder = "Interstellar..."
         onChange = {(e)=>setMovieSearched(e.target.value)}
          />
        <button onClick = {()=>{fetchMovie({variables:{
           name:movieSearched
        }})}}>Fetch Data</button>
        <div>
           {movieSearchedData && (
             <div>
               <h1>movieName:{movieSearchedData.movie.name}</h1>
             </div>
           )}
           {movieError && <div>There was an error fetching the data...</div>}
        </div>
      </div>
    </div>
  )
}

export default DisplayData