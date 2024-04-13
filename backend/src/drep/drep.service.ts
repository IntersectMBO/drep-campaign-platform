import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createDrepDto } from 'src/dto';
import { Drep } from 'src/entities/drep.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DrepService {
  constructor(@InjectRepository(Drep) private userRepo: Repository<Drep>) {}
  async getAllDreps() {
    const drepList = await this.userRepo.find({});
    return drepList;
  }
  async getSingleDrep(drepId: number) {
    const drepList = await this.userRepo.findOne({ where: { id: drepId } });
    if(!drepList){
        throw new NotFoundException('Drep not found!')
    }
    return drepList;
  }
  async registerDrep(drepDto: createDrepDto) {
    const drep = await this.userRepo.create(drepDto);
    return await this.userRepo.save(drep);
  }
  async updateDrepInfo(drepId: number, drep: createDrepDto) {
    const foundDrep = await this.userRepo.findOne({ where: { id: drepId } });
    if (!foundDrep) {
      throw new NotFoundException('Drep to be updated not found!');
    }
    // Iterate through the properties of the drep object
    Object.keys(drep).forEach((key) => {
      // Update the corresponding field in foundDrep with the value from drep
      foundDrep[key] = drep[key];
    });

    // Save the updated foundDrep object
    return await this.userRepo.save(foundDrep);
  }
}
