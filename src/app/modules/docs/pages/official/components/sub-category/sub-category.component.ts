import { CommonModule } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WORK_TABLE_COLUMNS } from '@modules/members/constants/work';
import { WorkActionComponent } from '@modules/members/pages/workmeetings/components/work-action/work-action.component';
import { WorkFormComponent } from '@modules/members/pages/workmeetings/components/work-form/work-form.component';
import { WorkService } from '@modules/members/services/work.service';
import { RoleParams } from '@modules/users/interfaces';
import { BaseListFiltersComponent } from '@shared/components';
import { ActionClickEvent, ColumnTableModel } from '@shared/interfaces';
import { BaseCRUDHttpService } from '@shared/services';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { SubCategoryCreateFormComponent } from '../sub-category-create-form/sub-category-create-form.component';
import { SubDocsService } from '@modules/docs/services/Subdocs.service';
import { SUB_TABLE_COLUMNS } from '@modules/docs/constants/sub';
import { SubCategoryActionComponent } from "../sub-category-action/sub-category-action.component";
import { ActionType } from '@shared/constants';

@Component({
	selector: 'app-sub-category',
	imports: [
		FormsModule,
		TableModule,
		BreadcrumbModule,
		CheckboxModule,
		ButtonModule,
		SelectButtonModule,
		CardModule,
		CommonModule,
		SubCategoryActionComponent
	],
	templateUrl: './sub-category.component.html',
	styleUrl: './sub-category.component.scss',
})
export class SubCategoryComponent extends BaseListFiltersComponent<any> {
	title: any;
	id: any
	override tableColumns: ColumnTableModel[] = SUB_TABLE_COLUMNS;
	override filters: RoleParams = new RoleParams();
	override service: BaseCRUDHttpService<any> = inject(SubDocsService);
	override formDialog: Type<any> = SubCategoryCreateFormComponent;
	override onActionClick({ data, action }: ActionClickEvent) {
		if (!data?.item?.id) return;
		const { item } = data;
		switch (action) {
			case ActionType.VIEW:
				console.log(data);
				this.showDialogForm('Visualizar Sub Documento', { item, isViewMode: true });
				break;

			case ActionType.EDIT:
				this.showDialogForm('Editar Sub Documento ', { item });
				break;
			case ActionType.DELETE:
				this.service.delete(item.id).subscribe({
					next: () => {
						this.ts.success('Eliminado correctamente');
						this.list();
					},
					error: () => {
						this.ts.error('Error al eliminar');
					},
				});
				break;
		}
	}
	constructor(private route: ActivatedRoute) {
		super();
		this.addBreadcrub({ label: 'Repositorio de Información y Documentos', routerLink: '' });
		this.addBreadcrub({ label: 'Documentos Oficiales', routerLink: '/docs/official' });
	}
	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.title = params.get('name');
			this.id = params.get('id');
		});
	}
	selectedFile: File | null = null;
	fileName: string = '';

	onFileSelected(event: any) {
		this.selectedFile = event.target.files[0];
		if (this.selectedFile) {
			// Aquí obtienes el nombre original
			console.log('Nombre original:', this.selectedFile.name);

			// Puedes generar un nombre único si quieres
			const timestamp = new Date().getTime();
			const extension = this.selectedFile.name.split('.').pop();
			this.fileName = `pdf_${timestamp}.${extension}`;

			console.log('Nombre único generado:', this.fileName);
		}
	}

	uploadPdf() {
		if (!this.selectedFile) return;

		const formData = new FormData();
		formData.append('pdf', this.selectedFile);


	}
	triggerFileInput(fileInput: HTMLInputElement) {
		fileInput.click();
	}
}
