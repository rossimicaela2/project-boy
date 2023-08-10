import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsersService } from "../../../service/users.service";
import { BackgroundService } from "../../../service/BackgroundService";

@Component({
  selector: 'app-load-socios',
  templateUrl: './load-socios.component.html',
  styleUrls: ['./load-socios.component.css']
})
export class LoadSociosComponent implements OnInit {

  fileClient: File | undefined;

  showMessage = false;
  showMessageSuccess = false;
  messageTimeout: any;

  loading: boolean = false;

  constructor(private http: HttpClient, public userService: UsersService, private backgroundService: BackgroundService) {
    this.backgroundService.backgroundColor = '#FFFFFF'; }
  
  ngOnInit() {}

  onFileCLientChange(event: any) {
    this.fileClient = event.target.files[0];
  }

  cargarClientes() {
    if (this.fileClient) {
      const formData: FormData = new FormData();
      formData.append('file', this.fileClient, this.fileClient.name);
      this.loading = true
      this.userService.uploadSocios(this.fileClient).subscribe((response: any) => {
        this.loading = false
        this.showInfoMessageSuccess();
      },
        (error: any) => {
          this.loading = false
          this.showInfoMessage();
        });
    }
  }

  showInfoMessageSuccess() {
    this.showMessageSuccess = true;
    this.messageTimeout = setTimeout(() => {
      this.hideInfoMessageSuccess();
    }, 3000); // 3 segundos
  }

  hideInfoMessageSuccess() {
    this.showMessageSuccess = false;
    clearTimeout(this.messageTimeout);
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
}