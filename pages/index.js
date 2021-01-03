import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

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
    <div className={styles.container}>
      <Head>
        <title>Chuckopedia</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      <div>

        <h1>Chuckopedia</h1>
        <p>Best database about Chuck&nbsp;Norris</p>
        <h2>{randomSearchJoke || randomCategoryJoke || randomJoke.value}</h2>

        <h3>
          {pickedCategory ? <span>Category: {pickedCategory}</span> : null}
        </h3>

        <div>
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
        </div>

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
      </div>
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
