import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from "../../../service/users.service";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged, switchMap, pluck, map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BackgroundService } from "../../../service/BackgroundService";

@Component({
    selector: 'app-upload',
    styleUrls: ['./upload.component.css'],
    templateUrl: './upload.component.html',
    // specifies the template string for the AutoComplete component
    template: `<ejs-autocomplete id='atcelement' [dataSource]='searchData' [fields]='fields' [placeholder]='text' [highlight]='highlight'></ejs-autocomplete>`,
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: true,
    imports: [MatTableModule, NgFor, MatButtonModule, NgIf, MatIconModule, MatCheckboxModule, MatInputModule,
        MatAutocompleteModule, ReactiveFormsModule, FormsModule, AsyncPipe],
})
export class UploadComponent implements OnInit {
    dataSource: DataRow[] = [];
    columnsToDisplay: string[] = [];
    columnsToDisplayWithExpand: string[] = [];
    expandedElement!: DataRow | null;
    file: File | undefined;

    selection = new SelectionModel<DataRow>(true, []);
    selectedItems: DataRow[] = [];
    rowColumns: string[] = [];

    myControl = new FormControl('');
    filteredOptions: Observable<string[]> = new Observable<string[]>();
    @ViewChildren(MatAutocompleteTrigger) autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

    showMessage = false;
    showSuccessMessage = false;
    showErrorMessage = false;
    messageTimeout: any;

    constructor(public router: Router, private http: HttpClient, public userService: UsersService, private backgroundService: BackgroundService) {
        this.backgroundService.backgroundColor = '#FFFFFF';
    }

    ngOnInit() {
        this.setColumnsToDisplay();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(value => this.searchClients(value || ''))
        );
    }

    private _filter(value: string): Observable<string[]> {
        const filterValue = value.toLowerCase();
        return this.searchClients(filterValue);
    }

    searchClients(value: string): Observable<string[]> {
        const filterValue = value.toLowerCase();
        return this.userService.searchClients(filterValue).pipe(
            map(clients => clients.map(client => client.nombre as string))
        );
    }

    onInputBlur(): void {
        this.closeAutocomplete();
    }
    closeAutocomplete() {
        this.autocompleteTriggers.forEach((trigger) => trigger.closePanel());
    }
    /* FIN AUTOCOMPLETE */


    /* CARGA EXCEL */
    onFileChange(event: any) {
        this.file = event.target.files[0];
    }

    uploadFile() {
        if (this.file) {
            const formData: FormData = new FormData();
            formData.append('file', this.file, this.file.name);

            this.userService.uploadExcel(this.file, "RESUMEN").subscribe((response: any) => {
                this.dataSource = response.map((row: DataRow) => {
                    return {
                        cliente: '', // Agrega la propiedad "cliente" con valor inicial en blanco
                        ...row
                    };
                });
                console.log(response);
                this.setColumnsToDisplay();
            },
                (error: any) => {
                    this.dataSource = [];
                    console.error('Error during upload:', error);
                });
        }
    }
    /* FIN CARGA EXCEL */

    /* DISPLAY */
    setColumnsToDisplay() {
        if (this.dataSource.length > 0) {
            const firstRow = this.dataSource[0];
            this.columnsToDisplay = Object.keys(firstRow).slice(0, 7).filter(column => column !== 'cliente');
            this.columnsToDisplayWithExpand = ['select', 'cliente', ...this.columnsToDisplay, 'expand'];
            this.rowColumns = [...this.columnsToDisplayWithExpand];
        }
    }

    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }
    /* FIN DISPLAY */

    /* LOGICA CHECKBOX */

    toggleAllRows() {
        this.closeAutocomplete();

        if (this.isAllSelected()) {
            this.selection.clear();
            this.selectedItems = [];
        } else {
            this.dataSource.forEach(row => this.selection.select(row));
            this.selectedItems = this.dataSource;
        }
    }

    updateSelectedItems() {
        const clienteValue = this.myControl.value;
        this.closeAutocomplete();
        this.selectedItems = this.selection.selected.map((item) => item);
        console.log(this.selectedItems);
        const selectedItemsWithClients = this.selectedItems.map(item => {
            return {
                cliente: clienteValue,
                ...item
            };
        })
        console.log(selectedItemsWithClients);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.length;
        return numSelected === numRows;
    }

    checkboxLabel(row?: DataRow) {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row['position']}`;
    }

    /* FIN LOGICA CHECKBOX */

    /* ENVIO DEL JSON */

    sendSelection() {
        this.closeAutocomplete();
        this.performSelectionSend();
    }

    showInfoMessage() {
        this.showMessage = true;
        this.messageTimeout = setTimeout(() => {
            this.hideInfoMessage();
        }, 3000); // 3 segundos
    }

    hideInfoMessage() {
        this.showMessage = false;
        clearTimeout(this.messageTimeout);
    }

    isClientInputComplete() {
        const selectedItemsWithClients = this.selectedItems.map(item => {
            return {
                cliente: this.myControl.value,
                ...item
            };
        })
        console.log(selectedItemsWithClients);
        for (const row of selectedItemsWithClients) {
            console.log(row["cliente"]);
            if (!row["cliente"] || row["cliente"].trim() === '') {
                return false; // Si el campo "Cliente" no está completo en alguna fila, retorna false
            }
        }
        return true; // Si el campo "Cliente" está completo en todas las filas, retorna true
    }

    performSelectionSend() {
        const payload = {
            selectedItems: this.selectedItems.map(item => {
                return {
                    cliente: this.myControl.value,
                    ...item
                };
            })
        };

        if (this.selectedItems.length > 0) {
            if (this.isClientInputComplete()) {
                this.userService.sendSelectedItemsToBackend(payload).subscribe(
                    (response: any) => {
                        this.selection.clear();
                        this.selectedItems = [];
                        this.myControl.setValue('');
                        this.enableSuccessMessage();
                    },
                    (error: any) => {
                        this.enableErrorMessage();
                    }
                );
            } else {
                this.showInfoMessage();
            }
        }
    }


    enableSuccessMessage() {
        this.showSuccessMessage = true;
        this.messageTimeout = setTimeout(() => {
            this.hideSuccessMessage();
        }, 3000); // 3 segundos
    }

    hideSuccessMessage() {
        this.showSuccessMessage = false;
        clearTimeout(this.messageTimeout);
    }

    enableErrorMessage() {
        this.showErrorMessage = true;
        this.messageTimeout = setTimeout(() => {
            this.hideErrorMessage();
        }, 3000); // 3 segundos
    }

    hideErrorMessage() {
        this.showErrorMessage = false;
        clearTimeout(this.messageTimeout);
    }
    /* FIN ENVIO DEL JSON */
}

interface DataRow {
    [key: string]: any;
}
