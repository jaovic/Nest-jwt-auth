import { RepositoryService } from './../repository/repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TesteService {
  constructor(private readonly repositoryService: RepositoryService) {}
  async teste(req: any) {
    const { id } = req.user;
    return await this.repositoryService.findById(id);
  }
}
