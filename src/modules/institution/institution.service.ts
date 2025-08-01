import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from '../../database/entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private institutionRepository: Repository<Institution>,
  ) {}

  create(createInstitutionDto: CreateInstitutionDto) {
    const institution = this.institutionRepository.create(createInstitutionDto);
    return this.institutionRepository.save(institution);
  }

  findAll() {
    return this.institutionRepository.find();
  }

  findOne(id: number) {
    return this.institutionRepository.findOne({ where: { id } });
  }

  update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
    return this.institutionRepository.update(id, updateInstitutionDto);
  }

  remove(id: number) {
    return this.institutionRepository.delete(id);
  }
}
