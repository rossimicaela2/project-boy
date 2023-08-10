import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersService } from "../../../service/users.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { BackgroundService } from "../../../service/BackgroundService";

@Component({
    selector: "app-movimientos",
    templateUrl: "./movimientos.component.html",
    styleUrls: ["./movimientos.component.css"],
})
export class MovimientosComponent implements AfterViewInit {
    displayedColumns: string[] = ['nombre', 'fecha', 'url'];
    dataSource: MatTableDataSource<DataRow>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    showPdfPopup: boolean = false;
    selectedPdfBlob: Blob | null = null;

    constructor(private http: HttpClient, public userService: UsersService, public router: Router, private backgroundService: BackgroundService) {
        this.backgroundService.backgroundColor = '#FFFFFF';
        this.dataSource = new MatTableDataSource<DataRow>([]);
        this.searchDocuments();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = "Cantidad a mostrar";
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    searchDocuments() {
        this.userService.listado().subscribe(
            (response: any) => {
                const dataRows: DataRow[] = response.map((item: any) => ({
                    nombre: item.nombre,
                    fecha: item.fecha,
                    url: item.url
                }));
                this.dataSource.data = dataRows;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            (error: any) => {
                this.dataSource.data = [];
                console.error("Error during upload:", error);
            }
        );
    }

    downloadFile(row: DataRow, event: Event) {
        event.preventDefault(); // Prevenir comportamiento predeterminado del enlace

        const fileUrl = row.nombre;
        this.userService.downloadFile(fileUrl).subscribe(
            (data: any) => {
                const blob = new Blob([data], { type: 'application/octet-stream' });
                const url = window.URL.createObjectURL(blob);

                var link = document.createElement('a');
                link.href = url;
                link.download = row.nombre;
                link.style.display = 'none';

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            },
            (error: any) => {
                this.dataSource.data = [];
                console.error('Error during download:', error);
            }
        );
    }

    openPopup(row: DataRow, event: Event) {
        event.preventDefault(); // Prevenir comportamiento predeterminado del enlace

        const fileUrl = row.nombre;
        this.userService.downloadFile(fileUrl).subscribe(
            (data: any) => {
                const pdfBlob = new Blob([data], { type: 'application/pdf' });
                this.selectedPdfBlob = pdfBlob;
                this.showPdfPopup = true;
            },
            (error: any) => {
                this.dataSource.data = [];
                console.error('Error durante la descarga:', error);
            }
        );
    }
}

interface DataRow {
    nombre: string;
    fecha: string;
    url: string;
}
