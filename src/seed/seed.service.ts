import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interface/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  /**
   * Complete the local database
   */
  public async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0',
    );
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const pokeID: number = parseInt(segments.at(-2));
      console.log({ name, pokeID });
    });
    return data.results;
  }
}
