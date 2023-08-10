import { HttpClient } from '@angular/common/http';
import { UsersService } from "../../../service/users.service";
import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BackgroundService } from "../../../service/BackgroundService";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
    user: any;
    selectedImageUrl: string | ArrayBuffer | null = null;
    avatar: File | null = null;
    loading: boolean = false;
    showMessageSuccess = false;
    messageTimeout: any;
    @ViewChild('parentContainer', { static: true }) parentContainerRef!: ElementRef;

    constructor(private http: HttpClient, public userService: UsersService, private backgroundService: BackgroundService, public router: Router) {
        this.backgroundService.backgroundColor = '#E8EAF6';
    }

    ngOnInit() {
        this.loading = true;
        this.userService.getPersonalInformation().subscribe(
            (response) => {
                this.loading = false;
                console.log(response);
                this.user = response;
                // Establece el atributo `src` de la imagen con el `base64` codificado
                this.selectedImageUrl = "data:image/jpeg;base64," + this.user.avatar;
            },
            (error) => {
                this.loading = false;
                console.error(error);
            }
        );
    }

    ngAfterViewChecked() {
        const parentContainerWidth = this.parentContainerRef.nativeElement.offsetWidth;
        const containerElement = document.getElementById('container');
        if (containerElement !== null) {
            containerElement.style.width = parentContainerWidth + 'px';
        }
    }

    handleAvatarUpload(fileInput: HTMLInputElement) {
        console.log(fileInput);
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const avatarImg = document.getElementById('avatar-img');
                if (avatarImg && e.target) {
                    avatarImg.setAttribute('src', e.target.result as string);
                    this.selectedImageUrl = e.target.result;
                    this.avatar = file;
                }
            };

            reader.readAsDataURL(file);
        }
    }

    updateUser() {
       // TODO validar que en verdad haya cambios para guardar, para no hacer llamados innecesarios. Validar campos vacios
        this.loading = true;
        if (this.avatar) {
            this.userService.updateUser(this.user.name, this.user.email, this.avatar).subscribe(isValid => {
                this.loading = false;
                if (isValid) {
                    this.showInfoMessageSuccess();
                    this.router.navigateByUrl("/home");
                }
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

   
}