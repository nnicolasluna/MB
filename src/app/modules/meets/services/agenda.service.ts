import { Injectable } from '@angular/core';
import { BaseExistsService } from '@shared/services';
import { AgendaModel } from '../interfaces/agenda.interface';

@Injectable({
    providedIn: 'root',
})
export class AgendaService extends BaseExistsService<AgendaModel> {
    constructor() {
        super('agenda');
    }
}
