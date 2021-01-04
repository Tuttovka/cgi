import React from "react";
import Head from "next/head";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";


export default function Home({ randomJoke, jokeCategories }) {
  const [pickedCategory, setPickedCategory] = React.useState(null);
  const [randomCategoryJoke, setRandomCategoryJoke] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [randomSearchJoke, setRandomSearchJoke] = React.useState(null);

  async function getAPIResults({ endpoint, query }) {
    const request = await fetch(`${endpoint}${query}`);
    const results = await request.json();

    return results;
  }

  function getRandomJokeFromArray(jokes, totalJokes) {
    return jokes[Math.floor(Math.random() * totalJokes)]?.value;
  }

  async function getJokeFromPickedCategory(category) {
    setSearchQuery("");
    setRandomSearchJoke(null);

    setPickedCategory(category);

    const randomCategoryJokeResults = await getAPIResults({
      endpoint: "https://api.chucknorris.io/jokes/random?category=",
      query: category,
    });
    const randomCategoryJoke = randomCategoryJokeResults.value;

    setRandomCategoryJoke(randomCategoryJoke);
  }

  async function getJokeFromSearch(query) {
    setPickedCategory(null);
    setRandomCategoryJoke(null);

    const getJokeFromSearchResults = await getAPIResults({
      endpoint: "https://api.chucknorris.io/jokes/search?query=",
      query,
    });
    const randomSearchJoke = getRandomJokeFromArray(
      getJokeFromSearchResults.result,
      getJokeFromSearchResults.total
    );

    setRandomSearchJoke(randomSearchJoke);
  }

  return (
    <div>
      <Head>
        <title>Chuckopedia</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;display=swap"
        />
      </Head>
      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          align="center"
          p={5}
          m={1}
          bgcolor="error.main"
          border={2}
          borderTop={0}
          borderColor="grey.500"
          borderRadius="2%"
        >
          <h1>Chuckopedia</h1>
          <p>The Worst Database about Chuck&nbsp;Norris</p>
        </Box>
        <Box display="flex" align="center">
          <h2>{randomSearchJoke || randomCategoryJoke || randomJoke.value}</h2>
          <h3>
            {pickedCategory ? <span>Category: {pickedCategory}</span> : null}
          </h3>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
        >
          {jokeCategories.map((jokeCategory) => (
            <ul key={jokeCategory}>
              <li>
                <a
                  href="#"
                  onClick={() => {
                    getJokeFromPickedCategory(jokeCategory);
                  }}
                >
                  {jokeCategory}
                </a>
              </li>
            </ul>
          ))}
        </Box>
        <Box display="flex" align="center">
          <input
            type="text"
            placeholder="Search joke"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);

              // 3 characters are needed for successful searching in API
              if (value.length >= 3) {
                getJokeFromSearch(value);
              }
            }}
          />
        </Box>
      </Container>
    </div>
  );
}

Home.getInitialProps = async (ctx) => {
  const randomJokeRequest = await fetch(
    "https://api.chucknorris.io/jokes/random"
  );
  const randomJoke = await randomJokeRequest.json();

  const jokeCategoriesRequest = await fetch(
    "https://api.chucknorris.io/jokes/categories"
  );
  const jokeCategories = await jokeCategoriesRequest.json();

  return { randomJoke, jokeCategories };
};
