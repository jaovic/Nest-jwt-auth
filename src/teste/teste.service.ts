import { RepositoryService } from './../repository/repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TesteService {
  constructor(private readonly repositoryService: RepositoryService) {}
  async teste(req: any) {
    const { id } = req.user;
    const data = await this.repositoryService.findById(id);
    if (data.Refresh_Token === 'null') {
      return {
        message: 'Token invalido',
        status: false,
      };
    }
    return data;
  }
}
