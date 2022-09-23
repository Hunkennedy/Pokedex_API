import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) { }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });
    if (!pokemon && typeof term === 'string') pokemon = await this.pokemonModel.findOne({ name: term });
    if (!pokemon && isValidObjectId(term)) pokemon = await this.pokemonModel.findById(term);
    if (!pokemon) throw new NotFoundException(`Object with ${+term} not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (!pokemon) throw new NotFoundException();
    try {
      if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      return await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(term: string) {
    const pokemon = await this.findOne(term);
    pokemon.deleteOne();
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Cannot change the key value`);
    throw new InternalServerErrorException(`Can't change the pokemon`);
  }
}