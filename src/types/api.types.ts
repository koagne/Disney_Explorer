export interface Character {
  _id: number;
  name: string;
  imageUrl?: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  info: {
    count: number;
    totalPages: number;
    previousPage: string | null;
    nextPage: string | null;
  };
}

export interface CharacterResponse {
  data: Character;
}
