const data = require("./json/data.json");
const fs = require("fs");

interface Result {
  episodes: FinalEpisode[];
  characters: FinalCharacter[];
  quotes: FinalQuote[];
}

type InitialCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  hair: string;
  alias: string[];
  origin: string;
  abilities: string[];
  img_url: string;
  quote: InitialQuote;
};

type InitialQuote = {
  id: number;
  quote: string;
  by: string;
  character: string;
  image: string;
};

interface FinalQuote extends InitialQuote {
  episode_id: number;
  character_id: number;
}

interface FinalCharacter extends InitialCharacter {
  episode_ids: number[];
}

type FinalEpisode = {
  id: number;
  name: string;
  air_date: string;
  director: string;
  writer: string;
  character_count: number;
  img_url: string;
};

type InitialEpisode = {
  id: number;
  name: string;
  air_date: string;
  director: string;
  writer: string;
  characters: InitialCharacter[];
  img_url: string;
};

async function handleData() {
  const episodes: FinalEpisode[] = [];
  const characters: FinalCharacter[] = [];
  const quotes: FinalQuote[] = [];

  data.forEach((episode: InitialEpisode) => {
    // 1.For the Episodes we would only like
    // the episode information without characters array, and include the character count.
    const { characters: episodeCharacters, ...newEpisode } = episode;
    const returnObj: FinalEpisode = {
      ...newEpisode,
      character_count: episodeCharacters?.length ?? 0,
    };
    episodes.push(returnObj);

    // 2. For the Characters we would like a unique array of all the characters
    // that appear from all the episodes and which episodes they appeared in.
    // loop through all the characters in the episode
    if (episode.characters) {
      episode?.characters.forEach((episodeCharacter) => {
        // check if the character is already in characters obj, if not add
        const characterIndex = characters.findIndex(
          (character) => character.id === episodeCharacter.id
        );
        if (characterIndex >= 0) {
          //   console.log("aleady have");

          const updatedEpisodeIds: number[] = [
            // this gets rid of duplicate episode ids
            ...new Set([
              ...characters[characterIndex].episode_ids,
              episodeCharacter.id,
            ]),
          ];

          characters[characterIndex].episode_ids = updatedEpisodeIds;
        } else {
          characters.push({
            ...episodeCharacter,
            episode_ids: [episodeCharacter.id],
          });
        }

        // 3. For the Quotes we would like a unique array of all the quotes with a character ID
        // reference and the episode ID reference.
        // this is the quote part.
        // If no quote, return early.
        if (!episodeCharacter.quote) {
          return;
        }

        quotes.push({
          ...episodeCharacter.quote,
          character_id: episodeCharacter.id,
          episode_id: episode.id,
        });
      });
    }
  });

  const result: Result = {
    quotes: quotes.sort(({ id: idA }, { id: idB }) => {
      return idA - idB;
    }),
    episodes,
    characters,
  };

  //   console.log(result);

  // Write the data to files.
  fs.writeFileSync(
    "json/quotes.json",
    JSON.stringify(result.quotes, null, "\t")
  );
  fs.writeFileSync(
    "json/characters.json",
    JSON.stringify(result.characters, null, "\t")
  );
  fs.writeFileSync(
    "json/episodes.json",
    JSON.stringify(result.episodes, null, "\t")
  );
  return result;
}

handleData();
