import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private selectedImageUrl$: BehaviorSubject<string | ArrayBuffer | null> = new BehaviorSubject<string | ArrayBuffer | null>(null);
    private selectedImageUrlUpdated$: Subject<void> = new Subject<void>();

    getSelectedImageUrl() {
        return this.selectedImageUrl$.asObservable();
    }

    setSelectedImageUrl(url: string | ArrayBuffer | null) {
        this.selectedImageUrl$.next(url);
        this.selectedImageUrlUpdated$.next(); // Emitir evento de actualización
    }

    getSelectedImageUrlUpdated() {
        return this.selectedImageUrlUpdated$.asObservable();
    }
}
