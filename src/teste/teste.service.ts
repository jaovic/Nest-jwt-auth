import { RepositoryService } from './../repository/repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TesteService {
  constructor(private readonly repositoryService: RepositoryService) {}
  async teste() {
    return await this.repositoryService.findById(
      '4f749572-97bf-46bb-81c5-20785030a293',
    );
  }
}
