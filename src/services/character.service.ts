import api from './api.service';
import { ApiResponse, Character, CharacterResponse } from '../types/api.types';

export const getCharacters = async (page: number = 1): Promise<ApiResponse<Character[]>> => {
  const response = await api.get<ApiResponse<Character[]>>(`/character?page=${page}&pageSize=50`);
  return response.data;
};

export const getCharacterById = async (id: number): Promise<Character> => {
  const response = await api.get<CharacterResponse>(`/character/${id}`);
  return response.data.data;
};

export const searchCharacters = async (name: string): Promise<ApiResponse<Character[]>> => {
  const response = await api.get<ApiResponse<Character[]>>(`/character?name=${encodeURIComponent(name)}`);
  return response.data;
};
